'use client'
import { useMarketIndices } from '@/hooks/useMarketData'
import { formatPercent, getChangeColor, getMarketStatus, cn } from '@/lib/utils'

export function MarketOverviewHeader() {
  const { indices } = useMarketIndices()
  const market = getMarketStatus()

  return (
    <div className="terminal-card p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full', market.isOpen ? 'bg-accent-green animate-pulse' : 'bg-text-muted')} />
          <span className={cn('text-xs font-mono font-semibold', market.color)}>{market.label}</span>
        </div>
        <span className="text-xs text-text-muted font-mono">
          {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {/* Indices grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {indices.map(idx => (
          <div key={idx.symbol} className="bg-terminal-bg rounded-sm p-2.5">
            <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{idx.name}</div>
            <div className="font-mono text-base font-semibold text-text-primary tabular-nums">
              {idx.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
            <div className={cn('font-mono text-xs font-medium mt-0.5 tabular-nums', getChangeColor(idx.changePercent))}>
              {idx.change >= 0 ? '+' : ''}{idx.change.toFixed(2)} ({formatPercent(idx.changePercent)})
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
