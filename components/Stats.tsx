interface StatsProps {
  totalMarkets: number;
  totalVolume: number;
  volume24h: number;
}

export default function Stats({ totalMarkets, totalVolume, volume24h }: StatsProps) {
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
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6">
        <div className="text-blue-100 text-sm font-medium mb-2">
          Active Markets
        </div>
        <div className="text-white text-3xl font-bold">
          {totalMarkets}
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6">
        <div className="text-green-100 text-sm font-medium mb-2">
          Total Volume
        </div>
        <div className="text-white text-3xl font-bold">
          {formatCurrency(totalVolume)}
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6">
        <div className="text-purple-100 text-sm font-medium mb-2">
          24h Volume
        </div>
        <div className="text-white text-3xl font-bold">
          {formatCurrency(volume24h)}
        </div>
      </div>
    </div>
  );
}
