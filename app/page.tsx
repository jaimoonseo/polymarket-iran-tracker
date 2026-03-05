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
          <div className="text-center py-20">
            <div className="relative inline-flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 absolute" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="mt-6 text-gray-400 text-lg font-medium animate-pulse">Loading markets...</p>
            <div className="flex justify-center gap-2 mt-4">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
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
          {markets.map((market, index) => (
            <MarketCard key={market.id} market={market} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full border border-gray-700">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-gray-400 text-sm">Data from Polymarket • Updates every 5 minutes</span>
          </div>
          <p className="text-gray-500 text-sm">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </main>
  );
}
