'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import type { StockQuote, MarketMover, NewsArticle, IndexData } from '@/types'
import { useAppStore } from '@/store/zustandStore'
import { simulatePriceChange } from '@/lib/utils'
import { MOCK_INDICES, MOCK_STOCKS, MOCK_GAINERS, MOCK_LOSERS, MOCK_HIGH_VOLUME, MOCK_NEWS } from '@/lib/mockData'

// Hook: poll market indices every 3 seconds
export function useMarketIndices() {
  const [indices, setIndices] = useState<IndexData[]>(MOCK_INDICES)
  const [loading, setLoading] = useState(false)
  const storeSetIndices = useAppStore(s => s.setIndices)

  const fetchIndices = useCallback(async () => {
    try {
      const res = await fetch('/api/nse/indices')
      if (res.ok) {
        const data = await res.json()
        if (data.indices?.length) {
          setIndices(data.indices)
          storeSetIndices(data.indices)
          return
        }
      }
    } catch {}
    
    // Simulate real-time via mock mutation
    setIndices(prev => prev.map(idx => ({
      ...idx,
      value: simulatePriceChange(idx.value, 0.0005),
      change: idx.change + (Math.random() - 0.5) * 2,
      changePercent: idx.changePercent + (Math.random() - 0.5) * 0.05,
    })))
  }, [storeSetIndices])

  useEffect(() => {
    setLoading(true)
    fetchIndices().finally(() => setLoading(false))
    const interval = setInterval(fetchIndices, 3000)
    return () => clearInterval(interval)
  }, [fetchIndices])

  return { indices, loading }
}

// Hook: poll a single stock every 2 seconds
export function useStockData(symbol: string) {
  const cache = useAppStore(s => s.stockCache)
  const setCache = useAppStore(s => s.setStockCache)
  const [stock, setStock] = useState<StockQuote | null>(cache[symbol] || MOCK_STOCKS.find(s => s.symbol === symbol) || null)
  const [loading, setLoading] = useState(!cache[symbol])

  const fetchStock = useCallback(async () => {
    try {
      const res = await fetch(`/api/nse/quote?symbol=${encodeURIComponent(symbol)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.stock) {
          setStock(data.stock)
          setCache(symbol, data.stock)
          return
        }
      }
    } catch {}

    setStock(prev => {
      if (!prev) return prev
      const newPrice = simulatePriceChange(prev.price)
      const change = newPrice - prev.price
      const changePercent = (change / prev.price) * 100
      const updated = { ...prev, price: newPrice, change, changePercent, lastUpdated: new Date().toISOString() }
      setCache(symbol, updated)
      return updated
    })
  }, [symbol, setCache])

  useEffect(() => {
    setLoading(true)
    fetchStock().finally(() => setLoading(false))
    const interval = setInterval(fetchStock, 2000)
    return () => clearInterval(interval)
  }, [fetchStock])

  return { stock, loading }
}

// Hook: market movers (gainers/losers/volume)
export function useMarketMovers() {
  const [gainers, setGainers] = useState<MarketMover[]>(MOCK_GAINERS)
  const [losers, setLosers] = useState<MarketMover[]>(MOCK_LOSERS)
  const [highVolume, setHighVolume] = useState<MarketMover[]>(MOCK_HIGH_VOLUME)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetch_() {
      setLoading(true)
      try {
        const res = await fetch('/api/nse/movers')
        if (res.ok) {
          const data = await res.json()
          if (data.gainers) setGainers(data.gainers)
          if (data.losers) setLosers(data.losers)
          if (data.highVolume) setHighVolume(data.highVolume)
        }
      } catch {}
      setLoading(false)
    }
    fetch_()
    const interval = setInterval(fetch_, 5000)
    return () => clearInterval(interval)
  }, [])

  return { gainers, losers, highVolume, loading }
}

// Hook: news feed
export function useNewsFeed(category?: string) {
  const [news, setNews] = useState<NewsArticle[]>(MOCK_NEWS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetch_() {
      setLoading(true)
      try {
        const url = `/api/news${category ? `?category=${category}` : ''}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          if (data.news?.length) setNews(data.news)
        }
      } catch {}
      setLoading(false)
    }
    fetch_()
    const interval = setInterval(fetch_, 60000) // refresh every minute
    return () => clearInterval(interval)
  }, [category])

  return { news, loading }
}

// Hook: watchlist with real-time prices
export function useWatchlistData() {
  const watchlist = useAppStore(s => s.watchlist)
  const [stocks, setStocks] = useState<StockQuote[]>([])
  const [loading, setLoading] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const fetchWatchlist = useCallback(async () => {
    if (watchlist.length === 0) { setStocks([]); return }
    try {
      // Fetch each stock from nsejs route
      const results = await Promise.allSettled(
        watchlist.map(sym =>
          fetch(`/api/nse/quote?symbol=${encodeURIComponent(sym)}`).then(r => r.ok ? r.json() : null)
        )
      )
      const live = results
        .map(r => r.status === 'fulfilled' ? r.value : null)
        .filter(d => d && d.price > 0) as StockQuote[]

      if (live.length > 0) { setStocks(live); return }
    } catch {}

    // Fallback to mock + simulate
    const mockStocks = MOCK_STOCKS.filter(s => watchlist.includes(s.symbol))
    setStocks(prev => {
      if (prev.length === 0) return mockStocks
      return prev.map(s => ({
        ...s,
        price: simulatePriceChange(s.price),
        lastUpdated: new Date().toISOString(),
      }))
    })
  }, [watchlist])

  useEffect(() => {
    fetchWatchlist().finally(() => setLoading(false))
    timerRef.current = setInterval(fetchWatchlist, 3000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [fetchWatchlist])

  return { stocks, loading }
}

// Hook: last updated timestamp — start with null to avoid hydration mismatch
export function useLastUpdated() {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    setTime(new Date().toLocaleTimeString('en-IN'))
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString('en-IN')), 1000)
    return () => clearInterval(interval)
  }, [])
  return time
}
