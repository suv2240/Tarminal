import { MOCK_ECONOMIC_EVENTS } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { Calendar, AlertCircle } from 'lucide-react'
import type { ImpactLevel } from '@/types'

const IMPACT_STYLES: Record<ImpactLevel, string> = {
  high: 'text-accent-red bg-accent-red/10 border-accent-red/30',
  medium: 'text-accent-yellow bg-accent-yellow/10 border-accent-yellow/30',
  low: 'text-accent-green bg-accent-green/10 border-accent-green/30',
}

const CAT_ICONS: Record<string, string> = {
  rbi: '🏦',
  budget: '📋',
  gdp: '📊',
  inflation: '📈',
  ipo: '🚀',
  earnings: '💰',
  other: '📌',
}

export function EconomicCalendarWidget() {
  const events = MOCK_ECONOMIC_EVENTS.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <div className="terminal-card h-full flex flex-col">
      <div className="px-3 pt-3 pb-2 shrink-0 border-b border-terminal-border/50 flex items-center gap-2">
        <Calendar size={13} className="text-accent-orange" />
        <span className="section-header m-0 p-0 border-0">Economic Calendar</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {events.map(event => {
          const date = new Date(event.date)
          const isUpcoming = date >= new Date()
          return (
            <div
              key={event.id}
              className={cn(
                'px-3 py-2.5 border-b border-terminal-border/30',
                isUpcoming ? 'hover:bg-terminal-hover' : 'opacity-60'
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{CAT_ICONS[event.category] || '📌'}</span>
                  <span className={cn(
                    'text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm border',
                    IMPACT_STYLES[event.impact]
                  )}>
                    {event.impact}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-text-muted">
                  {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  {event.time && ` · ${event.time}`}
                </div>
              </div>

              <div className="text-xs font-medium text-text-primary leading-snug mb-1">{event.title}</div>

              {(event.forecast || event.previous) && (
                <div className="flex items-center gap-3 text-[10px] text-text-muted font-mono">
                  {event.forecast && <span>Est: <span className="text-accent-yellow">{event.forecast}</span></span>}
                  {event.actual && <span>Act: <span className="text-accent-green">{event.actual}</span></span>}
                  {event.previous && <span>Prev: {event.previous}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
