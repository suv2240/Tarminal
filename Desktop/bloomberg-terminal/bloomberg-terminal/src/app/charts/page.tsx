'use client'
import { useAppStore } from '@/store/zustandStore'
import { TradingViewChart } from '@/components/charts/TradingViewChart'
import { AIStockSummaryCard } from '@/components/dashboard/AIStockSummary'
import { useStockData } from '@/hooks/useMarketData'
import { formatINR, formatPercent, getChangeColor, formatVolume, formatMarketCap, cn, displaySymbol } from '@/lib/utils'
import { Star, StarOff } from 'lucide-react'
import { MOCK_STOCKS } from '@/lib/mockData'
import toast from 'react-hot-toast'
import { NewsFeed } from '@/components/news/NewsFeed'

export default function ChartsPage() {
  const { activeSymbol, setActiveSymbol, isInWatchlist, addToWatchlist, removeFromWatchlist } = useAppStore()
  const { stock, loading } = useStockData(activeSymbol)

  const displayTicker = displaySymbol(activeSymbol)
  const inWatchlist = isInWatchlist(activeSymbol)

  function handleWatchlistToggle() {
    if (inWatchlist) {
      removeFromWatchlist(activeSymbol)
      toast.success(`Removed ${displayTicker} from watchlist`)
    } else {
      addToWatchlist(activeSymbol)
      toast.success(`Added ${displayTicker} to watchlist`)
    }
  }

  return (
    <div className="p-3 h-full flex flex-col gap-3">
      {/* Symbol selector row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {MOCK_STOCKS.slice(0, 12).map(s => (
          <button
            key={s.symbol}
            onClick={() => setActiveSymbol(s.symbol)}
            className={cn(
              'shrink-0 px-2.5 py-1.5 rounded-sm text-xs font-mono font-medium transition-colors border',
              activeSymbol === s.symbol
                ? 'bg-accent-orange/20 text-accent-orange border-accent-orange/40'
                : 'text-text-muted border-terminal-border hover:border-terminal-border/80 hover:text-text-secondary hover:bg-terminal-hover'
            )}
          >
            {displaySymbol(s.symbol)}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-3 min-h-0">
        {/* Chart area - 3 cols */}
        <div className="xl:col-span-3 flex flex-col gap-3 min-h-0">
          {/* Stock header */}
          {stock && (
            <div className="terminal-card p-3 flex flex-wrap items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono font-bold text-xl text-text-primary">{displayTicker}</span>
                  <button onClick={handleWatchlistToggle} className="text-text-muted hover:text-accent-yellow transition-colors">
                    {inWatchlist ? <Star size={15} className="fill-current text-accent-yellow" /> : <StarOff size={15} />}
                  </button>
                </div>
                <div className="text-sm text-text-secondary">{stock.company}</div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-text-primary tabular-nums">
                  ₹{stock.price.toFixed(2)}
                </span>
                <span className={cn('font-mono text-base', getChangeColor(stock.changePercent))}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({formatPercent(stock.changePercent)})
                </span>
              </div>

              <div className="flex gap-4 ml-auto flex-wrap">
                {[
                  { label: 'Mkt Cap', value: formatMarketCap(stock.marketCap) },
                  { label: 'P/E', value: stock.pe.toFixed(1) },
                  { label: '52W H', value: `₹${stock.high52w.toFixed(0)}` },
                  { label: '52W L', value: `₹${stock.low52w.toFixed(0)}` },
                  { label: 'Volume', value: formatVolume(stock.volume) },
                  { label: 'Div Yield', value: `${stock.dividendYield.toFixed(2)}%` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="data-label">{label}</div>
                    <div className="font-mono text-sm text-text-primary font-medium">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TradingView Chart */}
          <div className="terminal-card flex-1 overflow-hidden" style={{ minHeight: '400px' }}>
            <TradingViewChart symbol={activeSymbol} />
          </div>
        </div>

        {/* Right panel - 1 col */}
        <div className="xl:col-span-1 flex flex-col gap-3 overflow-y-auto">
          {stock && (
            <AIStockSummaryCard symbol={activeSymbol} company={stock.company} />
          )}
          <div className="terminal-card flex-1 min-h-[300px] overflow-hidden">
            <div className="h-full overflow-y-auto">
              <NewsFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
