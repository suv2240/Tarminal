'use client'
import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store/zustandStore'
import toast from 'react-hot-toast'

export function useAlertNotifications() {
  const { alerts, stockCache, triggerAlert } = useAppStore()
  const notifiedIds = useRef<Set<string>>(new Set())

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }, [])

  // Check alerts against current prices every 5 seconds
  useEffect(() => {
    function checkAlerts() {
      const activeAlerts = alerts.filter(a => !a.triggered)
      
      for (const alert of activeAlerts) {
        if (notifiedIds.current.has(alert.id)) continue
        
        const stock = stockCache[alert.symbol]
        if (!stock) continue

        const currentPrice = stock.price
        let triggered = false

        if (alert.condition === 'above' && currentPrice >= alert.targetValue) triggered = true
        if (alert.condition === 'below' && currentPrice <= alert.targetValue) triggered = true
        if (alert.condition === 'change_percent' && Math.abs(stock.changePercent) >= alert.targetValue) triggered = true

        if (triggered) {
          notifiedIds.current.add(alert.id)
          triggerAlert(alert.id)

          const symbol = alert.symbol.replace('.NS', '')
          const msg = alert.condition === 'above'
            ? `${symbol} ₹${currentPrice.toFixed(2)} pe pahuncha (Target: ₹${alert.targetValue})`
            : alert.condition === 'below'
            ? `${symbol} ₹${currentPrice.toFixed(2)} pe gira (Target: ₹${alert.targetValue})`
            : `${symbol} ${stock.changePercent.toFixed(1)}% move kiya!`

          // In-app toast
          toast(msg, {
            icon: '🔔',
            duration: 6000,
            style: {
              background: '#12121f',
              color: '#ffd700',
              border: '1px solid rgba(255,215,0,0.3)',
            },
          })

          // Browser notification
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('BharatTerminal Alert 🔔', {
              body: msg,
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              tag: alert.id,
            })
          }
        }
      }
    }

    const interval = setInterval(checkAlerts, 5000)
    return () => clearInterval(interval)
  }, [alerts, stockCache, triggerAlert])
}

// Component to mount the hook globally
export function AlertNotificationManager() {
  useAlertNotifications()
  return null
}
