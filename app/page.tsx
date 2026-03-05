'use client';

import { useEffect, useState } from 'react';
import MarketCard from '@/components/MarketCard';
import Header from '@/components/Header';
import Stats from '@/components/Stats';

interface Market {
  id: string;
  question: string;
  volume: number;
  liquidity: number;
  volume24hr: number;
  end_date_iso: string;
  outcomes?: string[];
  market_slug: string;
}

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMarkets();
    // 5분마다 업데이트
    const interval = setInterval(fetchMarkets, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarkets = async () => {
    try {
      const res = await fetch('/api/markets');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setMarkets(data.markets || []);
      setError('');
    } catch (err) {
      setError('Failed to load markets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalVolume = markets.reduce((sum, m) => sum + (parseFloat(m.volume as any) || 0), 0);
  const totalVolume24h = markets.reduce((sum, m) => sum + (parseFloat(m.volume24hr as any) || 0), 0);

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Stats
          totalMarkets={markets.length}
          totalVolume={totalVolume}
          volume24h={totalVolume24h}
        />

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading markets...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && markets.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No markets found
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Data from Polymarket • Updates every 5 minutes</p>
          <p className="mt-2">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </main>
  );
}
