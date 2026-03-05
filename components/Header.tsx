export default function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              📊 Polymarket Tracker
            </h1>
            <p className="text-gray-400">
              Real-time tracking of top prediction markets by 24h volume
            </p>
          </div>
          <a
            href="https://polymarket.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Powered by Polymarket
          </a>
        </div>
      </div>
    </header>
  );
}
