import type { NewsArticle, NewsCategory, GlobalEvent } from '@/types'
import { MOCK_NEWS, MOCK_GLOBAL_EVENTS } from './mockData'

const MARKETAUX_BASE = 'https://api.marketaux.com/v1'
const FINNHUB_BASE = 'https://finnhub.io/api/v1'

// ─── Marketaux ───────────────────────────────────────────────────────────────

async function fetchMarketauxNews(params: {
  symbols?: string
  countries?: string
  language?: string
  limit?: number
  keywords?: string
}): Promise<NewsArticle[]> {
  const key = process.env.MARKETAUX_API_KEY
  if (!key) return []

  const searchParams = new URLSearchParams({
    api_token: key,
    language: params.language || 'en',
    limit: String(params.limit || 10),
    ...(params.symbols && { symbols: params.symbols }),
    ...(params.countries && { countries: params.countries }),
    ...(params.keywords && { search: params.keywords }),
  })

  try {
    const res = await fetch(`${MARKETAUX_BASE}/news/all?${searchParams}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    })
    if (res.status === 401 || res.status === 403) {
      console.warn(`[Marketaux] Auth error ${res.status}`)
      return []
    }
    if (!res.ok) return []

    const data = await res.json()
    if (!Array.isArray(data.data)) return []

    return data.data.map((item: Record<string, unknown>) => {
      const entities = (item.entities as Array<{ symbol: string }>) || []
      return {
        id: (item.uuid as string) || String(Math.random()),
        title: (item.title as string) || '',
        summary: (item.description as string) || (item.snippet as string) || '',
        source: (item.source as string) || 'Marketaux',
        url: (item.url as string) || '#',
        publishedAt: (item.published_at as string) || new Date().toISOString(),
        category: classifyCategory(item.title as string, item.description as string),
        sentiment: mapSentiment((item.sentiment as string) || 'neutral'),
        relatedSymbols: entities.map(e => e.symbol).filter(Boolean),
        country: (item.countries as string[])?.[0] || 'IN',
      }
    })
  } catch (err) {
    console.warn('[Marketaux] fetch failed:', (err as Error).message)
    return []
  }
}

// ─── Finnhub ─────────────────────────────────────────────────────────────────

async function fetchFinnhubNews(category = 'general'): Promise<NewsArticle[]> {
  const key = process.env.FINNHUB_API_KEY
  if (!key) return []

  try {
    const res = await fetch(
      `${FINNHUB_BASE}/news?category=${category}&token=${key}`,
      {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(8000),
      }
    )
    if (res.status === 401 || res.status === 403) {
      console.warn(`[Finnhub] Auth error ${res.status}`)
      return []
    }
    if (!res.ok) return []

    const data: Array<Record<string, unknown>> = await res.json()
    if (!Array.isArray(data)) return []

    // Filter for India-relevant news
    const indiaKeywords = ['india', 'nse', 'bse', 'sensex', 'nifty', 'rbi', 'sebi', 'rupee', 'inr']
    const filtered = data.filter(item => {
      const text = `${item.headline} ${item.summary}`.toLowerCase()
      return indiaKeywords.some(k => text.includes(k))
    })

    // If no India-specific news, take top global financial news
    const finalData = filtered.length >= 5 ? filtered : data.slice(0, 15)

    return finalData.slice(0, 20).map(item => ({
      id: String(item.id || Math.random()),
      title: (item.headline as string) || '',
      summary: (item.summary as string) || '',
      source: (item.source as string) || 'Finnhub',
      url: (item.url as string) || '#',
      publishedAt: item.datetime
        ? new Date((item.datetime as number) * 1000).toISOString()
        : new Date().toISOString(),
      category: classifyCategory(item.headline as string, item.summary as string),
      sentiment: 'neutral' as const,
      relatedSymbols: item.related ? [(item.related as string)] : [],
    }))
  } catch (err) {
    console.warn('[Finnhub] fetch failed:', (err as Error).message)
    return []
  }
}

// ─── GNews fallback (free, no key needed) ────────────────────────────────────

async function fetchGNewsIndia(): Promise<NewsArticle[]> {
  try {
    const res = await fetch(
      'https://gnews.io/api/v4/search?q=india+stock+market+NSE+BSE&lang=en&country=in&max=10&apikey=free',
      { next: { revalidate: 600 }, signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) return []
    const data = await res.json()
    if (!Array.isArray(data.articles)) return []

    return data.articles.map((item: Record<string, unknown>, i: number) => ({
      id: String(i),
      title: (item.title as string) || '',
      summary: (item.description as string) || '',
      source: ((item.source as Record<string, string>)?.name) || 'GNews',
      url: (item.url as string) || '#',
      publishedAt: (item.publishedAt as string) || new Date().toISOString(),
      category: classifyCategory(item.title as string, item.description as string),
      sentiment: 'neutral' as const,
      relatedSymbols: [],
    }))
  } catch {
    return []
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function fetchIndiaNews(category?: NewsCategory, limit = 20): Promise<NewsArticle[]> {
  const keywords = getCategoryKeywords(category)

  const [marketauxResult, finnhubResult, gnewsResult] = await Promise.allSettled([
    fetchMarketauxNews({ countries: 'in', keywords, limit: Math.ceil(limit / 2) }),
    fetchFinnhubNews('general'),
    fetchGNewsIndia(),
  ])

  const marketaux = marketauxResult.status === 'fulfilled' ? marketauxResult.value : []
  const finnhub = finnhubResult.status === 'fulfilled' ? finnhubResult.value : []
  const gnews = gnewsResult.status === 'fulfilled' ? gnewsResult.value : []

  const live = [...marketaux, ...finnhub, ...gnews]

  if (live.length === 0) {
    console.info('[News] All APIs failed, serving mock news')
    return MOCK_NEWS.slice(0, limit)
  }

  // Deduplicate + sort
  const seen = new Set<string>()
  return live
    .filter(n => {
      if (!n.title) return false
      const key = n.title.substring(0, 60).toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}

export async function fetchStockNews(symbol: string, limit = 10): Promise<NewsArticle[]> {
  const ticker = symbol.replace('.NS', '').replace('.BO', '')
  const live = await fetchMarketauxNews({ symbols: ticker, limit })
  if (live.length === 0) {
    return MOCK_NEWS.filter(n =>
      n.relatedSymbols?.some(s => s.includes(ticker))
    ).slice(0, limit)
  }
  return live
}

export async function fetchGlobalEvents(): Promise<GlobalEvent[]> {
  return MOCK_GLOBAL_EVENTS
}

export async function fetchEconomicCalendar() {
  const key = process.env.FINNHUB_API_KEY
  if (!key) return []
  try {
    const from = new Date().toISOString().split('T')[0]
    const to = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const res = await fetch(
      `${FINNHUB_BASE}/calendar/economic?from=${from}&to=${to}&token=${key}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.economicCalendar || []
  } catch {
    return []
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function classifyCategory(title = '', description = ''): NewsCategory {
  const text = `${title} ${description}`.toLowerCase()
  if (/earnings|quarterly|q[1-4] results|pat|revenue|profit|ebitda/.test(text)) return 'earnings'
  if (/ipo|listing|issue price/.test(text)) return 'ipo'
  if (/oil|gold|silver|metal|commodity|crude|wheat|grain/.test(text)) return 'trade'
  if (/war|conflict|sanction|geopoliti|military/.test(text)) return 'geopolitical'
  if (/rbi|fed|ecb|rate|gdp|cpi|inflation|monetary|budget/.test(text)) return 'macro'
  return 'stock'
}

function getCategoryKeywords(category?: NewsCategory): string {
  switch (category) {
    case 'earnings': return 'earnings quarterly results profit revenue'
    case 'ipo': return 'IPO listing initial public offering'
    case 'trade': return 'oil commodity gold metals trade'
    case 'geopolitical': return 'war conflict sanctions geopolitical'
    case 'macro': return 'RBI Fed rate GDP inflation budget'
    default: return 'stock market India NSE BSE'
  }
}

function mapSentiment(raw: string): 'positive' | 'negative' | 'neutral' {
  if (/positive/i.test(raw)) return 'positive'
  if (/negative/i.test(raw)) return 'negative'
  return 'neutral'
}
