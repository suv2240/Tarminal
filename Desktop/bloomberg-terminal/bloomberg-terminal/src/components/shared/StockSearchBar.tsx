'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/zustandStore'
import { MOCK_STOCKS } from '@/lib/mockData'
import { displaySymbol, cn } from '@/lib/utils'
import { Search, TrendingUp, TrendingDown, X } from 'lucide-react'

interface Suggestion {
  symbol: string
  company: string
  price: number
  changePercent: number
  sector: string
}

// Build suggestion list from mock + any cached stocks
function getSuggestions(query: string): Suggestion[] {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  return MOCK_STOCKS
    .filter(s =>
      s.symbol.toLowerCase().includes(q) ||
      s.company.toLowerCase().includes(q) ||
      displaySymbol(s.symbol).toLowerCase().includes(q)
    )
    .slice(0, 8)
    .map(s => ({
      symbol: s.symbol,
      company: s.company,
      price: s.price,
      changePercent: s.changePercent,
      sector: s.sector,
    }))
}

export function StockSearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const setActiveSymbol = useAppStore(s => s.setActiveSymbol)

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    const timer = setTimeout(() => {
      const results = getSuggestions(query)
      setSuggestions(results)
      setOpen(results.length > 0)
      setHighlighted(-1)
    }, 120)
    return () => clearTimeout(timer)
  }, [query])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function selectStock(symbol: string) {
    setActiveSymbol(symbol)
    router.push('/charts')
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlighted >= 0 && suggestions[highlighted]) {
        selectStock(suggestions[highlighted].symbol)
      } else if (suggestions[0]) {
        selectStock(suggestions[0].symbol)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  // Highlight matching text
  function highlightMatch(text: string, query: string) {
    if (!query) return <span>{text}</span>
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return <span>{text}</span>
    return (
      <span>
        {text.slice(0, idx)}
        <span className="text-accent-orange font-bold">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </span>
    )
  }

  return (
    <div className="relative">
      {/* Input */}
      <div className="relative flex items-center">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && suggestions.length > 0 && setOpen(true)}
          placeholder="Search stock, e.g. REL, TCS…"
          className="terminal-input pl-8 pr-7 h-7 w-48 text-xs transition-all focus:w-64"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setSuggestions([]); setOpen(false) }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            <X size={11} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 w-72 bg-terminal-card border border-terminal-border rounded-sm shadow-xl z-[100] overflow-hidden animate-slide-up"
        >
          {/* Header */}
          <div className="px-3 py-1.5 border-b border-terminal-border/50 flex items-center justify-between">
            <span className="text-[10px] text-text-muted uppercase tracking-wider">
              {suggestions.length} results for "{query}"
            </span>
            <span className="text-[9px] text-text-muted">↑↓ navigate · Enter select</span>
          </div>

          {/* Suggestions */}
          {suggestions.map((s, i) => (
            <button
              key={s.symbol}
              onClick={() => selectStock(s.symbol)}
              onMouseEnter={() => setHighlighted(i)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors border-b border-terminal-border/20 last:border-0',
                highlighted === i ? 'bg-terminal-hover' : 'hover:bg-terminal-hover/50'
              )}
            >
              {/* Symbol + company */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-text-ticker">
                    {highlightMatch(displaySymbol(s.symbol), query)}
                  </span>
                  <span className="text-[9px] text-text-muted bg-terminal-border px-1.5 py-0.5 rounded-sm">
                    {s.sector}
                  </span>
                </div>
                <div className="text-[10px] text-text-secondary truncate mt-0.5">
                  {highlightMatch(s.company, query)}
                </div>
              </div>

              {/* Price + change */}
              <div className="text-right shrink-0">
                <div className="font-mono text-xs text-text-primary">₹{s.price.toFixed(2)}</div>
                <div className={cn(
                  'font-mono text-[10px] flex items-center justify-end gap-0.5',
                  s.changePercent >= 0 ? 'text-accent-green' : 'text-accent-red'
                )}>
                  {s.changePercent >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                  {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                </div>
              </div>
            </button>
          ))}

          {/* Footer hint */}
          <div className="px-3 py-1.5 bg-terminal-surface border-t border-terminal-border/50">
            <span className="text-[9px] text-text-muted">
              Aur results ke liye poora naam type karo
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
