import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PolymarketResponse {
  id: string;
  question: string;
  volume: string;
  liquidity: string;
  volume24hr: string;
  end_date_iso: string;
  market_slug: string;
  outcomes?: string[];
}

export async function GET() {
  try {
    // Fetch top markets from Polymarket sorted by 24h volume
    const response = await fetch(
      'https://gamma-api.polymarket.com/markets?limit=50&closed=false&order=volume24hr',
      {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Polymarket');
    }

    const allMarkets: PolymarketResponse[] = await response.json();

    // Sort by 24h volume (in case API doesn't sort properly)
    const sortedMarkets = allMarkets.sort((a, b) => {
      const volA = parseFloat(a.volume24hr || '0');
      const volB = parseFloat(b.volume24hr || '0');
      return volB - volA;
    });

    // Take top 30 markets
    const topMarkets = sortedMarkets.slice(0, 30);

    return NextResponse.json({
      markets: topMarkets,
      count: topMarkets.length,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching markets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markets', markets: [] },
      { status: 500 }
    );
  }
}
