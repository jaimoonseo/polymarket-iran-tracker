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
    // Fetch Iran-related markets from Polymarket
    const response = await fetch(
      'https://gamma-api.polymarket.com/markets?limit=100&closed=false',
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

    // Filter for Iran-related markets
    const iranKeywords = [
      'iran', 'iranian', 'tehran', 'hormuz', 'strait',
      'persian gulf', 'irgc', 'khamenei', 'nuclear deal'
    ];

    const iranMarkets = allMarkets.filter((market) => {
      const text = `${market.question} ${market.market_slug}`.toLowerCase();
      return iranKeywords.some(keyword => text.includes(keyword));
    });

    // Sort by 24h volume
    const sortedMarkets = iranMarkets.sort((a, b) => {
      const volA = parseFloat(a.volume24hr || '0');
      const volB = parseFloat(b.volume24hr || '0');
      return volB - volA;
    });

    return NextResponse.json({
      markets: sortedMarkets,
      count: sortedMarkets.length,
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
