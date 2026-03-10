import type { StockQuote, MarketMover, IndexData } from '@/types'
import { MOCK_STOCKS, MOCK_GAINERS, MOCK_LOSERS, MOCK_HIGH_VOLUME, MOCK_INDICES } from './mockData'

const BASE_URL = process.env.NSE_API_BASE_URL || 'https://nse-api-khaki.vercel.app'

// Helper: map raw API response to StockQuote
function mapToStockQuote(raw: Record<string, unknown>, symbol: string): StockQuote {
  return {
    symbol,
    company: (raw.company_name as string) || (raw.companyName as string) || symbol,
    price: Number(raw.last_price || raw.lastPrice || raw.price || 0),
    change: Number(raw.change || 0),
    changePercent: Number(raw.p_change || raw.pChange || raw.change_percent || 0),
    volume: Number(raw.total_traded_volume || raw.totalTradedVolume || raw.volume || 0),
    high52w: Number(raw.week_high_52 || raw.high52 || 0),
    low52w: Number(raw.week_low_52 || raw.low52 || 0),
    marketCap: Number(raw.market_cap || raw.marketCap || 0),
    pe: Number(raw.p_e || raw.pe || 0),
    eps: Number(raw.eps || 0),
    roe: Number(raw.roe || 0),
    dividendYield: Number(raw.dividend_yield || raw.dividendYield || 0),
    sector: (raw.sector as string) || (raw.industry as string) || 'Unknown',
    lastUpdated: new Date().toISOString(),
  }
}

async function apiFetch(path: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function fetchStock(symbol: string): Promise<StockQuote | null> {
  const clean = symbol.replace('.NS', '').replace('.BO', '')
  const data = await apiFetch(`/stock?symbol=${clean}&res=num`)
  if (data) return mapToStockQuote(data, symbol)
  return MOCK_STOCKS.find(s => s.symbol === symbol) || null
}

export async function fetchStockList(symbols: string[]): Promise<StockQuote[]> {
  const cleans = symbols.map(s => s.replace('.NS', '').replace('.BO', '')).join(',')
  const data = await apiFetch(`/stock/list?symbols=${cleans}&res=num`)
  if (data && Array.isArray(data)) {
    return (data as Record<string, unknown>[]).map(item =>
      mapToStockQuote(item, (item.symbol as string) || '')
    )
  }
  return MOCK_STOCKS.filter(s => symbols.includes(s.symbol))
}

export async function fetchMarketMovers(): Promise<{
  gainers: MarketMover[]
  losers: MarketMover[]
  highVolume: MarketMover[]
}> {
  const watchlist = [
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC',
    'SBIN', 'BAJFINANCE', 'MARUTI', 'SUNPHARMA', 'WIPRO',
    'ONGC', 'TATAMOTORS', 'ASIANPAINT', 'POWERGRID', 'LTIM',
  ]

  const data = await apiFetch(`/stock/list?symbols=${watchlist.join(',')}&res=num`)

  let stocks: StockQuote[] = []
  if (data && Array.isArray(data)) {
    stocks = (data as Record<string, unknown>[]).map(item =>
      mapToStockQuote(item, (item.symbol as string) + '.NS')
    ).filter(s => s.price > 0)
  }

  if (stocks.length < 3) {
    stocks = MOCK_STOCKS
  }

  const gainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5)
  const losers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5)
  const highVolume = [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 5)

  return { gainers, losers, highVolume }
}

export async function fetchIndices(): Promise<IndexData[]> {
  // Try fetching major indices individually
  const indexSymbols = [
    { symbol: 'NIFTY 50', key: 'NIFTY', name: 'NIFTY 50' },
    { symbol: 'SENSEX', key: 'SENSEX', name: 'SENSEX' },
    { symbol: 'BANKNIFTY', key: 'BANKNIFTY', name: 'BANK NIFTY' },
  ]

  const results = await Promise.allSettled(
    indexSymbols.map(idx => apiFetch(`/stock?symbol=${idx.key}&res=num`))
  )

  const indices: IndexData[] = []
  results.forEach((result, i) => {
    if (result.status === 'fulfilled' && result.value) {
      const raw = result.value
      const value = Number(raw.last_price || raw.lastPrice || 0)
      if (value > 0) {
        indices.push({
          name: indexSymbols[i].name,
          symbol: indexSymbols[i].key,
          value,
          change: Number(raw.change || 0),
          changePercent: Number(raw.p_change || raw.pChange || 0),
        })
      }
    }
  })

  // Fall back to mock if nothing came back
  return indices.length > 0 ? [...indices, ...MOCK_INDICES.slice(indices.length)] : MOCK_INDICES
}

export async function fetchSymbols(): Promise<string[]> {
  const data = await apiFetch('/symbols')
  if (Array.isArray(data)) return data as string[]
  return MOCK_STOCKS.map(s => s.symbol)
}

export async function searchStocks(query: string): Promise<StockQuote[]> {
  const data = await apiFetch(`/search?q=${encodeURIComponent(query)}`)
  if (Array.isArray(data)) {
    return (data as Record<string, unknown>[]).map(item =>
      mapToStockQuote(item, (item.symbol as string) || query)
    )
  }
  return MOCK_STOCKS.filter(s =>
    s.company.toLowerCase().includes(query.toLowerCase()) ||
    s.symbol.toLowerCase().includes(query.toLowerCase())
  )
}
