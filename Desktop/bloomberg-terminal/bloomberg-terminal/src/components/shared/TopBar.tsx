'use client'
import { useMarketIndices, useLastUpdated } from '@/hooks/useMarketData'
import { formatPercent, getChangeColor, getMarketStatus } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { RefreshCw } from 'lucide-react'
import { StockSearchBar } from '@/components/shared/StockSearchBar'

export function TopBar() {
  const { indices } = useMarketIndices()
  const lastUpdated = useLastUpdated()
  const market = getMarketStatus()

  return (
    <header className="h-12 bg-terminal-surface border-b border-terminal-border flex items-center shrink-0 z-40">
      {/* Ticker tape */}
      <div className="flex-1 overflow-hidden relative">
        {/* Gradient fades */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-terminal-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-terminal-surface to-transparent z-10 pointer-events-none" />

        <div className="ticker-track flex gap-8 px-4">
          {/* Duplicate for seamless loop */}
          {[...indices, ...indices].map((idx, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap shrink-0">
              <span className="text-text-muted font-mono text-xs tracking-wider">{idx.name}</span>
              <span className="font-mono text-sm text-text-ticker font-medium tabular-nums">
                {idx.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
              <span className={cn('font-mono text-xs tabular-nums', getChangeColor(idx.changePercent))}>
                {formatPercent(idx.changePercent)}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 px-3 shrink-0 border-l border-terminal-border">
        {/* Smart Search */}
        <div className="hidden sm:block">
          <StockSearchBar />
        </div>

        {/* Market status */}
        <div className="flex items-center gap-1.5">
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', market.isOpen ? 'bg-accent-green animate-pulse' : 'bg-text-muted')} />
          <span className={cn('text-[10px] font-mono font-medium hidden sm:block', market.color)}>{market.label}</span>
        </div>

        {/* Last updated */}
        <div className="flex items-center gap-1 text-text-muted">
          <RefreshCw size={10} className="animate-spin-slow" />
          {lastUpdated && (
            <span className="font-mono text-[10px] hidden sm:block">{lastUpdated}</span>
          )}
        </div>
      </div>
    </header>
  )
}
