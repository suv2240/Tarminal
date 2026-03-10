'use client'
import { useState } from 'react'
import { MOCK_GOVT_POLICIES } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { Landmark, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronRight } from 'lucide-react'

export function GovtPolicyWidget() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="terminal-card h-full flex flex-col">
      <div className="px-3 pt-3 pb-2 shrink-0 border-b border-terminal-border/50 flex items-center gap-2">
        <Landmark size={13} className="text-accent-orange" />
        <span className="section-header m-0 p-0 border-0">Govt Policy Impact</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {MOCK_GOVT_POLICIES.map(policy => (
          <div key={policy.id} className="border-b border-terminal-border/30">
            <button
              onClick={() => setExpandedId(expandedId === policy.id ? null : policy.id)}
              className="w-full px-3 py-2.5 hover:bg-terminal-hover transition-colors text-left flex items-start gap-2"
            >
              {expandedId === policy.id ? (
                <ChevronDown size={13} className="text-text-muted mt-0.5 shrink-0" />
              ) : (
                <ChevronRight size={13} className="text-text-muted mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] text-text-muted bg-terminal-border px-1.5 py-0.5 rounded-sm">{policy.category}</span>
                  <span className="text-[10px] text-text-muted font-mono">{policy.date}</span>
                </div>
                <div className="text-xs font-medium text-text-primary leading-snug">{policy.title}</div>
              </div>
            </button>

            {expandedId === policy.id && (
              <div className="px-3 pb-3 animate-fade-in">
                <p className="text-xs text-text-secondary mb-2.5 leading-relaxed">{policy.description}</p>
                <div className="space-y-1.5">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5">Impacted Stocks</div>
                  {policy.impactedStocks.map(stock => (
                    <div key={stock.symbol} className="flex items-center gap-2 p-2 rounded-sm bg-terminal-bg">
                      <div className={cn(
                        'w-5 h-5 rounded-sm flex items-center justify-center shrink-0',
                        stock.direction === 'positive' ? 'bg-accent-green/10' :
                        stock.direction === 'negative' ? 'bg-accent-red/10' : 'bg-terminal-border'
                      )}>
                        {stock.direction === 'positive' ? <TrendingUp size={11} className="text-accent-green" /> :
                         stock.direction === 'negative' ? <TrendingDown size={11} className="text-accent-red" /> :
                         <Minus size={11} className="text-text-muted" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-text-ticker">{stock.symbol.replace('.NS', '')}</span>
                          <span className="text-[10px] text-text-muted truncate">{stock.company}</span>
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5">{stock.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
