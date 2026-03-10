import { createClient } from '@supabase/supabase-js'
import type { Holding, PriceAlert } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── SQL Schema (run this in Supabase SQL Editor) ────────────────────────────
// 
// CREATE TABLE portfolios (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id TEXT NOT NULL,
//   symbol TEXT NOT NULL,
//   company TEXT,
//   quantity DECIMAL NOT NULL,
//   buy_price DECIMAL NOT NULL,
//   sector TEXT,
//   added_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE price_alerts (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id TEXT NOT NULL,
//   symbol TEXT NOT NULL,
//   company TEXT,
//   condition TEXT NOT NULL,
//   target_value DECIMAL NOT NULL,
//   triggered BOOLEAN DEFAULT FALSE,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   triggered_at TIMESTAMPTZ
// );
//
// CREATE TABLE watchlists (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id TEXT NOT NULL,
//   symbol TEXT NOT NULL,
//   added_at TIMESTAMPTZ DEFAULT NOW()
// );
// ────────────────────────────────────────────────────────────────────────────

// ─── Portfolio CRUD ──────────────────────────────────────────────────────────

export async function getPortfolio(userId: string): Promise<Holding[]> {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false })

  if (error) {
    console.error('[Supabase] getPortfolio error:', error)
    return []
  }

  return (data || []).map(row => ({
    id: row.id,
    userId: row.user_id,
    symbol: row.symbol,
    company: row.company,
    quantity: Number(row.quantity),
    buyPrice: Number(row.buy_price),
    sector: row.sector,
    addedAt: row.added_at,
  }))
}

export async function addHolding(userId: string, holding: Omit<Holding, 'id' | 'userId' | 'addedAt'>): Promise<Holding | null> {
  const { data, error } = await supabase
    .from('portfolios')
    .insert({
      user_id: userId,
      symbol: holding.symbol,
      company: holding.company,
      quantity: holding.quantity,
      buy_price: holding.buyPrice,
      sector: holding.sector,
    })
    .select()
    .single()

  if (error) {
    console.error('[Supabase] addHolding error:', error)
    return null
  }

  return {
    id: data.id,
    userId: data.user_id,
    symbol: data.symbol,
    company: data.company,
    quantity: Number(data.quantity),
    buyPrice: Number(data.buy_price),
    sector: data.sector,
    addedAt: data.added_at,
  }
}

export async function deleteHolding(id: string): Promise<boolean> {
  const { error } = await supabase.from('portfolios').delete().eq('id', id)
  if (error) {
    console.error('[Supabase] deleteHolding error:', error)
    return false
  }
  return true
}

export async function updateHolding(id: string, updates: Partial<Pick<Holding, 'quantity' | 'buyPrice'>>): Promise<boolean> {
  const { error } = await supabase
    .from('portfolios')
    .update({
      ...(updates.quantity && { quantity: updates.quantity }),
      ...(updates.buyPrice && { buy_price: updates.buyPrice }),
    })
    .eq('id', id)

  if (error) {
    console.error('[Supabase] updateHolding error:', error)
    return false
  }
  return true
}

// ─── Alerts CRUD ─────────────────────────────────────────────────────────────

export async function getAlerts(userId: string): Promise<PriceAlert[]> {
  const { data, error } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Supabase] getAlerts error:', error)
    return []
  }

  return (data || []).map(row => ({
    id: row.id,
    symbol: row.symbol,
    company: row.company,
    condition: row.condition,
    targetValue: Number(row.target_value),
    triggered: row.triggered,
    createdAt: row.created_at,
    triggeredAt: row.triggered_at,
  }))
}

export async function createAlert(userId: string, alert: Omit<PriceAlert, 'id' | 'triggered' | 'createdAt'>): Promise<PriceAlert | null> {
  const { data, error } = await supabase
    .from('price_alerts')
    .insert({
      user_id: userId,
      symbol: alert.symbol,
      company: alert.company,
      condition: alert.condition,
      target_value: alert.targetValue,
    })
    .select()
    .single()

  if (error) {
    console.error('[Supabase] createAlert error:', error)
    return null
  }

  return {
    id: data.id,
    symbol: data.symbol,
    company: data.company,
    condition: data.condition,
    targetValue: Number(data.target_value),
    triggered: data.triggered,
    createdAt: data.created_at,
  }
}

export async function deleteAlert(id: string): Promise<boolean> {
  const { error } = await supabase.from('price_alerts').delete().eq('id', id)
  return !error
}

// ─── Watchlist ───────────────────────────────────────────────────────────────

export async function getWatchlist(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('watchlists')
    .select('symbol')
    .eq('user_id', userId)

  if (error) return []
  return (data || []).map(row => row.symbol)
}

export async function addToWatchlist(userId: string, symbol: string): Promise<boolean> {
  const { error } = await supabase.from('watchlists').insert({ user_id: userId, symbol })
  return !error
}

export async function removeFromWatchlist(userId: string, symbol: string): Promise<boolean> {
  const { error } = await supabase.from('watchlists').delete().eq('user_id', userId).eq('symbol', symbol)
  return !error
}
