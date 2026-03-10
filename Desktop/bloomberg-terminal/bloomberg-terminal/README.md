# BharatTerminal 🇮🇳

**Bloomberg-style market intelligence terminal for Indian retail investors.**

Real-time NSE/BSE data · AI-powered stock analysis · Global events world map · Portfolio tracker · Smart price alerts

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 📊 **Live Dashboard** | Sensex, Nifty, BankNifty indices with 3-second polling. Top gainers/losers/volume. |
| 📈 **Advanced Charts** | TradingView widget with RSI, MACD, Bollinger Bands, Moving Averages |
| 💼 **Portfolio Tracker** | Add holdings, track P&L, day change. Persisted via Supabase + Zustand |
| 🔍 **Fundamental Screener** | Filter by P/E, Market Cap, Sector, Dividend Yield, ROE |
| 🤖 **AI Stock Summaries** | GPT-powered trend analysis: bullish/bearish, support/resistance, risk level |
| 🗓 **Economic Calendar** | RBI policy, GDP, CPI, IPO dates with impact indicators |
| 🏛 **Govt Policy Tracker** | PLI, GST, tax reform impact on individual stocks |
| 🌍 **World Events Map** | Geopolitical, central bank, commodity events mapped globally |
| 🔔 **Price Alerts** | Set price-above/below alerts per stock |
| 📰 **News Feed** | Marketaux + Finnhub filtered by category (stocks, commodities, geopolitical) |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd bloomberg-india-terminal
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
# NSE/BSE API (no key required)
NSE_API_BASE_URL=http://nse-api-khaki.vercel.app:5000

# News APIs
MARKETAUX_API_KEY=your_key_here
FINNHUB_API_KEY=your_key_here

# OpenAI (for AI summaries)
OPENAI_API_KEY=your_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### 3. Set Up Supabase

In your Supabase project's SQL editor, run:

```sql
CREATE TABLE portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  company TEXT,
  quantity DECIMAL NOT NULL,
  buy_price DECIMAL NOT NULL,
  sector TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  company TEXT,
  condition TEXT NOT NULL,
  target_value DECIMAL NOT NULL,
  triggered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  triggered_at TIMESTAMPTZ
);

CREATE TABLE watchlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) and add all `.env` variables in **Settings → Environment Variables**.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── charts/page.tsx       # TradingView charts + AI summary
│   ├── portfolio/page.tsx    # Portfolio tracker
│   ├── screener/page.tsx     # Fundamental screener
│   ├── alerts/page.tsx       # Price alerts
│   ├── map/page.tsx          # World events map
│   └── api/
│       ├── stock/            # NSE stock data endpoints
│       ├── news/             # Marketaux + Finnhub news
│       ├── ai-summary/       # OpenAI stock analysis
│       └── portfolio/        # Supabase CRUD
├── components/
│   ├── dashboard/            # MarketMovers, Watchlist, AI cards
│   ├── charts/               # TradingView wrapper
│   ├── news/                 # NewsFeed
│   ├── map/                  # World map (react-simple-maps)
│   └── shared/               # Sidebar, TopBar, MobileNav
├── lib/
│   ├── nseApiClient.ts       # NSE/BSE data fetcher
│   ├── newsApiClient.ts      # Marketaux + Finnhub
│   ├── llmClient.ts          # OpenAI GPT
│   ├── supabaseClient.ts     # DB helpers
│   ├── mockData.ts           # Fallback mock data
│   └── utils.ts              # Formatters, helpers
├── store/
│   └── zustandStore.ts       # Global state
├── hooks/
│   └── useMarketData.ts      # Polling hooks
└── types/
    └── index.ts              # TypeScript types
```

---

## 🏗 Architecture Notes

- **Mock fallback**: Every API call falls back to realistic mock data when the live API is unavailable. The app works fully offline for development.
- **Real-time simulation**: When live prices aren't available, prices simulate micro-movements via `setInterval` for a realistic feel.
- **Supabase optional**: Portfolio and alerts work locally via Zustand `persist` even without Supabase configured.
- **User identity**: A random `userId` is generated and persisted in localStorage via Zustand. No auth required for MVP.
- **TradingView**: Uses the free TradingView widget — no API key needed. Supports NSE-listed stocks out of the box.

---

## 🔑 API Reference

| API | Usage | Docs |
|-----|-------|------|
| NSE API (khaki) | Stock prices, search | `http://nse-api-khaki.vercel.app:5000` |
| Marketaux | India + global news | [marketaux.com](https://marketaux.com) |
| Finnhub | News, economic calendar | [finnhub.io](https://finnhub.io) |
| OpenAI GPT-3.5 | Stock AI summaries | [platform.openai.com](https://platform.openai.com) |
| Supabase | Portfolio persistence | [supabase.com](https://supabase.com) |
| TradingView | Charts | Free widget, no key needed |

---

## ⚠️ Disclaimer

BharatTerminal is for **informational purposes only**. AI-generated summaries and data shown do **not** constitute financial advice. Always do your own research before investing.

---

## 📄 License

MIT
