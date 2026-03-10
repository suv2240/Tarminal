// ─── Stock & Market Types ──────────────────────────────────────────────────

export interface StockQuote {
  symbol: string
  company: string
  price: number
  change: number
  changePercent: number
  volume: number
  high52w: number
  low52w: number
  marketCap: number
  pe: number
  eps: number
  roe: number
  dividendYield: number
  sector: string
  lastUpdated: string
}

export interface IndexData {
  name: string
  symbol: string
  value: number
  change: number
  changePercent: number
}

export interface MarketMover {
  symbol: string
  company: string
  price: number
  change: number
  changePercent: number
  volume: number
}

export interface OHLCData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// ─── Portfolio Types ────────────────────────────────────────────────────────

export interface Holding {
  id: string
  userId?: string
  symbol: string
  company: string
  quantity: number
  buyPrice: number
  currentPrice?: number
  sector?: string
  addedAt: string
}

export interface PortfolioSummary {
  totalInvested: number
  currentValue: number
  totalPnL: number
  totalPnLPercent: number
  dayChange: number
  dayChangePercent: number
}

// ─── News & Events Types ────────────────────────────────────────────────────

export type NewsCategory = 'stock' | 'trade' | 'geopolitical' | 'macro' | 'earnings' | 'ipo'

export interface NewsArticle {
  id: string
  title: string
  summary: string
  source: string
  url: string
  publishedAt: string
  category: NewsCategory
  sentiment: 'positive' | 'negative' | 'neutral'
  relatedSymbols?: string[]
  country?: string
}

export type ImpactLevel = 'high' | 'medium' | 'low'

export interface GlobalEvent {
  id: string
  country: string
  countryCode: string
  lat: number
  lng: number
  title: string
  summary: string
  category: 'central-bank' | 'gdp' | 'inflation' | 'geopolitical' | 'commodity' | 'ipo' | 'earnings'
  impact: ImpactLevel
  date: string
  source?: string
}

// ─── Economic Calendar Types ─────────────────────────────────────────────────

export interface EconomicEvent {
  id: string
  title: string
  date: string
  time?: string
  category: 'rbi' | 'budget' | 'gdp' | 'inflation' | 'ipo' | 'earnings' | 'other'
  impact: ImpactLevel
  actual?: string
  forecast?: string
  previous?: string
  description?: string
}

// ─── Screener Types ─────────────────────────────────────────────────────────

export interface ScreenerFilters {
  peMin?: number
  peMax?: number
  marketCap?: 'large' | 'mid' | 'small' | 'all'
  dividendYieldMin?: number
  roeMin?: number
  sector?: string
  search?: string
}

export type SortField = 'symbol' | 'price' | 'change' | 'pe' | 'marketCap' | 'dividendYield' | 'roe'
export type SortDirection = 'asc' | 'desc'

// ─── Alert Types ─────────────────────────────────────────────────────────────

export type AlertCondition = 'above' | 'below' | 'change_percent'

export interface PriceAlert {
  id: string
  symbol: string
  company: string
  condition: AlertCondition
  targetValue: number
  currentValue?: number
  triggered: boolean
  createdAt: string
  triggeredAt?: string
}

// ─── AI Types ────────────────────────────────────────────────────────────────

export interface AIStockSummary {
  symbol: string
  trend: 'bullish' | 'bearish' | 'neutral'
  support: number
  resistance: number
  riskLevel: 'low' | 'medium' | 'high'
  summary: string
  generatedAt: string
}

export interface AIEarningsSummary {
  symbol: string
  quarter: string
  bulletPoints: string[]
  sentiment: 'positive' | 'negative' | 'mixed'
  generatedAt: string
}

// ─── Govt Policy Types ──────────────────────────────────────────────────────

export interface GovtPolicy {
  id: string
  title: string
  category: string
  date: string
  description: string
  impactedStocks: PolicyImpact[]
}

export interface PolicyImpact {
  symbol: string
  company: string
  direction: 'positive' | 'negative' | 'neutral'
  reason: string
}
