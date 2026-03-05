# 🇮🇷 Polymarket Iran Tracker

Real-time web dashboard tracking Iran-related prediction markets from Polymarket.

## 📊 Features

- **Real-time Market Data**: Fetches Iran-related prediction markets from Polymarket API
- **Auto-refresh**: Updates every 5 minutes automatically
- **Live Statistics**: Total markets, total volume, 24h volume
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Easy on the eyes

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Deployment**: Vercel
- **API**: Polymarket Gamma API

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/polymarket-iran-tracker.git
cd polymarket-iran-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🗄️ Supabase Setup

Create a `markets` table in your Supabase database:

```sql
CREATE TABLE markets (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  volume NUMERIC,
  liquidity NUMERIC,
  volume24hr NUMERIC,
  end_date_iso TIMESTAMP,
  market_slug TEXT,
  outcomes JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON markets
  FOR SELECT
  USING (true);

-- Create policy to allow service role to insert/update
CREATE POLICY "Allow service role to insert" ON markets
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow service role to update" ON markets
  FOR UPDATE
  USING (true);
```

## 🌐 Deployment on Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## 📝 Project Structure

```
polymarket-iran-tracker/
├── app/
│   ├── api/
│   │   └── markets/
│   │       └── route.ts       # API endpoint to fetch Polymarket data
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main page
│   └── globals.css            # Global styles
├── components/
│   ├── Header.tsx             # App header
│   ├── MarketCard.tsx         # Market card component
│   └── Stats.tsx              # Statistics display
├── lib/
│   └── supabase.ts            # Supabase client & helpers
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🔍 API Endpoints

### GET /api/markets

Fetches Iran-related markets from Polymarket.

**Response:**
```json
{
  "markets": [
    {
      "id": "...",
      "question": "...",
      "volume": "...",
      "volume24hr": "...",
      "liquidity": "...",
      "end_date_iso": "...",
      "market_slug": "..."
    }
  ],
  "count": 20,
  "updated_at": "2026-03-05T..."
}
```

## 📊 Data Sources

- **Polymarket Gamma API**: https://gamma-api.polymarket.com
- Markets are filtered by Iran-related keywords: iran, iranian, tehran, hormuz, strait, persian gulf, irgc, khamenei, nuclear deal

## ⚠️ Disclaimer

This app is for educational and informational purposes only. Prediction market data is provided by Polymarket and may not reflect actual events or outcomes.

## 📄 License

MIT

## 🙏 Credits

- Data from [Polymarket](https://polymarket.com)
- Built with [Next.js](https://nextjs.org)
- Deployed on [Vercel](https://vercel.com)
- Database by [Supabase](https://supabase.com)
