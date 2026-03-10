'use client'
import { useWatchlistData } from '@/hooks/useMarketData'
import { useAppStore } from '@/store/zustandStore'
import { formatINR, formatPercent, getChangeColor, displaySymbol, cn } from '@/lib/utils'
import { Star, StarOff, Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export function Watchlist() {
  const { stocks, loading } = useWatchlistData()
  const { watchlist, addToWatchlist, removeFromWatchlist, setActiveSymbol } = useAppStore()
  const router = useRouter()
  const [addInput, setAddInput] = useState('')

  function handleAddSymbol(e: React.FormEvent) {
    e.preventDefault()
    const sym = addInput.trim().toUpperCase()
    if (!sym) return
    const full = sym.includes('.') ? sym : `${sym}.NS`
    if (watchlist.includes(full)) {
      toast.error(`${sym} already in watchlist`)
    } else {
      addToWatchlist(full)
      toast.success(`Added ${sym} to watchlist`)
    }
    setAddInput('')
  }

  function handleClick(symbol: string) {
    setActiveSymbol(symbol)
    router.push('/charts')
  }

  return (
    <div className="terminal-card h-full flex flex-col">
      <div className="px-3 pt-3 pb-2 flex items-center justify-between shrink-0 border-b border-terminal-border/50">
        <div className="section-header m-0 p-0 border-0">Watchlist</div>
        <form onSubmit={handleAddSymbol} className="flex items-center gap-1.5">
          <input
            value={addInput}
            onChange={e => setAddInput(e.target.value)}
            placeholder="Add symbol"
            className="terminal-input h-6 w-24 text-xs px-2"
          />
          <button type="submit" className="text-accent-orange hover:text-accent-orange-dim transition-colors">
            <Plus size={14} />
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <div className="w-4 h-4 border-2 border-accent-orange/30 border-t-accent-orange rounded-full animate-spin" />
          </div>
        ) : stocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-text-muted text-sm">
            <Star size={20} className="mb-2 opacity-30" />
            Add symbols to track
          </div>
        ) : (
          <div>
            {stocks.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => handleClick(stock.symbol)}
                className="flex items-center px-3 py-2.5 border-b border-terminal-border/30 hover:bg-terminal-hover cursor-pointer group transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-text-ticker">
                      {displaySymbol(stock.symbol)}
                    </span>
                    <span className={cn(
                      'inline-flex items-center gap-0.5',
                      getChangeColor(stock.changePercent)
                    )}>
                      {stock.changePercent >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    </span>
                  </div>
                  <div className="text-[10px] text-text-muted truncate">
                    {stock.company.replace(' Limited', '').replace(' Ltd', '')}
                  </div>
                </div>

                <div className="text-right mr-3">
                  <div className="font-mono text-sm text-text-primary tabular-nums">
                    ₹{stock.price.toFixed(2)}
                  </div>
                  <div className={cn('font-mono text-xs tabular-nums', getChangeColor(stock.changePercent))}>
                    {formatPercent(stock.changePercent)}
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); removeFromWatchlist(stock.symbol) }}
                  className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent-red transition-all"
                >
                  <StarOff size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
