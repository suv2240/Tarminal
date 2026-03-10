import type { StockQuote, IndexData, MarketMover, EconomicEvent, GovtPolicy, GlobalEvent, NewsArticle } from '@/types'

export const MOCK_INDICES: IndexData[] = [
  { name: 'SENSEX', symbol: 'SENSEX', value: 80234.67, change: 412.33, changePercent: 0.52 },
  { name: 'NIFTY 50', symbol: 'NIFTY', value: 24312.45, change: 123.10, changePercent: 0.51 },
  { name: 'BANK NIFTY', symbol: 'BANKNIFTY', value: 52145.80, change: -234.55, changePercent: -0.45 },
  { name: 'NIFTY IT', symbol: 'CNXIT', value: 39872.30, change: 567.20, changePercent: 1.44 },
  { name: 'NIFTY PHARMA', symbol: 'CNXPHARMA', value: 21345.60, change: -89.40, changePercent: -0.42 },
]

export const MOCK_STOCKS: StockQuote[] = [
  {
    symbol: 'RELIANCE.NS', company: 'Reliance Industries', price: 2987.45, change: 34.20, changePercent: 1.16,
    volume: 8234567, high52w: 3217.90, low52w: 2220.30, marketCap: 2023456000000,
    pe: 28.4, eps: 105.2, roe: 14.2, dividendYield: 0.31, sector: 'Energy', lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'TCS.NS', company: 'Tata Consultancy Services', price: 4123.60, change: 87.15, changePercent: 2.16,
    volume: 3456789, high52w: 4592.25, low52w: 3311.00, marketCap: 1512345000000,
    pe: 34.1, eps: 120.8, roe: 46.1, dividendYield: 1.65, sector: 'IT', lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'HDFCBANK.NS', company: 'HDFC Bank', price: 1678.30, change: -12.45, changePercent: -0.74,
    volume: 12345678, high52w: 1880.00, low52w: 1363.55, marketCap: 1278900000000,
    pe: 19.2, eps: 87.4, roe: 16.8, dividendYield: 1.12, sector: 'Banking', lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'INFY.NS', company: 'Infosys', price: 1834.75, change: 42.30, changePercent: 2.36,
    volume: 5678901, high52w: 1953.90, low52w: 1351.50, marketCap: 768900000000,
    pe: 27.3, eps: 67.2, roe: 31.4, dividendYield: 2.41, sector: 'IT', lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'ITC.NS', company: 'ITC Limited', price: 468.90, change: -3.15, changePercent: -0.67,
    volume: 23456789, high52w: 528.50, low52w: 399.35, marketCap: 584320000000,
    pe: 27.8, eps: 16.9, roe: 27.3, dividendYield: 3.62, sector: 'FMCG', lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'WIPRO.NS', company: 'Wipro Limited', price: 562.45, change: 8.70, changePercent: 1.57,
    volume: 4567890, high52w: 627.00, low52w: 406.00, marketCap: 292340000000,
    pe: 23.1, eps: 24.3, roe: 18.6, dividendYield: 0.18, sector: 'IT', lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'SBIN.NS', company: 'State Bank of India', price: 834.20, change: 15.60, changePercent: 1.91,
    volume: 18765432, high52w: 912.00, low52w: 600.65, marketCap: 744560000000,
    pe: 10.8, eps: 77.2, roe: 17.1, dividendYield: 1.56, sector: 'Banking', lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'BAJFINANCE.NS', company: 'Bajaj Finance', price: 7234.55, change: -145.30, changePercent: -1.97,
    volume: 1234567, high52w: 8192.00, low52w: 6187.80, marketCap: 436780000000,
    pe: 31.4, eps: 230.4, roe: 22.8, dividendYield: 0.28, sector: 'NBFC', lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'MARUTI.NS', company: 'Maruti Suzuki India', price: 12456.80, change: 234.50, changePercent: 1.92,
    volume: 987654, high52w: 13500.00, low52w: 9635.00, marketCap: 376540000000,
    pe: 29.6, eps: 420.7, roe: 15.4, dividendYield: 0.72, sector: 'Automobile', lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'SUNPHARMA.NS', company: 'Sun Pharmaceutical', price: 1789.30, change: -22.40, changePercent: -1.24,
    volume: 2345678, high52w: 1960.25, low52w: 1128.00, marketCap: 429120000000,
    pe: 42.3, eps: 42.3, roe: 13.6, dividendYield: 0.78, sector: 'Pharma', lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'LTIM.NS', company: 'LTIMindtree', price: 6123.40, change: 89.30, changePercent: 1.48,
    volume: 876543, high52w: 6896.00, low52w: 4587.00, marketCap: 181230000000,
    pe: 36.8, eps: 166.4, roe: 25.3, dividendYield: 0.65, sector: 'IT', lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'TATAMOTORS.NS', company: 'Tata Motors', price: 1023.45, change: -18.70, changePercent: -1.80,
    volume: 9876543, high52w: 1179.00, low52w: 648.85, marketCap: 337890000000,
    pe: 9.4, eps: 108.9, roe: 22.1, dividendYield: 0.49, sector: 'Automobile', lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'ONGC.NS', company: 'Oil & Natural Gas Corp', price: 289.45, change: 4.20, changePercent: 1.47,
    volume: 34567890, high52w: 345.00, low52w: 155.20, marketCap: 363450000000,
    pe: 8.2, eps: 35.3, roe: 14.8, dividendYield: 4.32, sector: 'Energy', lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'ASIANPAINT.NS', company: 'Asian Paints', price: 2934.60, change: 31.20, changePercent: 1.08,
    volume: 1456789, high52w: 3394.00, low52w: 2671.00, marketCap: 280980000000,
    pe: 58.4, eps: 50.3, roe: 28.7, dividendYield: 0.98, sector: 'Consumer', lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'POWERGRID.NS', company: 'Power Grid Corp', price: 334.25, change: 2.85, changePercent: 0.86,
    volume: 8765432, high52w: 366.25, low52w: 208.70, marketCap: 311230000000,
    pe: 17.8, eps: 18.8, roe: 18.9, dividendYield: 4.41, sector: 'Power', lastUpdated: new Date().toISOString(),
  },
]

export const MOCK_GAINERS: MarketMover[] = MOCK_STOCKS
  .filter(s => s.changePercent > 0)
  .sort((a, b) => b.changePercent - a.changePercent)
  .slice(0, 5)
  .map(s => ({ symbol: s.symbol, company: s.company, price: s.price, change: s.change, changePercent: s.changePercent, volume: s.volume }))

export const MOCK_LOSERS: MarketMover[] = MOCK_STOCKS
  .filter(s => s.changePercent < 0)
  .sort((a, b) => a.changePercent - b.changePercent)
  .slice(0, 5)
  .map(s => ({ symbol: s.symbol, company: s.company, price: s.price, change: s.change, changePercent: s.changePercent, volume: s.volume }))

export const MOCK_HIGH_VOLUME: MarketMover[] = [...MOCK_STOCKS]
  .sort((a, b) => b.volume - a.volume)
  .slice(0, 5)
  .map(s => ({ symbol: s.symbol, company: s.company, price: s.price, change: s.change, changePercent: s.changePercent, volume: s.volume }))

export const MOCK_ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: '1', title: 'RBI Monetary Policy Committee Meeting', date: '2024-08-08', time: '10:00',
    category: 'rbi', impact: 'high', forecast: '6.5%', previous: '6.5%',
    description: 'RBI MPC bi-monthly meeting - Interest rate decision expected',
  },
  {
    id: '2', title: 'Union Budget 2025-26 Presentation', date: '2025-02-01', time: '11:00',
    category: 'budget', impact: 'high',
    description: 'Finance Minister to present Union Budget for FY 2025-26',
  },
  {
    id: '3', title: 'GDP Q1 FY2025 Data Release', date: '2024-08-30', time: '17:30',
    category: 'gdp', impact: 'high', forecast: '7.2%', previous: '7.8%',
    description: 'First quarter GDP growth rate for FY2025',
  },
  {
    id: '4', title: 'CPI Inflation July 2024', date: '2024-08-12', time: '17:30',
    category: 'inflation', impact: 'medium', forecast: '4.1%', previous: '5.08%',
    description: 'Consumer Price Index data release for July 2024',
  },
  {
    id: '5', title: 'Bharti Hexacom IPO Listing', date: '2024-08-14',
    category: 'ipo', impact: 'medium',
    description: 'Bharti Hexacom IPO listing on BSE and NSE',
  },
  {
    id: '6', title: 'TCS Q2 FY2025 Earnings', date: '2024-10-10', time: '13:00',
    category: 'earnings', impact: 'high',
    description: 'Tata Consultancy Services Q2 FY2025 quarterly results',
  },
  {
    id: '7', title: 'WPI Inflation July 2024', date: '2024-08-14', time: '17:30',
    category: 'inflation', impact: 'low', forecast: '2.8%', previous: '3.36%',
    description: 'Wholesale Price Index data release',
  },
  {
    id: '8', title: 'IIP Data June 2024', date: '2024-08-12', time: '17:30',
    category: 'other', impact: 'medium', previous: '5.9%',
    description: 'Index of Industrial Production for June 2024',
  },
]

export const MOCK_GLOBAL_EVENTS: GlobalEvent[] = [
  {
    id: '1', country: 'United States', countryCode: 'US', lat: 38.9, lng: -77.0,
    title: 'Fed Holds Rates at 5.25-5.5%', summary: 'Federal Reserve maintains rates, signals potential cuts in late 2024',
    category: 'central-bank', impact: 'high', date: '2024-08-01',
  },
  {
    id: '2', country: 'India', countryCode: 'IN', lat: 28.6, lng: 77.2,
    title: 'RBI MPC: Repo Rate at 6.5%', summary: 'Reserve Bank of India holds repo rate, maintains withdrawal of accommodation stance',
    category: 'central-bank', impact: 'high', date: '2024-08-08',
  },
  {
    id: '3', country: 'China', countryCode: 'CN', lat: 39.9, lng: 116.4,
    title: 'China GDP Growth Slows to 4.7%', summary: 'Chinese economy grows slower than expected amid property sector woes',
    category: 'gdp', impact: 'high', date: '2024-07-15',
  },
  {
    id: '4', country: 'Russia', countryCode: 'RU', lat: 55.7, lng: 37.6,
    title: 'Russia-Ukraine Conflict: Oil Supply Risk', summary: 'Ongoing conflict creates volatility in global crude oil markets',
    category: 'geopolitical', impact: 'high', date: '2024-07-20',
  },
  {
    id: '5', country: 'Saudi Arabia', countryCode: 'SA', lat: 24.7, lng: 46.7,
    title: 'OPEC+ Extends Production Cuts', summary: 'OPEC+ alliance extends voluntary production cuts through Q3 2024',
    category: 'commodity', impact: 'high', date: '2024-07-01',
  },
  {
    id: '6', country: 'European Union', countryCode: 'EU', lat: 50.8, lng: 4.3,
    title: 'ECB Cuts Rate by 25bps', summary: 'European Central Bank cuts key rates for first time since 2019',
    category: 'central-bank', impact: 'medium', date: '2024-06-06',
  },
  {
    id: '7', country: 'Japan', countryCode: 'JP', lat: 35.7, lng: 139.7,
    title: 'BOJ Rate Hike Sparks Yen Rally', summary: 'Bank of Japan raises rates, causing significant yen appreciation and global carry trade unwind',
    category: 'central-bank', impact: 'high', date: '2024-07-31',
  },
  {
    id: '8', country: 'Australia', countryCode: 'AU', lat: -35.3, lng: 149.1,
    title: 'Iron Ore Prices Decline', summary: 'Iron ore prices fall on weak Chinese demand, impacting Australian mining stocks',
    category: 'commodity', impact: 'medium', date: '2024-08-05',
  },
  {
    id: '9', country: 'Israel', countryCode: 'IL', lat: 31.8, lng: 35.2,
    title: 'Middle East Tensions Escalate', summary: 'Ongoing conflict in Gaza threatens regional stability and oil supply routes',
    category: 'geopolitical', impact: 'high', date: '2024-08-06',
  },
  {
    id: '10', country: 'Germany', countryCode: 'DE', lat: 52.5, lng: 13.4,
    title: 'Germany GDP Contracts 0.1%', summary: 'German economy shrinks in Q2 2024 amid industrial weakness',
    category: 'gdp', impact: 'medium', date: '2024-07-25',
  },
]

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: '1', title: 'Reliance Industries Q1 PAT Jumps 18% YoY on Strong Retail, Jio Performance',
    summary: 'RIL reported consolidated PAT of ₹15,138 crore for Q1 FY25, up 18% year-on-year, beating street estimates.',
    source: 'Economic Times', url: '#', publishedAt: new Date(Date.now() - 3600000).toISOString(),
    category: 'earnings', sentiment: 'positive', relatedSymbols: ['RELIANCE.NS'],
  },
  {
    id: '2', title: 'Crude Oil Falls 3% as US Inventory Data Shows Surprise Build',
    summary: 'WTI crude dropped to $74.5 per barrel after EIA weekly inventory data showed a surprise build of 3.7 million barrels.',
    source: 'Reuters', url: '#', publishedAt: new Date(Date.now() - 7200000).toISOString(),
    category: 'trade', sentiment: 'negative', relatedSymbols: ['ONGC.NS', 'RELIANCE.NS'],
  },
  {
    id: '3', title: 'RBI Keeps Repo Rate Unchanged at 6.5%, Maintains Withdrawal Stance',
    summary: 'The Monetary Policy Committee voted 4-2 to hold rates, citing need to ensure inflation durably aligns with 4% target.',
    source: 'Mint', url: '#', publishedAt: new Date(Date.now() - 10800000).toISOString(),
    category: 'macro', sentiment: 'neutral',
  },
  {
    id: '4', title: 'TCS, Infosys Rally as US Tech Stocks Surge on AI Demand',
    summary: 'Indian IT majors gained 2-3% on the back of strong US tech earnings and increased AI-related deal flows.',
    source: 'Business Standard', url: '#', publishedAt: new Date(Date.now() - 14400000).toISOString(),
    category: 'stock', sentiment: 'positive', relatedSymbols: ['TCS.NS', 'INFY.NS', 'WIPRO.NS'],
  },
  {
    id: '5', title: 'India-China Trade Tensions: Import Duties on Chinese Goods Hiked',
    summary: 'Government raises import duties on 50+ Chinese products amid trade dispute, impacting electronics and solar panel sectors.',
    source: 'Financial Express', url: '#', publishedAt: new Date(Date.now() - 18000000).toISOString(),
    category: 'geopolitical', sentiment: 'negative',
  },
  {
    id: '6', title: 'HDFC Bank Q1 NII Grows 16%, Asset Quality Improves',
    summary: 'Net Interest Income grew 16.1% YoY to ₹29,837 crore. Gross NPA ratio improved to 1.33% from 1.36% sequentially.',
    source: 'CNBC TV18', url: '#', publishedAt: new Date(Date.now() - 21600000).toISOString(),
    category: 'earnings', sentiment: 'positive', relatedSymbols: ['HDFCBANK.NS'],
  },
  {
    id: '7', title: 'Gold Prices Near All-Time Highs; MCX Gold Crosses ₹74,000',
    summary: 'Gold reached record levels as geopolitical tensions and US dollar weakness boosted safe-haven demand.',
    source: 'Zee Business', url: '#', publishedAt: new Date(Date.now() - 25200000).toISOString(),
    category: 'trade', sentiment: 'positive',
  },
  {
    id: '8', title: 'FII Net Buyers for 5th Straight Session; Pump ₹4,200 Cr Into Equities',
    summary: 'Foreign Institutional Investors continued their buying streak, focusing on financial services and IT sectors.',
    source: 'Economic Times', url: '#', publishedAt: new Date(Date.now() - 28800000).toISOString(),
    category: 'stock', sentiment: 'positive',
  },
]

export const MOCK_GOVT_POLICIES: GovtPolicy[] = [
  {
    id: '1',
    title: 'PLI Scheme for Electronics Manufacturing',
    category: 'Manufacturing',
    date: '2024-03-15',
    description: 'Government extends Production Linked Incentive scheme with additional ₹17,000 crore allocation for electronics manufacturing.',
    impactedStocks: [
      { symbol: 'DIXON.NS', company: 'Dixon Technologies', direction: 'positive', reason: 'Major beneficiary of electronics PLI scheme' },
      { symbol: 'KAYNES.NS', company: 'Kaynes Technology', direction: 'positive', reason: 'EMS company set to benefit from PLI' },
      { symbol: 'TATAELXSI.NS', company: 'Tata Elxsi', direction: 'positive', reason: 'Tech design services for PLI products' },
    ],
  },
  {
    id: '2',
    title: 'GST Rate Rationalization 2024',
    category: 'Taxation',
    date: '2024-06-22',
    description: 'GST Council rationalizes rates; insurance premiums exempted from GST, EV components taxed lower at 5%.',
    impactedStocks: [
      { symbol: 'HDFCLIFE.NS', company: 'HDFC Life Insurance', direction: 'positive', reason: 'Insurance GST exemption boosts premiums' },
      { symbol: 'TATAMOTORS.NS', company: 'Tata Motors', direction: 'positive', reason: 'Lower EV taxes boost EV demand' },
      { symbol: 'CIGARETTES', company: 'Tobacco Sector', direction: 'negative', reason: 'Higher GST on tobacco products' },
    ],
  },
  {
    id: '3',
    title: 'RBI Interest Rate Decision - Repo at 6.5%',
    category: 'Monetary Policy',
    date: '2024-08-08',
    description: 'RBI MPC holds repo rate at 6.5% for 8th consecutive time, maintaining withdrawal of accommodation stance.',
    impactedStocks: [
      { symbol: 'HDFCBANK.NS', company: 'HDFC Bank', direction: 'positive', reason: 'Stable rates maintain NIM compression pause' },
      { symbol: 'SBIN.NS', company: 'SBI', direction: 'positive', reason: 'PSU banks benefit from rate stability' },
      { symbol: 'BAJFINANCE.NS', company: 'Bajaj Finance', direction: 'negative', reason: 'NBFC cost of funds remain elevated' },
    ],
  },
]

export const SECTORS = ['All', 'IT', 'Banking', 'NBFC', 'Energy', 'Pharma', 'FMCG', 'Automobile', 'Consumer', 'Power', 'Telecom', 'Metals']

export const WATCHLIST_SYMBOLS = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ITC.NS', 'SBIN.NS', 'BAJFINANCE.NS', 'MARUTI.NS']
