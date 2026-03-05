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
}

export default function MarketCard({ market }: MarketCardProps) {
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

  const polymarketUrl = `https://polymarket.com/event/${market.market_slug}`;

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors border border-gray-700">
      <a
        href={polymarketUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <h3 className="text-lg font-semibold text-white mb-4 line-clamp-3 hover:text-blue-400">
          {market.question}
        </h3>
      </a>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Total Volume</span>
          <span className="text-white font-medium">
            {formatCurrency(parseFloat(market.volume as any) || 0)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">24h Volume</span>
          <span className="text-green-400 font-medium">
            {formatCurrency(parseFloat(market.volume24hr as any) || 0)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Liquidity</span>
          <span className="text-blue-400 font-medium">
            {formatCurrency(parseFloat(market.liquidity as any) || 0)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-700">
          <span className="text-gray-400 text-sm">End Date</span>
          <span className="text-gray-300 text-sm">
            {formatDate(market.end_date_iso)}
          </span>
        </div>
      </div>

      <a
        href={polymarketUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-md transition-colors"
      >
        View on Polymarket →
      </a>
    </div>
  );
}
