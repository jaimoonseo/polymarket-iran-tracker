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

    const allMarkets: any[] = await response.json();

    // Filter out markets with 0 volume and sort by 24h volume
    const activeMarkets = allMarkets
      .filter((market) => {
        const vol24hr = parseFloat(market.volume24hr || '0');
        return vol24hr > 100; // Only markets with >$100 24h volume
      })
      .sort((a, b) => {
        const volA = parseFloat(a.volume24hr || '0');
        const volB = parseFloat(b.volume24hr || '0');
        return volB - volA;
      })
      .slice(0, 30)
      .map((market) => {
        const slug = market.slug || market.market_slug;
        const url = `https://polymarket.com/event/${slug}`;

        // Log for debugging
        console.log(`Market: ${market.question.substring(0, 50)}...`);
        console.log(`  Slug: ${slug}`);
        console.log(`  URL: ${url}`);

        return {
          id: market.id,
          question: market.question,
          volume: market.volume,
          liquidity: market.liquidity,
          volume24hr: market.volume24hr,
          end_date_iso: market.endDate || market.end_date_iso,
          market_slug: slug,
          outcomes: market.outcomes,
        };
      });

    return NextResponse.json({
      markets: activeMarkets,
      count: activeMarkets.length,
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
