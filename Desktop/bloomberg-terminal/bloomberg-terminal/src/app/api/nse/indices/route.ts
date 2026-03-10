import { NextResponse } from 'next/server'
import { MOCK_INDICES } from '@/lib/mockData'

const NSE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.nseindia.com/',
  'Origin': 'https://www.nseindia.com',
}

async function getNSECookies(): Promise<string> {
  try {
    const res = await fetch('https://www.nseindia.com/', {
      headers: NSE_HEADERS,
      signal: AbortSignal.timeout(8000),
    })
    const setCookie = res.headers.get('set-cookie') || ''
    return setCookie.split(',').map(c => c.split(';')[0].trim()).filter(Boolean).join('; ')
  } catch { return '' }
}

async function fetchIndex(indexName: string, cookies: string) {
  const res = await fetch(
    `https://www.nseindia.com/api/equity-stockIndices?index=${encodeURIComponent(indexName)}`,
    { headers: { ...NSE_HEADERS, Cookie: cookies }, signal: AbortSignal.timeout(8000) }
  )
  if (!res.ok) return null
  const data = await res.json()
  // First item in data.data array is the index itself
  const idx = data?.data?.[0]
  if (!idx) return null
  return {
    value: Number(idx.last || idx.lastPrice || 0),
    change: Number(idx.change || 0),
    changePercent: Number(idx.pChange || idx.percentChange || 0),
  }
}

export async function GET() {
  try {
    const cookies = await getNSECookies()

    const [nifty, banknifty, midcap] = await Promise.allSettled([
      fetchIndex('NIFTY 50', cookies),
      fetchIndex('NIFTY BANK', cookies),
      fetchIndex('NIFTY MIDCAP 100', cookies),
    ])

    const indices = []

    if (nifty.status === 'fulfilled' && nifty.value?.value) {
      indices.push({ name: 'NIFTY 50', symbol: 'NIFTY', ...nifty.value })
    }
    if (banknifty.status === 'fulfilled' && banknifty.value?.value) {
      indices.push({ name: 'BANK NIFTY', symbol: 'BANKNIFTY', ...banknifty.value })
    }
    if (midcap.status === 'fulfilled' && midcap.value?.value) {
      indices.push({ name: 'MIDCAP 100', symbol: 'MIDCAP', ...midcap.value })
    }

    // Fill remaining with mock
    const final = indices.length > 0
      ? [...indices, ...MOCK_INDICES.slice(indices.length)]
      : MOCK_INDICES

    return NextResponse.json({ indices: final }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    })
  } catch (err) {
    console.warn('[NSE Indices] fallback to mock:', (err as Error).message)
    return NextResponse.json({ indices: MOCK_INDICES })
  }
}
