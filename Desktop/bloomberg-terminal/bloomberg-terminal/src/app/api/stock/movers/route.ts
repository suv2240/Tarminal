import { NextResponse } from 'next/server'
import { fetchMarketMovers } from '@/lib/nseApiClient'

export async function GET() {
  const movers = await fetchMarketMovers()
  return NextResponse.json(movers, { headers: { 'Cache-Control': 'no-store' } })
}
