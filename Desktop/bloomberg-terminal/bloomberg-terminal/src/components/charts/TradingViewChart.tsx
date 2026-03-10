'use client'
import { useEffect, useRef } from 'react'
import { displaySymbol } from '@/lib/utils'

interface Props {
  symbol: string
  height?: number
}

// Map our internal symbol to TradingView format
function toTVSymbol(symbol: string): string {
  const base = displaySymbol(symbol)
  // TradingView uses NSE: prefix for Indian stocks
  const tvMap: Record<string, string> = {
    'RELIANCE': 'NSE:RELIANCE',
    'TCS': 'NSE:TCS',
    'HDFCBANK': 'NSE:HDFCBANK',
    'INFY': 'NSE:INFY',
    'ITC': 'NSE:ITC',
    'SBIN': 'NSE:SBIN',
    'BAJFINANCE': 'NSE:BAJFINANCE',
    'MARUTI': 'NSE:MARUTI',
    'SUNPHARMA': 'NSE:SUNPHARMA',
    'WIPRO': 'NSE:WIPRO',
    'LTIM': 'NSE:LTIM',
    'TATAMOTORS': 'NSE:TATAMOTORS',
    'ONGC': 'NSE:ONGC',
    'ASIANPAINT': 'NSE:ASIANPAINT',
    'POWERGRID': 'NSE:POWERGRID',
  }
  return tvMap[base] || `NSE:${base}`
}

export function TradingViewChart({ symbol, height }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tvSymbol = toTVSymbol(symbol)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous widget
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined' && containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: 'D',
          timezone: 'Asia/Kolkata',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#0f0f1a',
          enable_publishing: false,
          withdateranges: true,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies', 'BB@tv-basicstudies'],
          container_id: 'tv_chart_container',
          backgroundColor: '#0a0a0f',
          gridColor: 'rgba(26, 26, 46, 0.5)',
          overrides: {
            'paneProperties.background': '#0a0a0f',
            'paneProperties.backgroundGradientStartColor': '#0a0a0f',
            'paneProperties.backgroundGradientEndColor': '#0a0a0f',
            'paneProperties.vertGridProperties.color': '#1a1a2e',
            'paneProperties.horzGridProperties.color': '#1a1a2e',
            'symbolWatermarkProperties.transparency': 90,
            'scalesProperties.textColor': '#8888aa',
            'mainSeriesProperties.candleStyle.upColor': '#00d084',
            'mainSeriesProperties.candleStyle.downColor': '#ff3b5c',
            'mainSeriesProperties.candleStyle.borderUpColor': '#00d084',
            'mainSeriesProperties.candleStyle.borderDownColor': '#ff3b5c',
            'mainSeriesProperties.candleStyle.wickUpColor': '#00d084',
            'mainSeriesProperties.candleStyle.wickDownColor': '#ff3b5c',
          },
        })
      }
    }

    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [tvSymbol])

  return (
    <div
      ref={containerRef}
      id="tv_chart_container"
      className="w-full h-full"
      style={{ minHeight: height || '400px' }}
    />
  )
}

// Extend Window interface for TradingView
declare global {
  interface Window {
    TradingView: {
      widget: new (config: Record<string, unknown>) => void
    }
  }
}
