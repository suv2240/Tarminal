import type { StockQuote, AIStockSummary, AIEarningsSummary } from '@/types'

const OPENAI_BASE = 'https://api.openai.com/v1'

async function callOpenAI(messages: Array<{ role: string; content: string }>, maxTokens = 500): Promise<string> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY not configured')

  const res = await fetch(`${OPENAI_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: maxTokens,
      temperature: 0.4,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`OpenAI error ${res.status}: ${JSON.stringify(err)}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

// ─── Stock Summary ──────────────────────────────────────────────────────────

export async function generateStockSummary(
  stock: StockQuote,
  recentNewsSnippet?: string
): Promise<AIStockSummary> {
  const prompt = `You are a financial analyst assistant for Indian retail investors.

Stock data for ${stock.company} (${stock.symbol}):
- Current Price: ₹${stock.price.toFixed(2)}
- Day Change: ${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%
- 52-Week High: ₹${stock.high52w.toFixed(2)}
- 52-Week Low: ₹${stock.low52w.toFixed(2)}
- Volume: ${(stock.volume / 100000).toFixed(1)} Lakh shares
- P/E Ratio: ${stock.pe}
- ROE: ${stock.roe}%
- Sector: ${stock.sector}
${recentNewsSnippet ? `Recent News: ${recentNewsSnippet}` : ''}

Respond ONLY with valid JSON in this exact format, no other text:
{
  "trend": "bullish" | "bearish" | "neutral",
  "support": <number>,
  "resistance": <number>,
  "riskLevel": "low" | "medium" | "high",
  "summary": "<2-3 sentence summary for retail investor>"
}`

  try {
    const response = await callOpenAI([
      { role: 'system', content: 'You are a concise financial analyst. Respond only with the requested JSON.' },
      { role: 'user', content: prompt },
    ])

    const parsed = JSON.parse(response.replace(/```json|```/g, '').trim())
    return {
      symbol: stock.symbol,
      trend: parsed.trend || 'neutral',
      support: Number(parsed.support) || stock.low52w,
      resistance: Number(parsed.resistance) || stock.high52w,
      riskLevel: parsed.riskLevel || 'medium',
      summary: parsed.summary || 'Analysis not available.',
      generatedAt: new Date().toISOString(),
    }
  } catch (err) {
    console.error('[LLM] Stock summary failed:', err)
    // Fallback deterministic summary
    const trend = stock.changePercent > 1 ? 'bullish' : stock.changePercent < -1 ? 'bearish' : 'neutral'
    const priceRange = stock.high52w - stock.low52w
    return {
      symbol: stock.symbol,
      trend,
      support: Math.round(stock.price - priceRange * 0.1),
      resistance: Math.round(stock.price + priceRange * 0.1),
      riskLevel: stock.pe > 40 ? 'high' : stock.pe > 20 ? 'medium' : 'low',
      summary: `${stock.company} is trading at ₹${stock.price.toFixed(0)}, ${Math.abs(stock.changePercent).toFixed(1)}% ${stock.changePercent >= 0 ? 'up' : 'down'} today. The stock trades at a P/E of ${stock.pe} in the ${stock.sector} sector.`,
      generatedAt: new Date().toISOString(),
    }
  }
}

// ─── Earnings Summary ────────────────────────────────────────────────────────

export async function generateEarningsSummary(
  symbol: string,
  company: string,
  quarter: string,
  earningsData: {
    revenue?: number
    pat?: number
    revenueGrowth?: number
    patGrowth?: number
    eps?: number
    commentary?: string
  }
): Promise<AIEarningsSummary> {
  const prompt = `Summarize these earnings results for Indian retail investors:

Company: ${company} (${symbol})
Quarter: ${quarter}
${earningsData.revenue ? `Revenue: ₹${earningsData.revenue} Cr` : ''}
${earningsData.pat ? `PAT (Net Profit): ₹${earningsData.pat} Cr` : ''}
${earningsData.revenueGrowth ? `Revenue Growth YoY: ${earningsData.revenueGrowth}%` : ''}
${earningsData.patGrowth ? `PAT Growth YoY: ${earningsData.patGrowth}%` : ''}
${earningsData.eps ? `EPS: ₹${earningsData.eps}` : ''}
${earningsData.commentary ? `Management Commentary: ${earningsData.commentary}` : ''}

Respond ONLY with valid JSON:
{
  "sentiment": "positive" | "negative" | "mixed",
  "bulletPoints": ["<point 1>", "<point 2>", "<point 3>", "<point 4>"]
}`

  try {
    const response = await callOpenAI([
      { role: 'system', content: 'You are a concise equity research analyst. Return only JSON.' },
      { role: 'user', content: prompt },
    ])
    const parsed = JSON.parse(response.replace(/```json|```/g, '').trim())
    return {
      symbol,
      quarter,
      bulletPoints: parsed.bulletPoints || [],
      sentiment: parsed.sentiment || 'mixed',
      generatedAt: new Date().toISOString(),
    }
  } catch (err) {
    console.error('[LLM] Earnings summary failed:', err)
    return {
      symbol,
      quarter,
      bulletPoints: ['Results data available. AI summary temporarily unavailable.'],
      sentiment: 'mixed',
      generatedAt: new Date().toISOString(),
    }
  }
}

// ─── News Digest ─────────────────────────────────────────────────────────────

export async function generateNewsDigest(headlines: string[]): Promise<string> {
  if (headlines.length === 0) return 'No news available for digest.'
  
  const prompt = `Summarize these Indian financial market news headlines into a 3-sentence market digest for a retail investor:

${headlines.slice(0, 8).map((h, i) => `${i + 1}. ${h}`).join('\n')}

Write in clear, simple language. Focus on market-moving implications.`

  try {
    return await callOpenAI([
      { role: 'system', content: 'You are a concise market analyst writing for retail investors.' },
      { role: 'user', content: prompt },
    ], 200)
  } catch {
    return 'Market digest temporarily unavailable. Check individual news items for latest updates.'
  }
}
