import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format Indian currency
export function formatINR(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_00_00_00_000) return `₹${(value / 1_00_00_00_000).toFixed(2)}K Cr`
    if (Math.abs(value) >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} Cr`
    if (Math.abs(value) >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)} L`
    if (Math.abs(value) >= 1_000) return `₹${(value / 1_000).toFixed(2)} K`
    return `₹${value.toFixed(2)}`
  }
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value)
}

// Format large numbers in Indian notation (Lakhs/Crores)
export function formatIndianNumber(num: number): string {
  if (num >= 1_00_00_00_000) return `${(num / 1_00_00_00_000).toFixed(2)} TCr`
  if (num >= 1_00_00_000) return `${(num / 1_00_00_000).toFixed(2)} Cr`
  if (num >= 1_00_000) return `${(num / 1_00_000).toFixed(2)} L`
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)} K`
  return num.toLocaleString('en-IN')
}

// Format volume
export function formatVolume(vol: number): string {
  if (vol >= 1_00_00_000) return `${(vol / 1_00_00_000).toFixed(2)} Cr`
  if (vol >= 1_00_000) return `${(vol / 1_00_000).toFixed(2)} L`
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)} K`
  return vol.toString()
}

// Format percent change with sign
export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

// Get color class based on value sign
export function getChangeColor(value: number): string {
  if (value > 0) return 'text-accent-green'
  if (value < 0) return 'text-accent-red'
  return 'text-text-secondary'
}

// Get bg color for change indicator
export function getChangeBg(value: number): string {
  if (value > 0) return 'bg-accent-green/10 text-accent-green'
  if (value < 0) return 'bg-accent-red/10 text-accent-red'
  return 'bg-text-muted/10 text-text-secondary'
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

// Normalize symbol (add .NS if missing)
export function normalizeSymbol(symbol: string): string {
  if (symbol.includes('.')) return symbol
  return `${symbol}.NS`
}

// Strip exchange suffix for display
export function displaySymbol(symbol: string): string {
  return symbol.replace('.NS', '').replace('.BO', '')
}

// Get market status
export function getMarketStatus(): { isOpen: boolean; label: string; color: string } {
  const now = new Date()
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const hours = ist.getHours()
  const minutes = ist.getMinutes()
  const day = ist.getDay()
  const timeNum = hours * 100 + minutes

  if (day === 0 || day === 6) return { isOpen: false, label: 'CLOSED (Weekend)', color: 'text-text-muted' }
  if (timeNum >= 915 && timeNum < 1530) return { isOpen: true, label: 'MARKET OPEN', color: 'text-accent-green' }
  if (timeNum >= 900 && timeNum < 915) return { isOpen: false, label: 'PRE-OPEN', color: 'text-accent-yellow' }
  return { isOpen: false, label: 'MARKET CLOSED', color: 'text-text-secondary' }
}

// Simulate price fluctuation (for mock real-time)
export function simulatePriceChange(price: number, volatility = 0.002): number {
  const change = (Math.random() - 0.5) * 2 * volatility
  return Math.max(0, price * (1 + change))
}

// Format market cap
export function formatMarketCap(cap: number): string {
  if (cap >= 1e12) return `₹${(cap / 1e12).toFixed(2)}T`
  if (cap >= 1e9) return `₹${(cap / 1e9).toFixed(2)}B`
  if (cap >= 1e7) return `₹${(cap / 1e7).toFixed(0)} Cr`
  return formatINR(cap, true)
}

// Get market cap category
export function getMarketCapCategory(marketCap: number): 'large' | 'mid' | 'small' {
  const crores = marketCap / 1e7
  if (crores >= 20000) return 'large'
  if (crores >= 5000) return 'mid'
  return 'small'
}

// Truncate text
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength).trim() + '…'
}
