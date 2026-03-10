import { NextResponse } from 'next/server'
import { MOCK_GAINERS, MOCK_LOSERS, MOCK_HIGH_VOLUME } from '@/lib/mockData'

const NSE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  'Accept': '*/*',
  'Referer': 'https://www.nseindia.com/',
  'Origin': 'https://www.nseindia.com',
}

async function getNSECookies(): Promise<string> {
  try {
    const res = await fetch('https://www.nseindia.com/', {
      headers: NSE_HEADERS, signal: AbortSignal.timeout(8000),
    })
    const setCookie = res.headers.get('set-cookie') || ''
    return setCookie.split(',').map(c => c.split(';')[0].trim()).filter(Boolean).join('; ')
  } catch { return '' }
}

export async function GET() {
  try {
    const cookies = await getNSECookies()

    // Fetch NIFTY 50 constituents — gives us real top movers
    const res = await fetch(
      'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050',
      { headers: { ...NSE_HEADERS, Cookie: cookies }, signal: AbortSignal.timeout(10000) }
    )

    if (!res.ok) throw new Error(`NSE ${res.status}`)

    const data = await res.json()
    const stocks = (data?.data || []).slice(1) // skip first (index itself)
      .map((item: Record<string, unknown>) => ({
        symbol: String(item.symbol || '') + '.NS',
        company: String(item.meta?.companyName || item.symbol || ''),
        price: Number(item.lastPrice || item.last || 0),
        change: Number(item.change || 0),
        changePercent: Number(item.pChange || 0),
        volume: Number(item.totalTradedVolume || item.quantityTraded || 0),
      }))
      .filter((s: { price: number }) => s.price > 0)

    if (stocks.length < 5) throw new Error('Not enough data')

    const gainers = [...stocks].sort((a: { changePercent: number }, b: { changePercent: number }) => b.changePercent - a.changePercent).slice(0, 5)
    const losers = [...stocks].sort((a: { changePercent: number }, b: { changePercent: number }) => a.changePercent - b.changePercent).slice(0, 5)
    const highVolume = [...stocks].sort((a: { volume: number }, b: { volume: number }) => b.volume - a.volume).slice(0, 5)

    return NextResponse.json({ gainers, losers, highVolume }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    })
  } catch (err) {
    console.warn('[NSE Movers] fallback:', (err as Error).message)
    return NextResponse.json({ gainers: MOCK_GAINERS, losers: MOCK_LOSERS, highVolume: MOCK_HIGH_VOLUME })
  }
}
