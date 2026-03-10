'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart2, Home, Map, Bell, Briefcase, Filter, Sun, Moon, ChevronLeft, ChevronRight, LogIn, LogOut, User, Activity } from 'lucide-react'
import Image from 'next/image'
import { useAppStore } from '@/store/zustandStore'
import { useAuth } from '@/components/auth/AuthProvider'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/charts', icon: BarChart2, label: 'Charts' },
  { href: '/portfolio', icon: Briefcase, label: 'Portfolio' },
  { href: '/screener', icon: Filter, label: 'Screener' },
  { href: '/alerts', icon: Bell, label: 'Alerts' },
  { href: '/map', icon: Map, label: 'World Map' },
  { href: '/charts-advanced', icon: Activity, label: 'Heatmap' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme, sidebarCollapsed, setSidebarCollapsed, alerts } = useAppStore()
  const { user, signOut } = useAuth()
  const pendingAlerts = alerts.filter(a => !a.triggered).length

  async function handleSignOut() {
    await signOut()
    toast.success('Logged out')
    router.push('/auth/login')
  }

  return (
    <aside className={cn(
      'hidden md:flex flex-col bg-terminal-surface border-r border-terminal-border transition-all duration-300 z-50',
      sidebarCollapsed ? 'w-14' : 'w-52'
    )}>
      {/* Logo */}
      <div className={cn('flex items-center h-14 border-b border-terminal-border px-2 shrink-0', sidebarCollapsed ? 'justify-center' : 'gap-2')}>
        <div className="relative w-9 h-9 rounded-sm overflow-hidden shrink-0 border border-terminal-border">
          <Image src="/logo.png" alt="Bairagi Research Capital" fill className="object-cover" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <div className="font-display font-bold text-[11px] text-text-primary tracking-wide leading-tight">BAIRAGI RESEARCH</div>
            <div className="font-mono text-[9px] text-accent-orange tracking-[0.15em] leading-none mt-0.5">CAPITAL</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link key={href} href={href} className={cn(
              'flex items-center gap-3 px-2 py-2.5 rounded-sm text-sm transition-all group relative',
              isActive
                ? 'bg-accent-orange/10 text-accent-orange border-l-2 border-accent-orange -ml-px'
                : 'text-text-secondary hover:bg-terminal-hover hover:text-text-primary'
            )}>
              <div className="relative shrink-0">
                <Icon size={16} />
                {label === 'Alerts' && pendingAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent-red rounded-full text-[8px] font-bold flex items-center justify-center text-white">
                    {pendingAlerts > 9 ? '9+' : pendingAlerts}
                  </span>
                )}
              </div>
              {!sidebarCollapsed && <span className="font-medium tracking-wide">{label}</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-terminal-card border border-terminal-border rounded-sm text-xs text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom controls */}
      <div className="px-2 py-3 border-t border-terminal-border space-y-1">

        {/* User info / Login */}
        {user ? (
          <div className={cn('px-2 py-2 rounded-sm bg-terminal-hover', sidebarCollapsed ? 'flex justify-center' : '')}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-accent-orange/20 flex items-center justify-center shrink-0">
                  <User size={12} className="text-accent-orange" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-text-primary truncate">
                    {user.user_metadata?.full_name || 'User'}
                  </div>
                  <div className="text-[10px] text-text-muted truncate">{user.email}</div>
                </div>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className={cn(
                'flex items-center gap-2 text-text-muted hover:text-accent-red transition-colors text-xs',
                sidebarCollapsed ? '' : 'w-full'
              )}
            >
              <LogOut size={13} />
              {!sidebarCollapsed && 'Sign Out'}
            </button>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="flex items-center gap-2 px-2 py-2 rounded-sm text-text-secondary hover:bg-terminal-hover hover:text-accent-orange transition-colors text-sm"
          >
            <LogIn size={15} />
            {!sidebarCollapsed && 'Sign In'}
          </Link>
        )}

        {/* Theme */}
        <button onClick={toggleTheme} className="flex items-center gap-3 w-full px-2 py-2 rounded-sm text-text-secondary hover:bg-terminal-hover transition-colors">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          {!sidebarCollapsed && <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Live indicator */}
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2 px-2 py-1.5">
            <span className="live-dot w-1.5 h-1.5" />
            <span className="text-xs text-accent-green font-mono">LIVE</span>
          </div>
        )}

        {/* Collapse */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex items-center gap-3 w-full px-2 py-2 rounded-sm text-text-muted hover:bg-terminal-hover transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          {!sidebarCollapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
