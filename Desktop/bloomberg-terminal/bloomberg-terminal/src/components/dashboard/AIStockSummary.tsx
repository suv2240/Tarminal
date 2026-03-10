'use client'
import { useState } from 'react'
import type { AIStockSummary } from '@/types'
import { Sparkles, TrendingUp, TrendingDown, Minus, Shield, Target, AlertTriangle, RefreshCw } from 'lucide-react'
import { cn, formatINR } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Props {
  symbol: string
  company: string
}

const TREND_CONFIG = {
  bullish: { icon: TrendingUp, color: 'text-accent-green', bg: 'bg-accent-green/10 border-accent-green/30', label: 'BULLISH' },
  bearish: { icon: TrendingDown, color: 'text-accent-red', bg: 'bg-accent-red/10 border-accent-red/30', label: 'BEARISH' },
  neutral: { icon: Minus, color: 'text-text-secondary', bg: 'bg-terminal-border/30 border-terminal-border', label: 'NEUTRAL' },
}

const RISK_CONFIG = {
  low: { color: 'text-accent-green', bg: 'bg-accent-green/10', label: 'LOW RISK' },
  medium: { color: 'text-accent-yellow', bg: 'bg-accent-yellow/10', label: 'MEDIUM RISK' },
  high: { color: 'text-accent-red', bg: 'bg-accent-red/10', label: 'HIGH RISK' },
}

export function AIStockSummaryCard({ symbol, company }: Props) {
  const [summary, setSummary] = useState<AIStockSummary | null>(null)
  const [loading, setLoading] = useState(false)

  async function fetchSummary() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSummary(data.summary)
    } catch {
      toast.error('Failed to generate AI summary')
    } finally {
      setLoading(false)
    }
  }

  if (!summary && !loading) {
    return (
      <div className="terminal-card p-4 flex flex-col items-center justify-center text-center gap-3 min-h-[140px]">
        <Sparkles size={20} className="text-accent-orange" />
        <div>
          <div className="text-sm font-medium text-text-primary mb-1">AI Analysis</div>
          <div className="text-xs text-text-muted">Get AI-powered insights for {company}</div>
        </div>
        <button onClick={fetchSummary} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
          <Sparkles size={12} />
          Generate Summary
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="terminal-card p-4 flex flex-col items-center justify-center gap-2 min-h-[140px]">
        <div className="w-5 h-5 border-2 border-accent-orange/30 border-t-accent-orange rounded-full animate-spin" />
        <div className="text-xs text-text-muted">Analyzing {company}…</div>
      </div>
    )
  }

  if (!summary) return null

  const trendCfg = TREND_CONFIG[summary.trend]
  const riskCfg = RISK_CONFIG[summary.riskLevel]
  const TrendIcon = trendCfg.icon

  return (
    <div className="terminal-card p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={13} className="text-accent-orange" />
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">AI Analysis</span>
        </div>
        <button
          onClick={fetchSummary}
          className="text-text-muted hover:text-accent-orange transition-colors"
          title="Regenerate"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Trend + Risk badges */}
      <div className="flex items-center gap-2">
        <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-xs font-bold', trendCfg.bg, trendCfg.color)}>
          <TrendIcon size={12} />
          {trendCfg.label}
        </div>
        <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-bold', riskCfg.bg, riskCfg.color)}>
          <Shield size={11} />
          {riskCfg.label}
        </div>
      </div>

      {/* Support / Resistance */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-terminal-bg rounded-sm p-2">
          <div className="data-label mb-1 flex items-center gap-1">
            <Target size={9} />Support
          </div>
          <div className="font-mono text-sm text-accent-green font-medium">{formatINR(summary.support)}</div>
        </div>
        <div className="bg-terminal-bg rounded-sm p-2">
          <div className="data-label mb-1 flex items-center gap-1">
            <AlertTriangle size={9} />Resistance
          </div>
          <div className="font-mono text-sm text-accent-red font-medium">{formatINR(summary.resistance)}</div>
        </div>
      </div>

      {/* Summary text */}
      <p className="text-xs text-text-secondary leading-relaxed border-t border-terminal-border/50 pt-2.5">
        {summary.summary}
      </p>

      <div className="text-[9px] text-text-muted">
        Generated {new Date(summary.generatedAt).toLocaleTimeString('en-IN')} · Not financial advice
      </div>
    </div>
  )
}
