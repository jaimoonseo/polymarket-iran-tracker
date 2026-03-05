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

    // Fetch Iran-tagged markets from Polymarket using events/pagination endpoint
    const response = await fetch(
      'https://gamma-api.polymarket.com/events/pagination?limit=50&active=true&archived=false&tag_slug=iran&closed=false&order=volume24hr&ascending=false&offset=0',
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

    const responseData: any = await response.json();
    const events = responseData.data || responseData || [];

    // Extract markets from events - each event can have multiple markets
    let allMarkets: any[] = [];
    for (const event of events) {
      if (event.markets && Array.isArray(event.markets)) {
        // Event has multiple markets
        for (const market of event.markets) {
          allMarkets.push({
            id: market.id || event.id,
            question: market.question || event.title || event.description,
            volume: market.volume || '0',
            liquidity: market.liquidity || '0',
            volume24hr: market.volume24hr || '0',
            endDate: market.endDate || event.endDate,
            market_slug: market.slug || market.marketSlug || event.slug,
            outcomes: market.outcomes,
            outcomePrices: market.outcomePrices,
            groupItemTitle: market.groupItemTitle,
          });
        }
      } else {
        // Single market event
        allMarkets.push({
          id: event.id,
          question: event.title || event.description,
          volume: event.volume || '0',
          liquidity: event.liquidity || '0',
          volume24hr: event.volume24hr || '0',
          endDate: event.endDate,
          market_slug: event.slug,
          outcomes: event.outcomes,
          outcomePrices: event.outcomePrices,
          groupItemTitle: event.groupItemTitle,
        });
      }
    }

    // Apply search filter if provided
    let filteredMarkets = allMarkets;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMarkets = allMarkets.filter(market =>
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
          outcomePrices: market.outcomePrices,
          groupItemTitle: market.groupItemTitle,
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
