import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Holding, PriceAlert, StockQuote, IndexData } from '@/types'

interface AppStore {
  // ─── Theme ─────────────────────────────────────────────────────
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void

  // ─── Active Stock ───────────────────────────────────────────────
  activeSymbol: string
  setActiveSymbol: (symbol: string) => void

  // ─── Market Data Cache ──────────────────────────────────────────
  indices: IndexData[]
  setIndices: (indices: IndexData[]) => void
  stockCache: Record<string, StockQuote>
  setStockCache: (symbol: string, stock: StockQuote) => void
  updateStockPrice: (symbol: string, price: number, change: number, changePercent: number) => void

  // ─── Portfolio ──────────────────────────────────────────────────
  holdings: Holding[]
  setHoldings: (holdings: Holding[]) => void
  addHolding: (holding: Holding) => void
  removeHolding: (id: string) => void
  updateHolding: (id: string, updates: Partial<Holding>) => void

  // ─── Watchlist ──────────────────────────────────────────────────
  watchlist: string[]
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void
  isInWatchlist: (symbol: string) => boolean

  // ─── Alerts ────────────────────────────────────────────────────
  alerts: PriceAlert[]
  setAlerts: (alerts: PriceAlert[]) => void
  addAlert: (alert: PriceAlert) => void
  removeAlert: (id: string) => void
  triggerAlert: (id: string) => void

  // ─── UI State ───────────────────────────────────────────────────
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  lastUpdated: string | null
  setLastUpdated: (time: string) => void

  // ─── User ID (simple persistent ID) ────────────────────────────
  userId: string
  setUserId: (id: string) => void
}

function generateUserId(): string {
  return `user_${Math.random().toString(36).substr(2, 9)}`
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      // Active stock
      activeSymbol: 'RELIANCE.NS',
      setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),

      // Market data
      indices: [],
      setIndices: (indices) => set({ indices }),
      stockCache: {},
      setStockCache: (symbol, stock) => set(s => ({ stockCache: { ...s.stockCache, [symbol]: stock } })),
      updateStockPrice: (symbol, price, change, changePercent) =>
        set(s => {
          const existing = s.stockCache[symbol]
          if (!existing) return {}
          return {
            stockCache: {
              ...s.stockCache,
              [symbol]: { ...existing, price, change, changePercent, lastUpdated: new Date().toISOString() },
            },
          }
        }),

      // Portfolio
      holdings: [],
      setHoldings: (holdings) => set({ holdings }),
      addHolding: (holding) => set(s => ({ holdings: [...s.holdings, holding] })),
      removeHolding: (id) => set(s => ({ holdings: s.holdings.filter(h => h.id !== id) })),
      updateHolding: (id, updates) =>
        set(s => ({ holdings: s.holdings.map(h => h.id === id ? { ...h, ...updates } : h) })),

      // Watchlist
      watchlist: ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS'],
      addToWatchlist: (symbol) =>
        set(s => ({ watchlist: s.watchlist.includes(symbol) ? s.watchlist : [...s.watchlist, symbol] })),
      removeFromWatchlist: (symbol) =>
        set(s => ({ watchlist: s.watchlist.filter(w => w !== symbol) })),
      isInWatchlist: (symbol) => get().watchlist.includes(symbol),

      // Alerts
      alerts: [],
      setAlerts: (alerts) => set({ alerts }),
      addAlert: (alert) => set(s => ({ alerts: [...s.alerts, alert] })),
      removeAlert: (id) => set(s => ({ alerts: s.alerts.filter(a => a.id !== id) })),
      triggerAlert: (id) =>
        set(s => ({
          alerts: s.alerts.map(a =>
            a.id === id ? { ...a, triggered: true, triggeredAt: new Date().toISOString() } : a
          ),
        })),

      // UI
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      lastUpdated: null,
      setLastUpdated: (time) => set({ lastUpdated: time }),

      // User
      userId: generateUserId(),
      setUserId: (userId) => set({ userId }),
    }),
    {
      name: 'bharat-terminal-store',
      partialize: (state) => ({
        theme: state.theme,
        watchlist: state.watchlist,
        holdings: state.holdings,
        alerts: state.alerts,
        userId: state.userId,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)
