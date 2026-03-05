import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema for markets table:
// CREATE TABLE markets (
//   id TEXT PRIMARY KEY,
//   question TEXT NOT NULL,
//   volume NUMERIC,
//   liquidity NUMERIC,
//   volume24hr NUMERIC,
//   end_date_iso TIMESTAMP,
//   market_slug TEXT,
//   outcomes JSONB,
//   created_at TIMESTAMP DEFAULT NOW(),
//   updated_at TIMESTAMP DEFAULT NOW()
// );

export interface MarketRecord {
  id: string;
  question: string;
  volume: number;
  liquidity: number;
  volume24hr: number;
  end_date_iso: string;
  market_slug: string;
  outcomes?: string[];
  created_at?: string;
  updated_at?: string;
}

// Save or update market data
export async function saveMarkets(markets: MarketRecord[]) {
  const { data, error } = await supabase
    .from('markets')
    .upsert(markets, { onConflict: 'id' });

  if (error) {
    console.error('Error saving markets:', error);
    throw error;
  }

  return data;
}

// Get all markets
export async function getMarkets() {
  const { data, error } = await supabase
    .from('markets')
    .select('*')
    .order('volume24hr', { ascending: false });

  if (error) {
    console.error('Error fetching markets:', error);
    throw error;
  }

  return data;
}
