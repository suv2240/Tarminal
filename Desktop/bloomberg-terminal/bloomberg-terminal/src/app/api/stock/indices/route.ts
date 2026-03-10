import { NextResponse } from 'next/server'
import { fetchIndices } from '@/lib/nseApiClient'

export async function GET() {
  const indices = await fetchIndices()
  return NextResponse.json({ indices }, {
    headers: { 'Cache-Control': 'no-store, max-age=0' }
  })
}
