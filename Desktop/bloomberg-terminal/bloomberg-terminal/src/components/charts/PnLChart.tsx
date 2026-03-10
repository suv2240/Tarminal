'use client'
import { useMemo } from 'react'
import { useAppStore } from '@/store/zustandStore'
import { MOCK_STOCKS } from '@/lib/mockData'
import { formatINR, getChangeColor, cn } from '@/lib/utils'
import { PieChart, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

export function PnLChart() {
  const holdings = useAppStore(s => s.holdings)

  const data = useMemo(() => {
    return holdings.map(h => {
      const stock = MOCK_STOCKS.find(s => s.symbol === h.symbol)
      const currentPrice = stock?.price || h.buyPrice
      const invested = h.quantity * h.buyPrice
      const currentValue = h.quantity * currentPrice
      const pnl = currentValue - invested
      const pnlPct = (pnl / invested) * 100
      return {
        symbol: h.symbol.replace('.NS', ''),
        company: h.company,
        invested,
        currentValue,
        pnl,
        pnlPct,
        weight: 0, // calculated below
      }
    })
  }, [holdings])

  const totalValue = data.reduce((s, d) => s + d.currentValue, 0)
  const totalInvested = data.reduce((s, d) => s + d.invested, 0)
  const totalPnL = totalValue - totalInvested
  const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

  const dataWithWeight = data.map(d => ({
    ...d,
    weight: totalValue > 0 ? (d.currentValue / totalValue) * 100 : 0,
  })).sort((a, b) => b.currentValue - a.currentValue)

  if (holdings.length === 0) {
    return (
      <div className="terminal-card p-4 flex flex-col items-center justify-center h-full text-center gap-3">
        <PieChart size={32} className="text-text-muted opacity-30" />
        <div className="text-sm text-text-muted">Portfolio mein koi holding nahi</div>
        <div className="text-xs text-text-muted">Portfolio page pe stocks add karo</div>
      </div>
    )
  }

  return (
    <div className="terminal-card p-3 h-full flex flex-col">
      <div className="section-header mb-3">Portfolio P&L Breakdown</div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-terminal-bg rounded-sm p-2">
          <div className="data-label mb-1 flex items-center gap-1"><DollarSign size={9} />Invested</div>
          <div className="font-mono text-sm font-bold text-text-primary">{formatINR(totalInvested, true)}</div>
        </div>
        <div className="bg-terminal-bg rounded-sm p-2">
          <div className="data-label mb-1">Current</div>
          <div className="font-mono text-sm font-bold text-text-primary">{formatINR(totalValue, true)}</div>
        </div>
        <div className="bg-terminal-bg rounded-sm p-2">
          <div className="data-label mb-1">Total P&L</div>
          <div className={cn('font-mono text-sm font-bold', getChangeColor(totalPnL))}>
            {totalPnL >= 0 ? '+' : ''}{formatINR(totalPnL, true)}
          </div>
          <div className={cn('font-mono text-[10px]', getChangeColor(totalPnLPct))}>
            {totalPnLPct >= 0 ? '+' : ''}{totalPnLPct.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Visual bar chart */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {dataWithWeight.map(item => (
          <div key={item.symbol} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium text-text-ticker">{item.symbol}</span>
                <span className="text-text-muted text-[10px] truncate max-w-[100px]">{item.company}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={cn('font-mono text-xs', getChangeColor(item.pnl))}>
                  {item.pnl >= 0 ? '+' : ''}{formatINR(item.pnl, true)}
                </span>
                <span className={cn(
                  'font-mono text-[10px] px-1.5 py-0.5 rounded-sm font-bold',
                  item.pnlPct >= 0 ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'
                )}>
                  {item.pnlPct >= 0 ? '+' : ''}{item.pnlPct.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Progress bar — portfolio weight */}
            <div className="h-4 bg-terminal-bg rounded-sm overflow-hidden relative">
              <div
                className={cn('h-full rounded-sm transition-all duration-500 flex items-center justify-end pr-1.5',
                  item.pnlPct >= 0 ? 'bg-accent-green/30' : 'bg-accent-red/30'
                )}
                style={{ width: `${Math.max(item.weight, 4)}%` }}
              >
                <span className="text-[9px] font-mono text-text-muted">{item.weight.toFixed(1)}%</span>
              </div>
              {/* P&L indicator line */}
              <div
                className={cn('absolute top-0 bottom-0 w-0.5', item.pnlPct >= 0 ? 'bg-accent-green' : 'bg-accent-red')}
                style={{ left: `${Math.max(item.weight, 4)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Gainers vs losers summary */}
      <div className="mt-3 pt-2 border-t border-terminal-border/50 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <TrendingUp size={12} className="text-accent-green" />
          <span className="text-xs text-text-muted">
            <span className="text-accent-green font-mono">{data.filter(d => d.pnl >= 0).length}</span> gainers
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingDown size={12} className="text-accent-red" />
          <span className="text-xs text-text-muted">
            <span className="text-accent-red font-mono">{data.filter(d => d.pnl < 0).length}</span> losers
          </span>
        </div>
        <div className="ml-auto text-[10px] text-text-muted">
          {holdings.length} holdings
        </div>
      </div>
    </div>
  )
}
