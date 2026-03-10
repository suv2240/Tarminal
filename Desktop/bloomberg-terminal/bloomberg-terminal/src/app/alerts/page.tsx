'use client'
import { useState } from 'react'
import { useAppStore } from '@/store/zustandStore'
import { Bell, Plus, Trash2, CheckCircle, Clock, AlertTriangle, X, BellRing } from 'lucide-react'
import type { AlertCondition, PriceAlert } from '@/types'
import { cn, displaySymbol, formatINR } from '@/lib/utils'
import toast from 'react-hot-toast'

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export default function AlertsPage() {
  const { alerts, addAlert, removeAlert } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    symbol: '',
    company: '',
    condition: 'above' as AlertCondition,
    targetValue: '',
  })

  const activeAlerts = alerts.filter(a => !a.triggered)

  function requestNotificationPermission() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') toast.success('Notifications enabled! Alerts milenge ab.')
        else toast.error('Notifications blocked. Browser settings mein allow karo.')
      })
    }
  }

  const notifStatus = typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  const triggeredAlerts = alerts.filter(a => a.triggered)

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.symbol || !form.targetValue) {
      toast.error('Symbol and target price required')
      return
    }
    const alert: PriceAlert = {
      id: generateId(),
      symbol: form.symbol.toUpperCase().includes('.') ? form.symbol.toUpperCase() : `${form.symbol.toUpperCase()}.NS`,
      company: form.company || form.symbol.toUpperCase(),
      condition: form.condition,
      targetValue: parseFloat(form.targetValue),
      triggered: false,
      createdAt: new Date().toISOString(),
    }
    addAlert(alert)
    toast.success(`Alert created for ${displaySymbol(alert.symbol)}`)
    setForm({ symbol: '', company: '', condition: 'above', targetValue: '' })
    setShowForm(false)
  }

  function conditionLabel(condition: AlertCondition, value: number) {
    switch (condition) {
      case 'above': return `Price above ₹${value.toFixed(2)}`
      case 'below': return `Price below ₹${value.toFixed(2)}`
      case 'change_percent': return `Change exceeds ${value}%`
    }
  }

  return (
    <div className="p-3 space-y-3">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="terminal-card p-3">
          <div className="data-label mb-1">Active Alerts</div>
          <div className="font-mono text-2xl font-bold text-accent-orange">{activeAlerts.length}</div>
        </div>
        <div className="terminal-card p-3">
          <div className="data-label mb-1">Triggered</div>
          <div className="font-mono text-2xl font-bold text-accent-green">{triggeredAlerts.length}</div>
        </div>
        <div className="terminal-card p-3">
          <div className="data-label mb-1">Total Alerts</div>
          <div className="font-mono text-2xl font-bold text-text-primary">{alerts.length}</div>
        </div>
      </div>

      {/* Create alert */}
      <div className="terminal-card">
        <div className="px-3 py-2.5 flex items-center justify-between border-b border-terminal-border/50">
          <div className="flex items-center gap-2">
            <Bell size={13} className="text-accent-orange" />
            <span className="section-header m-0 p-0 border-0">Price Alerts</span>
          </div>
          <div className="flex items-center gap-2">
            {notifStatus !== 'granted' && notifStatus !== 'unsupported' && (
              <button onClick={requestNotificationPermission} className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3">
                <BellRing size={13} />
                Enable Notifications
              </button>
            )}
            {notifStatus === 'granted' && (
              <span className="text-xs text-accent-green font-mono flex items-center gap-1"><BellRing size={12} /> Notifications ON</span>
            )}
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3">
            <Plus size={13} />
            New Alert
          </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="p-3 bg-terminal-surface border-b border-terminal-border animate-slide-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
              <div>
                <label className="data-label mb-1 block">Symbol *</label>
                <input value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value }))}
                  placeholder="RELIANCE" className="terminal-input w-full text-xs h-8" required />
              </div>
              <div>
                <label className="data-label mb-1 block">Condition</label>
                <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value as AlertCondition }))}
                  className="terminal-input w-full text-xs h-8 cursor-pointer">
                  <option value="above">Price Above</option>
                  <option value="below">Price Below</option>
                  <option value="change_percent">Change % exceeds</option>
                </select>
              </div>
              <div>
                <label className="data-label mb-1 block">
                  {form.condition === 'change_percent' ? 'Change %' : 'Target Price ₹'} *
                </label>
                <input type="number" step="any" value={form.targetValue}
                  onChange={e => setForm(f => ({ ...f, targetValue: e.target.value }))}
                  placeholder={form.condition === 'change_percent' ? '5' : '3000'}
                  className="terminal-input w-full text-xs h-8" required />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary text-xs py-1.5 flex-1">Create</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost p-1.5">
                  <X size={14} />
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Active alerts */}
        <div className="divide-y divide-terminal-border/30">
          {alerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell size={32} className="text-text-muted opacity-30 mb-3" />
              <div className="text-sm text-text-muted">No alerts set</div>
              <div className="text-xs text-text-muted mt-1">Create alerts to get notified on price movements</div>
            </div>
          )}

          {activeAlerts.map(alert => (
            <AlertRow key={alert.id} alert={alert} onDelete={removeAlert} />
          ))}

          {triggeredAlerts.length > 0 && (
            <>
              <div className="px-3 py-2 bg-terminal-surface">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Triggered</span>
              </div>
              {triggeredAlerts.map(alert => (
                <AlertRow key={alert.id} alert={alert} onDelete={removeAlert} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function AlertRow({ alert, onDelete }: { alert: PriceAlert; onDelete: (id: string) => void }) {
  return (
    <div className={cn(
      'flex items-center gap-3 px-3 py-3 hover:bg-terminal-hover transition-colors',
      alert.triggered && 'opacity-60'
    )}>
      <div className={cn('w-8 h-8 rounded-sm flex items-center justify-center shrink-0',
        alert.triggered ? 'bg-accent-green/10' : 'bg-accent-orange/10'
      )}>
        {alert.triggered ? (
          <CheckCircle size={16} className="text-accent-green" />
        ) : (
          <Clock size={16} className="text-accent-orange" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="ticker-pill">{displaySymbol(alert.symbol)}</span>
          <span className="text-sm font-medium text-text-primary">
            {alert.condition === 'above' ? '↑' : alert.condition === 'below' ? '↓' : '±'}
            {' '}
            {alert.condition === 'change_percent'
              ? `${alert.targetValue}% change`
              : `₹${alert.targetValue.toFixed(2)}`}
          </span>
          {alert.triggered && (
            <span className="badge-positive text-[10px]">TRIGGERED</span>
          )}
        </div>
        <div className="text-[10px] text-text-muted mt-0.5">
          Created {new Date(alert.createdAt).toLocaleDateString('en-IN')}
          {alert.triggeredAt && ` · Triggered ${new Date(alert.triggeredAt).toLocaleDateString('en-IN')}`}
        </div>
      </div>

      <button onClick={() => onDelete(alert.id)} className="text-text-muted hover:text-accent-red transition-colors p-1">
        <Trash2 size={14} />
      </button>
    </div>
  )
}
