'use client'
import { useState } from 'react'
import { useNewsFeed } from '@/hooks/useMarketData'
import { formatRelativeTime, cn, truncate } from '@/lib/utils'
import type { NewsCategory } from '@/types'
import { ExternalLink, TrendingUp, Globe, Shield, BarChart3, Newspaper } from 'lucide-react'

const CATEGORIES: { id: NewsCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <Newspaper size={11} /> },
  { id: 'stock', label: 'Stocks', icon: <TrendingUp size={11} /> },
  { id: 'earnings', label: 'Earnings', icon: <BarChart3 size={11} /> },
  { id: 'trade', label: 'Commodities', icon: <Globe size={11} /> },
  { id: 'geopolitical', label: 'Geopolitical', icon: <Shield size={11} /> },
  { id: 'macro', label: 'Macro', icon: <BarChart3 size={11} /> },
]

const SENTIMENT_STYLES = {
  positive: 'border-l-accent-green bg-accent-green/3',
  negative: 'border-l-accent-red bg-accent-red/3',
  neutral: 'border-l-terminal-border',
}

const CATEGORY_BADGES: Record<string, string> = {
  stock: 'text-accent-blue bg-accent-blue/10',
  earnings: 'text-accent-yellow bg-accent-yellow/10',
  trade: 'text-accent-orange bg-accent-orange/10',
  geopolitical: 'text-accent-red bg-accent-red/10',
  macro: 'text-accent-cyan bg-accent-cyan/10',
  ipo: 'text-accent-green bg-accent-green/10',
}

export function NewsFeed() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | 'all'>('all')
  const { news, loading } = useNewsFeed(activeCategory === 'all' ? undefined : activeCategory)

  return (
    <div className="terminal-card h-full flex flex-col">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 shrink-0 border-b border-terminal-border/50">
        <div className="section-header m-0 p-0 border-0 mb-2">Market News</div>
        {/* Category filter */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-medium whitespace-nowrap transition-colors shrink-0',
                activeCategory === cat.id
                  ? 'bg-accent-orange/20 text-accent-orange border border-accent-orange/30'
                  : 'text-text-muted hover:text-text-secondary hover:bg-terminal-hover border border-transparent'
              )}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* News list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-3 p-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-3 bg-terminal-border rounded w-3/4" />
                <div className="h-2 bg-terminal-border rounded w-full" />
                <div className="h-2 bg-terminal-border rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {news.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'block px-3 py-3 border-b border-terminal-border/30 border-l-2 hover:bg-terminal-hover transition-colors group',
                  SENTIMENT_STYLES[article.sentiment]
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-sm uppercase tracking-wider', CATEGORY_BADGES[article.category] || 'text-text-muted bg-terminal-border')}>
                      {article.category}
                    </span>
                    {article.relatedSymbols?.slice(0, 2).map(sym => (
                      <span key={sym} className="ticker-pill text-[9px]">{sym.replace('.NS', '')}</span>
                    ))}
                  </div>
                  <ExternalLink size={11} className="text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                </div>

                <p className="text-sm text-text-primary font-medium leading-snug mb-1 line-clamp-2">
                  {article.title}
                </p>

                {article.summary && (
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-1.5">
                    {truncate(article.summary, 140)}
                  </p>
                )}

                <div className="flex items-center gap-2 text-[10px] text-text-muted">
                  <span className="font-medium">{article.source}</span>
                  <span>·</span>
                  <span>{formatRelativeTime(article.publishedAt)}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
