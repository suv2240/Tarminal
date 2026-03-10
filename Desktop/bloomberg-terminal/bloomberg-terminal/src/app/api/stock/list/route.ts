import { NextRequest, NextResponse } from 'next/server'
import { fetchStockList } from '@/lib/nseApiClient'

export async function GET(req: NextRequest) {
  const symbolsParam = req.nextUrl.searchParams.get('symbols')
  if (!symbolsParam) return NextResponse.json({ error: 'symbols required' }, { status: 400 })
  
  const symbols = symbolsParam.split(',').map(s => s.trim()).filter(Boolean)
  const stocks = await fetchStockList(symbols)
  
  return NextResponse.json({ stocks }, { headers: { 'Cache-Control': 'no-store' } })
}
