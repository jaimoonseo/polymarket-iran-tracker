'use client';

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

interface MarketCardProps {
  market: Market;
  index: number;
}

export default function MarketCard({ market, index }: MarketCardProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Use search URL as fallback since event URLs may not work
  // Encode the question for URL
  const searchQuery = encodeURIComponent(market.question.substring(0, 50));
  const polymarketUrl = `https://polymarket.com/?search=${searchQuery}`;

  // High volume indicator
  const vol24h = parseFloat(market.volume24hr as any) || 0;
  const isHighVolume = vol24h > 10000;

  return (
    <div
      className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 relative overflow-hidden"
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
      }}
    >
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500" />

      {/* High volume badge */}
      {isHighVolume && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 shadow-lg animate-pulse">
          <span className="inline-block w-2 h-2 bg-white rounded-full animate-ping" />
          HOT
        </div>
      )}

      <div className="relative z-10">
        <a
          href={polymarketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h3 className="text-lg font-semibold text-white mb-4 line-clamp-3 group-hover:text-blue-400 transition-colors duration-200">
            {market.question}
          </h3>
        </a>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <span className="text-xl">💰</span>
              Total Volume
            </span>
            <span className="text-white font-bold">
              {formatCurrency(parseFloat(market.volume as any) || 0)}
            </span>
          </div>

          <div className="flex justify-between items-center p-2 rounded-lg bg-green-900/20 hover:bg-green-900/30 transition-colors">
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <span className="text-xl">📈</span>
              24h Volume
            </span>
            <span className="text-green-400 font-bold">
              {formatCurrency(parseFloat(market.volume24hr as any) || 0)}
            </span>
          </div>

          <div className="flex justify-between items-center p-2 rounded-lg bg-blue-900/20 hover:bg-blue-900/30 transition-colors">
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <span className="text-xl">💧</span>
              Liquidity
            </span>
            <span className="text-blue-400 font-bold">
              {formatCurrency(parseFloat(market.liquidity as any) || 0)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-700">
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <span className="text-xl">⏰</span>
              End Date
            </span>
            <span className="text-gray-300 text-sm font-medium">
              {formatDate(market.end_date_iso)}
            </span>
          </div>
        </div>

        <a
          href={polymarketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-center py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-blue-500/50 transform hover:scale-[1.02]"
        >
          View on Polymarket →
        </a>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
