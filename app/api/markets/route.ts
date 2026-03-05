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

// Translate text using Google Translate API
async function translateToKorean(text: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();

    // Extract translated text from response
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }
    return text; // Return original if translation fails
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

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
    let filteredMarkets = allMarkets
      .filter((market) => {
        const vol24hr = parseFloat(market.volume24hr || '0');
        return vol24hr > 100; // Only markets with >$100 24h volume
      })
      .sort((a, b) => {
        const volA = parseFloat(a.volume24hr || '0');
        const volB = parseFloat(b.volume24hr || '0');
        return volB - volA;
      })
      .slice(0, 50); // Get top 50 for filtering

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMarkets = filteredMarkets.filter(market =>
        market.question.toLowerCase().includes(searchLower)
      );
    }

    // Limit to 30 markets
    filteredMarkets = filteredMarkets.slice(0, 30);

    // Translate questions to Korean
    const activeMarkets = await Promise.all(
      filteredMarkets.map(async (market) => {
        const slug = market.slug || market.market_slug;
        const questionKo = await translateToKorean(market.question);

        return {
          id: market.id,
          question: market.question,
          question_ko: questionKo,
          volume: market.volume,
          liquidity: market.liquidity,
          volume24hr: market.volume24hr,
          end_date_iso: market.endDate || market.end_date_iso,
          market_slug: slug,
          outcomes: market.outcomes,
        };
      })
    );

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
