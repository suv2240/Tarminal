'use client'
import { useState } from 'react'
import { useMarketMovers } from '@/hooks/useMarketData'
import { formatINR, formatPercent, formatVolume, getChangeColor, cn, displaySymbol } from '@/lib/utils'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { useAppStore } from '@/store/zustandStore'
import { useRouter } from 'next/navigation'

type Tab = 'gainers' | 'losers' | 'volume'

export function MarketMovers() {
  const [tab, setTab] = useState<Tab>('gainers')
  const { gainers, losers, highVolume, loading } = useMarketMovers()
  const setActiveSymbol = useAppStore(s => s.setActiveSymbol)
  const router = useRouter()

  const data = tab === 'gainers' ? gainers : tab === 'losers' ? losers : highVolume

  function handleClick(symbol: string) {
    setActiveSymbol(symbol)
    router.push('/charts')
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'gainers', label: 'Gainers', icon: <TrendingUp size={12} /> },
    { id: 'losers', label: 'Losers', icon: <TrendingDown size={12} /> },
    { id: 'volume', label: 'Volume', icon: <Activity size={12} /> },
  ]

  return (
    <div className="terminal-card h-full flex flex-col">
      {/* Header */}
      <div className="px-3 pt-3 pb-0 shrink-0">
        <div className="flex items-center gap-1 bg-terminal-bg rounded-sm p-0.5">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-sm text-xs font-medium transition-all',
                tab === t.id
                  ? 'bg-terminal-card text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto mt-2">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-4 h-4 border-2 border-accent-orange/30 border-t-accent-orange rounded-full animate-spin" />
          </div>
        ) : (
          <table className="terminal-table">
            <thead>
              <tr>
                <th className="pl-3">Symbol</th>
                <th>Price</th>
                <th className="pr-3">{tab === 'volume' ? 'Volume' : 'Change'}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((stock) => (
                <tr
                  key={stock.symbol}
                  onClick={() => handleClick(stock.symbol)}
                  className="cursor-pointer"
                >
                  <td className="pl-3">
                    <div>
                      <div className="ticker-pill">{displaySymbol(stock.symbol)}</div>
                      <div className="text-[10px] text-text-muted mt-0.5 font-sans truncate max-w-[100px]">
                        {stock.company.replace(' Limited', '').replace(' Ltd', '')}
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-sm">
                    {formatINR(stock.price).replace('₹', '₹')}
                  </td>
                  <td className="pr-3">
                    {tab === 'volume' ? (
                      <span className="font-mono text-xs text-text-secondary">{formatVolume(stock.volume)}</span>
                    ) : (
                      <div className="flex flex-col items-end">
                        <span className={cn('font-mono text-sm font-medium', getChangeColor(stock.changePercent))}>
                          {formatPercent(stock.changePercent)}
                        </span>
                        <span className={cn('font-mono text-[10px]', getChangeColor(stock.change))}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
