'use client'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/zustandStore'
import { useWatchlistData } from '@/hooks/useMarketData'
import { formatINR, formatPercent, getChangeColor, cn, displaySymbol, getChangeBg } from '@/lib/utils'
import { Plus, Trash2, Edit2, Briefcase, TrendingUp, TrendingDown, PieChart, X, Check } from 'lucide-react'
import type { Holding } from '@/types'
import toast from 'react-hot-toast'
import { MOCK_STOCKS } from '@/lib/mockData'

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export default function PortfolioPage() {
  const { holdings, addHolding, removeHolding, updateHolding } = useAppStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ symbol: '', company: '', quantity: '', buyPrice: '' })
  const [editForm, setEditForm] = useState({ quantity: '', buyPrice: '' })

  // Get current prices from mock + cache
  function getCurrentPrice(symbol: string): number {
    const stock = MOCK_STOCKS.find(s => s.symbol === symbol)
    return stock?.price || 0
  }

  // Calculate portfolio summary
  const totalInvested = holdings.reduce((sum, h) => sum + h.quantity * h.buyPrice, 0)
  const currentValue = holdings.reduce((sum, h) => sum + h.quantity * (getCurrentPrice(h.symbol)), 0)
  const totalPnL = currentValue - totalInvested
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.symbol || !form.quantity || !form.buyPrice) {
      toast.error('Please fill all required fields')
      return
    }
    const sym = form.symbol.trim().toUpperCase()
    const fullSym = sym.includes('.') ? sym : `${sym}.NS`
    const mockStock = MOCK_STOCKS.find(s => s.symbol === fullSym)

    const holding: Holding = {
      id: generateId(),
      symbol: fullSym,
      company: form.company || mockStock?.company || sym,
      quantity: parseFloat(form.quantity),
      buyPrice: parseFloat(form.buyPrice),
      sector: mockStock?.sector,
      addedAt: new Date().toISOString(),
    }
    addHolding(holding)
    toast.success(`Added ${sym} to portfolio`)
    setForm({ symbol: '', company: '', quantity: '', buyPrice: '' })
    setShowAddForm(false)
  }

  function handleDelete(id: string, symbol: string) {
    removeHolding(id)
    toast.success(`Removed ${displaySymbol(symbol)} from portfolio`)
  }

  function handleEdit(holding: Holding) {
    setEditingId(holding.id)
    setEditForm({ quantity: holding.quantity.toString(), buyPrice: holding.buyPrice.toString() })
  }

  function handleEditSave(id: string) {
    updateHolding(id, {
      quantity: parseFloat(editForm.quantity),
      buyPrice: parseFloat(editForm.buyPrice),
    })
    setEditingId(null)
    toast.success('Updated holding')
  }

  return (
    <div className="p-3 space-y-3">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Invested', value: formatINR(totalInvested, true), change: null },
          { label: 'Current Value', value: formatINR(currentValue, true), change: null },
          { label: 'Total P&L', value: formatINR(totalPnL, true), change: totalPnLPercent },
          { label: 'Holdings', value: holdings.length.toString(), change: null },
        ].map(({ label, value, change }) => (
          <div key={label} className="terminal-card p-3">
            <div className="data-label mb-1">{label}</div>
            <div className={cn('font-mono text-xl font-bold',
              change !== null ? getChangeColor(change) : 'text-text-primary'
            )}>
              {value}
            </div>
            {change !== null && (
              <div className={cn('font-mono text-xs mt-0.5', getChangeColor(change))}>
                {formatPercent(change)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Holdings table */}
      <div className="terminal-card">
        <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-terminal-border/50">
          <div className="flex items-center gap-2">
            <Briefcase size={13} className="text-accent-orange" />
            <span className="section-header m-0 p-0 border-0">Holdings ({holdings.length})</span>
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3">
            <Plus size={13} />
            Add Stock
          </button>
        </div>

        {/* Add form */}
        {showAddForm && (
          <div className="p-3 bg-terminal-surface border-b border-terminal-border animate-slide-up">
            <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-4 gap-2 items-end">
              <div>
                <label className="data-label mb-1 block">Symbol *</label>
                <input value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value }))}
                  placeholder="RELIANCE" className="terminal-input w-full text-xs h-8" required />
              </div>
              <div>
                <label className="data-label mb-1 block">Company</label>
                <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  placeholder="Auto-detect" className="terminal-input w-full text-xs h-8" />
              </div>
              <div>
                <label className="data-label mb-1 block">Quantity *</label>
                <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  placeholder="100" className="terminal-input w-full text-xs h-8" required min="0.001" step="any" />
              </div>
              <div>
                <label className="data-label mb-1 block">Buy Price ₹ *</label>
                <input type="number" value={form.buyPrice} onChange={e => setForm(f => ({ ...f, buyPrice: e.target.value }))}
                  placeholder="2500" className="terminal-input w-full text-xs h-8" required min="0.01" step="any" />
              </div>
              <div className="col-span-2 md:col-span-4 flex gap-2">
                <button type="submit" className="btn-primary text-xs py-1.5">Add Holding</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary text-xs py-1.5">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        {holdings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <PieChart size={32} className="text-text-muted opacity-30 mb-3" />
            <div className="text-sm text-text-muted">No holdings yet</div>
            <div className="text-xs text-text-muted mt-1">Add your first stock to track P&L</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="terminal-table">
              <thead>
                <tr>
                  <th className="pl-3 text-left">Symbol</th>
                  <th>Qty</th>
                  <th>Avg Cost</th>
                  <th>CMP</th>
                  <th>Invested</th>
                  <th>Curr Value</th>
                  <th>P&L</th>
                  <th>P&L %</th>
                  <th className="pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map(holding => {
                  const cmp = getCurrentPrice(holding.symbol)
                  const invested = holding.quantity * holding.buyPrice
                  const currValue = holding.quantity * cmp
                  const pnl = currValue - invested
                  const pnlPct = (pnl / invested) * 100

                  return (
                    <tr key={holding.id}>
                      <td className="pl-3">
                        <div className="ticker-pill">{displaySymbol(holding.symbol)}</div>
                        <div className="text-[10px] text-text-muted mt-0.5 max-w-[100px] truncate">{holding.company}</div>
                      </td>
                      <td>
                        {editingId === holding.id ? (
                          <input type="number" value={editForm.quantity} onChange={e => setEditForm(f => ({ ...f, quantity: e.target.value }))}
                            className="terminal-input w-20 text-xs h-6 text-right" />
                        ) : holding.quantity}
                      </td>
                      <td>
                        {editingId === holding.id ? (
                          <input type="number" value={editForm.buyPrice} onChange={e => setEditForm(f => ({ ...f, buyPrice: e.target.value }))}
                            className="terminal-input w-24 text-xs h-6 text-right" />
                        ) : `₹${holding.buyPrice.toFixed(2)}`}
                      </td>
                      <td className="text-text-primary font-medium">₹{cmp.toFixed(2)}</td>
                      <td>₹{invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      <td>₹{currValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      <td className={getChangeColor(pnl)}>
                        {pnl >= 0 ? '+' : ''}₹{Math.abs(pnl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                      <td>
                        <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded-sm', getChangeBg(pnlPct))}>
                          {formatPercent(pnlPct)}
                        </span>
                      </td>
                      <td className="pr-3">
                        <div className="flex items-center justify-end gap-1">
                          {editingId === holding.id ? (
                            <>
                              <button onClick={() => handleEditSave(holding.id)} className="text-accent-green hover:text-accent-green-dim p-1">
                                <Check size={13} />
                              </button>
                              <button onClick={() => setEditingId(null)} className="text-text-muted hover:text-text-secondary p-1">
                                <X size={13} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEdit(holding)} className="text-text-muted hover:text-accent-blue p-1 transition-colors">
                                <Edit2 size={13} />
                              </button>
                              <button onClick={() => handleDelete(holding.id, holding.symbol)} className="text-text-muted hover:text-accent-red p-1 transition-colors">
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
