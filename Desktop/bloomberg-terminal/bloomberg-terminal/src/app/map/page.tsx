'use client'
import { useState } from 'react'
import { MOCK_GLOBAL_EVENTS } from '@/lib/mockData'
import type { GlobalEvent, ImpactLevel } from '@/types'
import { Globe, X, AlertTriangle, TrendingUp, DollarSign, Landmark, BarChart2, Zap } from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'
import dynamic from 'next/dynamic'

// Lazy-load heavy map component
const WorldMapComponent = dynamic(() => import('@/components/map/WorldMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-accent-orange/30 border-t-accent-orange rounded-full animate-spin" />
        <span className="text-xs text-text-muted">Loading world map…</span>
      </div>
    </div>
  ),
})

const IMPACT_COLORS: Record<ImpactLevel, string> = {
  high: 'text-accent-red',
  medium: 'text-accent-yellow',
  low: 'text-accent-green',
}

const IMPACT_DOT: Record<ImpactLevel, string> = {
  high: 'bg-accent-red',
  medium: 'bg-accent-yellow',
  low: 'bg-accent-green',
}

const CAT_ICONS: Record<string, React.ReactNode> = {
  'central-bank': <Landmark size={13} />,
  gdp: <BarChart2 size={13} />,
  inflation: <TrendingUp size={13} />,
  geopolitical: <AlertTriangle size={13} />,
  commodity: <DollarSign size={13} />,
  ipo: <Zap size={13} />,
  earnings: <BarChart2 size={13} />,
}

export default function MapPage() {
  const [selectedEvent, setSelectedEvent] = useState<GlobalEvent | null>(null)
  const [filterImpact, setFilterImpact] = useState<ImpactLevel | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const filtered = MOCK_GLOBAL_EVENTS.filter(ev => {
    if (filterImpact !== 'all' && ev.impact !== filterImpact) return false
    if (filterCategory !== 'all' && ev.category !== filterCategory) return false
    return true
  })

  return (
    <div className="p-3 h-full flex flex-col gap-3">
      {/* Header + filters */}
      <div className="terminal-card p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-accent-orange" />
            <span className="section-header m-0 p-0 border-0">Global Events Map</span>
          </div>

          {/* Impact filter */}
          <div className="flex items-center gap-1">
            {(['all', 'high', 'medium', 'low'] as const).map(level => (
              <button
                key={level}
                onClick={() => setFilterImpact(level)}
                className={cn(
                  'px-2.5 py-1 rounded-sm text-xs font-medium transition-colors border',
                  filterImpact === level
                    ? level === 'high' ? 'bg-accent-red/20 text-accent-red border-accent-red/40'
                    : level === 'medium' ? 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/40'
                    : level === 'low' ? 'bg-accent-green/20 text-accent-green border-accent-green/40'
                    : 'bg-terminal-border text-text-primary border-transparent'
                    : 'text-text-muted border-transparent hover:bg-terminal-hover'
                )}
              >
                {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="terminal-input text-xs h-7 py-0 w-36"
          >
            <option value="all">All Categories</option>
            <option value="central-bank">Central Banks</option>
            <option value="gdp">GDP</option>
            <option value="inflation">Inflation</option>
            <option value="geopolitical">Geopolitical</option>
            <option value="commodity">Commodities</option>
          </select>

          <span className="text-xs text-text-muted ml-auto">{filtered.length} events</span>
        </div>
      </div>

      {/* Map + sidebar */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-3 min-h-0">
        {/* Map */}
        <div className="lg:col-span-3 terminal-card overflow-hidden" style={{ minHeight: '400px' }}>
          <WorldMapComponent
            events={filtered}
            onEventClick={setSelectedEvent}
            selectedEvent={selectedEvent}
          />
        </div>

        {/* Events sidebar */}
        <div className="terminal-card flex flex-col overflow-hidden">
          <div className="px-3 py-2.5 border-b border-terminal-border/50 shrink-0">
            <span className="section-header m-0 p-0 border-0">Events</span>
          </div>

          {selectedEvent ? (
            <div className="p-3 flex-1 overflow-y-auto animate-slide-up">
              <div className="flex items-start justify-between mb-3">
                <div className={cn('text-xs font-bold uppercase flex items-center gap-1.5', IMPACT_COLORS[selectedEvent.impact])}>
                  <span className={cn('w-2 h-2 rounded-full', IMPACT_DOT[selectedEvent.impact])} />
                  {selectedEvent.impact} impact
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-text-muted hover:text-text-primary">
                  <X size={14} />
                </button>
              </div>

              <div className="mb-2">
                <div className="flex items-center gap-1.5 text-text-muted text-xs mb-1.5">
                  <span className="text-base">{getCountryFlag(selectedEvent.countryCode)}</span>
                  <span>{selectedEvent.country}</span>
                  <span>·</span>
                  <span className="font-mono">{selectedEvent.date}</span>
                </div>
                <h3 className="text-sm font-semibold text-text-primary leading-snug mb-2">{selectedEvent.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{selectedEvent.summary}</p>
              </div>

              <div className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs border', 
                selectedEvent.impact === 'high' ? 'bg-accent-red/10 text-accent-red border-accent-red/30' :
                selectedEvent.impact === 'medium' ? 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/30' :
                'bg-accent-green/10 text-accent-green border-accent-green/30'
              )}>
                {CAT_ICONS[selectedEvent.category]}
                {selectedEvent.category.replace('-', ' ')}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-terminal-border/30">
              {filtered.map(event => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="w-full px-3 py-2.5 text-left hover:bg-terminal-hover transition-colors"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', IMPACT_DOT[event.impact])} />
                    <span className="text-base">{getCountryFlag(event.countryCode)}</span>
                    <span className="text-[10px] text-text-muted">{event.country}</span>
                    <span className="text-[10px] text-text-muted ml-auto font-mono">{event.date}</span>
                  </div>
                  <div className="text-xs text-text-primary line-clamp-2 leading-snug">{event.title}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    US: '🇺🇸', IN: '🇮🇳', CN: '🇨🇳', RU: '🇷🇺', SA: '🇸🇦',
    EU: '🇪🇺', JP: '🇯🇵', AU: '🇦🇺', IL: '🇮🇱', DE: '🇩🇪',
  }
  return flags[code] || '🌐'
}
