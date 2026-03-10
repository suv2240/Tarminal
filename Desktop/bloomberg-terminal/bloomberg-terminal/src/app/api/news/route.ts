import { NextRequest, NextResponse } from 'next/server'
import { fetchIndiaNews } from '@/lib/newsApiClient'
import type { NewsCategory } from '@/types'

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') as NewsCategory | undefined
  const limit = Number(req.nextUrl.searchParams.get('limit') || 20)

  const news = await fetchIndiaNews(category, limit)
  return NextResponse.json({ news }, { headers: { 'Cache-Control': 's-maxage=300' } })
}
