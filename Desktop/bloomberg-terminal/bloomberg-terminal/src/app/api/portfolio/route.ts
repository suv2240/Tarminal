import { NextRequest, NextResponse } from 'next/server'
import { getPortfolio, addHolding, deleteHolding, updateHolding } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
  const holdings = await getPortfolio(userId)
  return NextResponse.json({ holdings })
}

export async function POST(req: NextRequest) {
  const { userId, holding } = await req.json()
  if (!userId || !holding) return NextResponse.json({ error: 'userId and holding required' }, { status: 400 })
  const result = await addHolding(userId, holding)
  if (!result) return NextResponse.json({ error: 'Failed to add holding' }, { status: 500 })
  return NextResponse.json({ holding: result })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const success = await deleteHolding(id)
  return NextResponse.json({ success })
}

export async function PATCH(req: NextRequest) {
  const { id, updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const success = await updateHolding(id, updates)
  return NextResponse.json({ success })
}
