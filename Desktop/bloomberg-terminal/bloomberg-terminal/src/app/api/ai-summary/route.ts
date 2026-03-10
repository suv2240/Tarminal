import { NextRequest, NextResponse } from 'next/server'
import { generateStockSummary } from '@/lib/llmClient'
import { fetchStock } from '@/lib/nseApiClient'
import { fetchStockNews } from '@/lib/newsApiClient'

export async function POST(req: NextRequest) {
  try {
    const { symbol } = await req.json()
    if (!symbol) return NextResponse.json({ error: 'symbol required' }, { status: 400 })

    const [stock, news] = await Promise.all([
      fetchStock(symbol),
      fetchStockNews(symbol, 3),
    ])

    if (!stock) return NextResponse.json({ error: 'Stock not found' }, { status: 404 })

    const newsSnippet = news.slice(0, 2).map(n => n.title).join('. ')
    const summary = await generateStockSummary(stock, newsSnippet)

    return NextResponse.json({ summary })
  } catch (err) {
    console.error('[API] ai-summary error:', err)
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}
