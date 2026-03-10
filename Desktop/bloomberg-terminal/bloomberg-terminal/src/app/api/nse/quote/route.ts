import { NextRequest, NextResponse } from 'next/server'
import { MOCK_STOCKS } from '@/lib/mockData'

// NSE India headers — required to bypass bot protection
const NSE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://www.nseindia.com/',
  'Origin': 'https://www.nseindia.com',
  'Connection': 'keep-alive',
}

async function getNSECookies(): Promise<string> {
  try {
    const res = await fetch('https://www.nseindia.com/', {
      headers: NSE_HEADERS,
      signal: AbortSignal.timeout(8000),
    })
    const setCookie = res.headers.get('set-cookie') || ''
    // Extract cookie values
    const cookies = setCookie.split(',')
      .map(c => c.split(';')[0].trim())
      .filter(Boolean)
      .join('; ')
    return cookies
  } catch {
    return ''
  }
}

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get('symbol') || 'RELIANCE'
  const clean = symbol.replace('.NS', '').replace('.BO', '').toUpperCase()

  try {
    const cookies = await getNSECookies()

    const res = await fetch(
      `https://www.nseindia.com/api/quote-equity?symbol=${encodeURIComponent(clean)}`,
      {
        headers: { ...NSE_HEADERS, Cookie: cookies },
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!res.ok) throw new Error(`NSE returned ${res.status}`)

    const data = await res.json()
    const info = data.info || {}
    const pd = data.priceInfo || {}
    const meta = data.metadata || {}

    const price = Number(pd.lastPrice || pd.close || 0)
    const prevClose = Number(pd.previousClose || pd.close || 0)
    const change = Number(pd.change || (price - prevClose))
    const changePercent = Number(pd.pChange || (prevClose > 0 ? (change / prevClose) * 100 : 0))

    return NextResponse.json({
      symbol: clean + '.NS',
      company: info.companyName || meta.companyName || clean,
      price,
      change,
      changePercent,
      volume: Number(pd.totalTradedVolume || pd.quantityTraded || 0),
      high: Number(pd.intraDayHighLow?.max || pd.high || 0),
      low: Number(pd.intraDayHighLow?.min || pd.low || 0),
      high52w: Number(pd.weekHighLow?.max || 0),
      low52w: Number(pd.weekHighLow?.min || 0),
      open: Number(pd.open || 0),
      previousClose: prevClose,
      sector: info.industry || '',
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    })
  } catch (err) {
    console.warn('[NSE Quote] Falling back to mock:', (err as Error).message)
    const mock = MOCK_STOCKS.find(s => s.symbol === clean + '.NS')
    if (mock) return NextResponse.json(mock)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
