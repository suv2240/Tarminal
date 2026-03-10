'use client'
import { useState, useMemo } from 'react'
import { MOCK_STOCKS, SECTORS } from '@/lib/mockData'
import { formatPercent, formatMarketCap, getChangeColor, cn, displaySymbol, getMarketCapCategory } from '@/lib/utils'
import type { ScreenerFilters, SortField, SortDirection } from '@/types'
import { Filter, ChevronUp, ChevronDown, TrendingUp, Search } from 'lucide-react'
import { useAppStore } from '@/store/zustandStore'
import { useRouter } from 'next/navigation'

export default function ScreenerPage() {
  const [filters, setFilters] = useState<ScreenerFilters>({})
  const [sortField, setSortField] = useState<SortField>('marketCap')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')
  const [showFilters, setShowFilters] = useState(true)
  const setActiveSymbol = useAppStore(s => s.setActiveSymbol)
  const router = useRouter()

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const filtered = useMemo(() => {
    let stocks = [...MOCK_STOCKS]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      stocks = stocks.filter(s =>
        s.symbol.toLowerCase().includes(q) || s.company.toLowerCase().includes(q)
      )
    }
    if (filters.sector && filters.sector !== 'All') {
      stocks = stocks.filter(s => s.sector === filters.sector)
    }
    if (filters.peMin !== undefined) stocks = stocks.filter(s => s.pe >= filters.peMin!)
    if (filters.peMax !== undefined) stocks = stocks.filter(s => s.pe <= filters.peMax!)
    if (filters.dividendYieldMin !== undefined) stocks = stocks.filter(s => s.dividendYield >= filters.dividendYieldMin!)
    if (filters.roeMin !== undefined) stocks = stocks.filter(s => s.roe >= filters.roeMin!)
    if (filters.marketCap && filters.marketCap !== 'all') {
      stocks = stocks.filter(s => getMarketCapCategory(s.marketCap) === filters.marketCap)
    }

    stocks.sort((a, b) => {
      let va = a[sortField as keyof typeof a] as number
      let vb = b[sortField as keyof typeof b] as number
      if (typeof va === 'string') va = 0
      if (typeof vb === 'string') vb = 0
      return sortDir === 'asc' ? va - vb : vb - va
    })

    return stocks
  }, [filters, sortField, sortDir])

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronDown size={11} className="opacity-30" />
    return sortDir === 'asc' ? <ChevronUp size={11} className="text-accent-orange" /> : <ChevronDown size={11} className="text-accent-orange" />
  }

  const TH = ({ field, label, right = true }: { field: SortField; label: string; right?: boolean }) => (
    <th
      onClick={() => handleSort(field)}
      className={cn(
        'cursor-pointer select-none hover:text-text-primary transition-colors',
        right ? 'text-right' : 'text-left pl-3'
      )}
    >
      <span className="flex items-center gap-1 justify-end">
        {label} <SortIcon field={field} />
      </span>
    </th>
  )

  return (
    <div className="p-3 space-y-3">
      {/* Filters panel */}
      <div className="terminal-card">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-terminal-hover transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-accent-orange" />
            <span className="section-header m-0 p-0 border-0">Screener Filters</span>
            <span className="badge-neutral text-[10px]">{filtered.length} results</span>
          </div>
          <ChevronDown size={14} className={cn('text-text-muted transition-transform', !showFilters && '-rotate-90')} />
        </button>

        {showFilters && (
          <div className="px-3 pb-3 border-t border-terminal-border/50 pt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 animate-slide-up">
            {/* Search */}
            <div className="col-span-2 md:col-span-1">
              <label className="data-label mb-1 block">Search</label>
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  value={filters.search || ''}
                  onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                  placeholder="Symbol / Company"
                  className="terminal-input w-full pl-7 text-xs h-8"
                />
              </div>
            </div>

            {/* Sector */}
            <div>
              <label className="data-label mb-1 block">Sector</label>
              <select
                value={filters.sector || 'All'}
                onChange={e => setFilters(f => ({ ...f, sector: e.target.value }))}
                className="terminal-input w-full text-xs h-8 cursor-pointer"
              >
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Market Cap */}
            <div>
              <label className="data-label mb-1 block">Market Cap</label>
              <select
                value={filters.marketCap || 'all'}
                onChange={e => setFilters(f => ({ ...f, marketCap: e.target.value as 'large' | 'mid' | 'small' | 'all' }))}
                className="terminal-input w-full text-xs h-8 cursor-pointer"
              >
                <option value="all">All</option>
                <option value="large">Large Cap (20K+ Cr)</option>
                <option value="mid">Mid Cap (5K-20K Cr)</option>
                <option value="small">Small Cap (&lt;5K Cr)</option>
              </select>
            </div>

            {/* P/E Range */}
            <div>
              <label className="data-label mb-1 block">P/E Range</label>
              <div className="flex gap-1">
                <input
                  type="number" placeholder="Min"
                  value={filters.peMin ?? ''}
                  onChange={e => setFilters(f => ({ ...f, peMin: e.target.value ? Number(e.target.value) : undefined }))}
                  className="terminal-input w-full text-xs h-8 text-center"
                />
                <input
                  type="number" placeholder="Max"
                  value={filters.peMax ?? ''}
                  onChange={e => setFilters(f => ({ ...f, peMax: e.target.value ? Number(e.target.value) : undefined }))}
                  className="terminal-input w-full text-xs h-8 text-center"
                />
              </div>
            </div>

            {/* Div Yield */}
            <div>
              <label className="data-label mb-1 block">Min Div Yield %</label>
              <input
                type="number" step="0.1" placeholder="e.g. 1.5"
                value={filters.dividendYieldMin ?? ''}
                onChange={e => setFilters(f => ({ ...f, dividendYieldMin: e.target.value ? Number(e.target.value) : undefined }))}
                className="terminal-input w-full text-xs h-8"
              />
            </div>

            {/* ROE */}
            <div>
              <label className="data-label mb-1 block">Min ROE %</label>
              <input
                type="number" step="0.1" placeholder="e.g. 15"
                value={filters.roeMin ?? ''}
                onChange={e => setFilters(f => ({ ...f, roeMin: e.target.value ? Number(e.target.value) : undefined }))}
                className="terminal-input w-full text-xs h-8"
              />
            </div>

            <div className="col-span-2 md:col-span-3 lg:col-span-6 flex justify-end">
              <button
                onClick={() => setFilters({})}
                className="btn-ghost text-xs py-1 text-text-muted"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results table */}
      <div className="terminal-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="terminal-table">
            <thead>
              <tr>
                <th className="pl-3 text-left cursor-pointer" onClick={() => handleSort('symbol')}>
                  <span className="flex items-center gap-1">Symbol <SortIcon field="symbol" /></span>
                </th>
                <th className="text-left">Sector</th>
                <TH field="price" label="Price" />
                <TH field="change" label="Change %" />
                <TH field="pe" label="P/E" />
                <TH field="marketCap" label="Mkt Cap" />
                <TH field="dividendYield" label="Div Yield" />
                <TH field="roe" label="ROE %" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(stock => (
                <tr
                  key={stock.symbol}
                  onClick={() => { setActiveSymbol(stock.symbol); router.push('/charts') }}
                  className="cursor-pointer"
                >
                  <td className="pl-3">
                    <div className="ticker-pill">{displaySymbol(stock.symbol)}</div>
                    <div className="text-[10px] text-text-muted mt-0.5 max-w-[120px] truncate">{stock.company}</div>
                  </td>
                  <td className="text-left text-xs text-text-secondary">{stock.sector}</td>
                  <td className="font-mono">₹{stock.price.toFixed(2)}</td>
                  <td>
                    <span className={cn('font-mono text-xs font-medium', getChangeColor(stock.changePercent))}>
                      {formatPercent(stock.changePercent)}
                    </span>
                  </td>
                  <td className="font-mono">{stock.pe.toFixed(1)}</td>
                  <td className="font-mono text-xs">{formatMarketCap(stock.marketCap)}</td>
                  <td className={cn('font-mono', stock.dividendYield > 2 ? 'text-accent-green' : '')}>
                    {stock.dividendYield.toFixed(2)}%
                  </td>
                  <td className={cn('font-mono pr-3', stock.roe > 20 ? 'text-accent-green' : stock.roe > 10 ? 'text-text-primary' : 'text-accent-red')}>
                    {stock.roe.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
