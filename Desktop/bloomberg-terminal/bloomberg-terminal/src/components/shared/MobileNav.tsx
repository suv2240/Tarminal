'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, Home, Map, Bell, Briefcase, Activity } from 'lucide-react'
import { useAppStore } from '@/store/zustandStore'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/charts', icon: BarChart2, label: 'Charts' },
  { href: '/portfolio', icon: Briefcase, label: 'Portfolio' },
  { href: '/alerts', icon: Bell, label: 'Alerts' },
  { href: '/charts-advanced', icon: Activity, label: 'Heatmap' },
]

export function MobileNav() {
  const pathname = usePathname()
  const alerts = useAppStore(s => s.alerts)
  const pendingAlerts = alerts.filter(a => !a.triggered).length

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-terminal-surface border-t border-terminal-border">
      <div className="flex items-stretch h-14">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] transition-colors relative',
                isActive ? 'text-accent-orange' : 'text-text-muted'
              )}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent-orange rounded-b-full" />
              )}
              <div className="relative">
                <Icon size={18} />
                {label === 'Alerts' && pendingAlerts > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-accent-red rounded-full text-[7px] font-bold flex items-center justify-center text-white">
                    {pendingAlerts}
                  </span>
                )}
              </div>
              <span className="font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
