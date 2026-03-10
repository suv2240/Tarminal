'use client'
import { MOCK_STOCKS } from '@/lib/mockData'
import { cn, displaySymbol } from '@/lib/utils'
import { useAppStore } from '@/store/zustandStore'
import { useRouter } from 'next/navigation'

interface SectorData {
  sector: string
  stocks: typeof MOCK_STOCKS
  avgChange: number
  totalMarketCap: number
}

function getSectorColor(change: number): string {
  if (change > 2) return 'bg-accent-green text-white'
  if (change > 1) return 'bg-accent-green/70 text-white'
  if (change > 0) return 'bg-accent-green/40 text-accent-green'
  if (change > -1) return 'bg-accent-red/40 text-accent-red'
  if (change > -2) return 'bg-accent-red/70 text-white'
  return 'bg-accent-red text-white'
}

function getSectorBg(change: number): string {
  if (change > 2) return 'border-accent-green/60 bg-accent-green/10'
  if (change > 0.5) return 'border-accent-green/30 bg-accent-green/5'
  if (change > -0.5) return 'border-terminal-border bg-terminal-card'
  if (change > -2) return 'border-accent-red/30 bg-accent-red/5'
  return 'border-accent-red/60 bg-accent-red/10'
}

export function SectorHeatmap() {
  const setActiveSymbol = useAppStore(s => s.setActiveSymbol)
  const router = useRouter()

  // Group stocks by sector
  const sectorMap = new Map<string, SectorData>()
  for (const stock of MOCK_STOCKS) {
    if (!sectorMap.has(stock.sector)) {
      sectorMap.set(stock.sector, { sector: stock.sector, stocks: [], avgChange: 0, totalMarketCap: 0 })
    }
    const s = sectorMap.get(stock.sector)!
    s.stocks.push(stock)
    s.totalMarketCap += stock.marketCap
  }

  // Calculate avg change per sector
  const sectors = Array.from(sectorMap.values()).map(s => ({
    ...s,
    avgChange: s.stocks.reduce((sum, st) => sum + st.changePercent, 0) / s.stocks.length,
  })).sort((a, b) => b.avgChange - a.avgChange)

  function handleStockClick(symbol: string) {
    setActiveSymbol(symbol)
    router.push('/charts')
  }

  return (
    <div className="terminal-card p-3 h-full flex flex-col">
      <div className="section-header mb-3">Sector Heatmap</div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {sectors.map(sector => (
          <div key={sector.sector} className={cn('border rounded-sm p-2', getSectorBg(sector.avgChange))}>
            {/* Sector header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-primary">{sector.sector}</span>
              <span className={cn(
                'text-xs font-bold font-mono px-2 py-0.5 rounded-sm',
                getSectorColor(sector.avgChange)
              )}>
                {sector.avgChange >= 0 ? '+' : ''}{sector.avgChange.toFixed(2)}%
              </span>
            </div>

            {/* Stock tiles */}
            <div className="flex flex-wrap gap-1">
              {sector.stocks.map(stock => (
                <button
                  key={stock.symbol}
                  onClick={() => handleStockClick(stock.symbol)}
                  className={cn(
                    'px-2 py-1 rounded-sm text-[10px] font-mono font-medium transition-all hover:scale-105 border',
                    stock.changePercent > 0
                      ? 'bg-accent-green/20 text-accent-green border-accent-green/30 hover:bg-accent-green/30'
                      : 'bg-accent-red/20 text-accent-red border-accent-red/30 hover:bg-accent-red/30'
                  )}
                  title={`${stock.company}: ${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`}
                >
                  {displaySymbol(stock.symbol)}
                  <span className="ml-1 opacity-70">
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 pt-2 border-t border-terminal-border/50">
        <span className="text-[10px] text-text-muted">Legend:</span>
        {[
          { label: 'Strong +', color: 'bg-accent-green' },
          { label: 'Mild +', color: 'bg-accent-green/40' },
          { label: 'Mild -', color: 'bg-accent-red/40' },
          { label: 'Strong -', color: 'bg-accent-red' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <span className={cn('w-3 h-3 rounded-sm', color)} />
            <span className="text-[10px] text-text-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
