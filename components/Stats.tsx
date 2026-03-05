'use client';

import { useEffect, useState } from 'react';

interface StatsProps {
  totalMarkets: number;
  totalVolume: number;
  volume24h: number;
}

export default function Stats({ totalMarkets, totalVolume, volume24h }: StatsProps) {
  const [displayMarkets, setDisplayMarkets] = useState(0);
  const [displayVolume, setDisplayVolume] = useState(0);
  const [displayVolume24h, setDisplayVolume24h] = useState(0);

  useEffect(() => {
    // Animate number counting
    const duration = 1000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setDisplayMarkets(Math.floor(totalMarkets * progress));
      setDisplayVolume(totalVolume * progress);
      setDisplayVolume24h(volume24h * progress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayMarkets(totalMarkets);
        setDisplayVolume(totalVolume);
        setDisplayVolume24h(volume24h);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [totalMarkets, totalVolume, volume24h]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="group relative bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-500" />
        <div className="relative z-10">
          <div className="text-blue-100 text-sm font-medium mb-2 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            활성 마켓
          </div>
          <div className="text-white text-4xl font-bold tabular-nums">
            {displayMarkets}
          </div>
          <div className="mt-2 h-1 bg-blue-400/30 rounded-full overflow-hidden">
            <div className="h-full bg-blue-300 rounded-full animate-pulse" style={{ width: '70%' }} />
          </div>
        </div>
      </div>

      <div className="group relative bg-gradient-to-br from-green-600 via-green-600 to-green-700 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-500" />
        <div className="relative z-10">
          <div className="text-green-100 text-sm font-medium mb-2 flex items-center gap-2">
            <span className="text-2xl">💎</span>
            총 거래량
          </div>
          <div className="text-white text-4xl font-bold tabular-nums">
            {formatCurrency(displayVolume)}
          </div>
          <div className="mt-2 h-1 bg-green-400/30 rounded-full overflow-hidden">
            <div className="h-full bg-green-300 rounded-full animate-pulse" style={{ width: '85%' }} />
          </div>
        </div>
      </div>

      <div className="group relative bg-gradient-to-br from-purple-600 via-purple-600 to-purple-700 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-500" />
        <div className="absolute top-4 right-4">
          <span className="inline-block w-3 h-3 bg-white rounded-full animate-ping" />
        </div>
        <div className="relative z-10">
          <div className="text-purple-100 text-sm font-medium mb-2 flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            24시간 거래량
          </div>
          <div className="text-white text-4xl font-bold tabular-nums">
            {formatCurrency(displayVolume24h)}
          </div>
          <div className="mt-2 h-1 bg-purple-400/30 rounded-full overflow-hidden">
            <div className="h-full bg-purple-300 rounded-full animate-pulse" style={{ width: '92%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
