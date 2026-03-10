import { SectorHeatmap } from '@/components/charts/SectorHeatmap'
import { PnLChart } from '@/components/charts/PnLChart'

export default function ChartsAdvancedPage() {
  return (
    <div className="p-3 space-y-3">
      <div className="terminal-card p-3">
        <h1 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <span className="w-1 h-4 bg-accent-orange rounded-full inline-block" />
          Advanced Charts
        </h1>
        <p className="text-xs text-text-muted mt-1">Sector heatmap + Portfolio P&L breakdown</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <div style={{ minHeight: 480 }}>
          <SectorHeatmap />
        </div>
        <div style={{ minHeight: 480 }}>
          <PnLChart />
        </div>
      </div>
    </div>
  )
}
