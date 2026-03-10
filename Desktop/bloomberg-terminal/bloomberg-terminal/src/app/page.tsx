import { MarketMovers } from '@/components/dashboard/MarketMovers'
import { Watchlist } from '@/components/dashboard/Watchlist'
import { NewsFeed } from '@/components/news/NewsFeed'
import { EconomicCalendarWidget } from '@/components/dashboard/EconomicCalendarWidget'
import { GovtPolicyWidget } from '@/components/dashboard/GovtPolicyWidget'
import { MarketOverviewHeader } from '@/components/dashboard/MarketOverviewHeader'

export default function DashboardPage() {
  return (
    <div className="p-3 space-y-3">
      {/* Market overview strip */}
      <MarketOverviewHeader />

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Col 1: Market Movers */}
        <div className="xl:col-span-1 h-[420px]">
          <MarketMovers />
        </div>

        {/* Col 2: Watchlist */}
        <div className="xl:col-span-1 h-[420px]">
          <Watchlist />
        </div>

        {/* Col 3-4: News */}
        <div className="xl:col-span-2 h-[420px]">
          <NewsFeed />
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {/* Economic Calendar */}
        <div className="h-[360px]">
          <EconomicCalendarWidget />
        </div>

        {/* Govt Policies */}
        <div className="h-[360px]">
          <GovtPolicyWidget />
        </div>

        {/* Quick stats */}
        <div className="h-[360px]">
          <MarketStatsWidget />
        </div>
      </div>
    </div>
  )
}

// Inline mini widget for market stats
function MarketStatsWidget() {
  return (
    <div className="terminal-card h-full p-3">
      <div className="section-header">Market Snapshot</div>
      <div className="space-y-2.5">
        {[
          { label: 'FII Net Buy/Sell', value: '+₹4,231 Cr', positive: true },
          { label: 'DII Net Buy/Sell', value: '-₹1,234 Cr', positive: false },
          { label: 'India VIX', value: '13.42', positive: null },
          { label: 'USD/INR', value: '83.74', positive: null },
          { label: 'Crude Oil (Brent)', value: '$82.4 / bbl', positive: null },
          { label: 'Gold (MCX)', value: '₹72,450 / 10g', positive: true },
          { label: 'Advance / Decline', value: '1,423 / 876', positive: true },
          { label: '52W High Stocks', value: '234', positive: true },
          { label: '52W Low Stocks', value: '45', positive: false },
        ].map(({ label, value, positive }) => (
          <div key={label} className="flex items-center justify-between py-1 border-b border-terminal-border/30">
            <span className="text-xs text-text-muted">{label}</span>
            <span className={`font-mono text-sm font-medium ${
              positive === true ? 'text-accent-green' :
              positive === false ? 'text-accent-red' :
              'text-text-primary'
            }`}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
