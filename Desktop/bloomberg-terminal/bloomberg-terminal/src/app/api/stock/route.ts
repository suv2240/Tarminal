import { NextRequest, NextResponse } from 'next/server'
import { fetchStock } from '@/lib/nseApiClient'

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get('symbol')
  if (!symbol) return NextResponse.json({ error: 'symbol required' }, { status: 400 })

  const stock = await fetchStock(symbol)
  if (!stock) return NextResponse.json({ error: 'Stock not found' }, { status: 404 })

  return NextResponse.json({ stock }, {
    headers: { 'Cache-Control': 'no-store' }
  })
}
