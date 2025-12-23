/**
 * CS2 Markets Finder - Using Different API Filters
 */

async function tryDifferentFilters() {
  console.log('🔍 CS2 Markets Finder - Testing Different Filters\n');
  console.log('=' .repeat(80));

  const baseUrl = 'https://gamma-api.polymarket.com';

  // Test different filter combinations
  const filterSets = [
    { name: 'Active only', params: 'closed=false&limit=1000' },
    { name: 'Not archived', params: 'archived=false&limit=1000' },
    { name: 'Active + Not archived', params: 'closed=false&archived=false&limit=1000' },
    { name: 'Active + Has liquidity', params: 'closed=false&limit=1000' },
    { name: 'Recent (sorted)', params: 'limit=1000&order=desc' },
  ];

  for (const filterSet of filterSets) {
    console.log(`\n${filterSet.name}:`);
    console.log(`   URL: ${baseUrl}/markets?${filterSet.params}`);

    try {
      const response = await fetch(`${baseUrl}/markets?${filterSet.params}`);

      if (response.ok) {
        const markets = await response.json() as any[];
        console.log(`   Total markets: ${markets.length}`);

        const cs2Markets = markets.filter((m: any) =>
          m.question?.toLowerCase().includes('counter-strike') ||
          m.question?.toLowerCase().includes('cs2') ||
          m.slug?.includes('cs2-')
        );

        console.log(`   CS2 markets: ${cs2Markets.length}`);

        if (cs2Markets.length > 0) {
          console.log(`   ✅ FOUND CS2 MARKETS!\n`);

          cs2Markets.forEach((m: any, i: number) => {
            console.log(`   ${i + 1}. ${m.question}`);
            console.log(`      ID: ${m.id}`);
            console.log(`      Slug: ${m.slug}`);
            console.log(`      Active: ${m.active}, Closed: ${m.closed}`);
            console.log('');
          });

          break; // Found them, no need to continue
        }
      } else {
        console.log(`   Error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.log(`   Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Also try direct market ID approach (we know market 995308 exists)
  console.log('\n' + '=' .repeat(80));
  console.log('\n🎯 Direct Market Access Test:\n');

  const knownCS2MarketId = '995308';
  console.log(`   Fetching market ID ${knownCS2MarketId} directly...`);

  try {
    const response = await fetch(`${baseUrl}/markets/${knownCS2MarketId}`);

    if (response.ok) {
      const market = await response.json() as any;
      console.log(`   ✅ SUCCESS!\n`);
      console.log(`   Question: ${market.question}`);
      console.log(`   Slug: ${market.slug}`);
      console.log(`   Outcomes: ${market.outcomes}`);
      console.log(`   Prices: ${market.outcomePrices}`);
      console.log(`   Best Bid: ${market.bestBid}`);
      console.log(`   Best Ask: ${market.bestAsk}`);
      console.log(`   Volume 24h: $${market.volume24hr}`);
      console.log(`   Game Start: ${market.gameStartTime || market.eventStartTime}`);

      // Fetch order book
      const tokenIds = typeof market.clobTokenIds === 'string'
        ? JSON.parse(market.clobTokenIds)
        : market.clobTokenIds || [];

      if (tokenIds.length > 0) {
        console.log(`\n   📖 Fetching order book for first outcome...`);

        const obResponse = await fetch(`https://clob.polymarket.com/book?token_id=${tokenIds[0]}`);

        if (obResponse.ok) {
          const orderBook = await obResponse.json() as any;
          console.log(`\n   Order Book:`);
          console.log(`   Bids: ${orderBook.bids?.length || 0}`);
          if (orderBook.bids && orderBook.bids.length > 0) {
            console.log(`      Best: ${orderBook.bids[0].price} (size: ${orderBook.bids[0].size})`);
          }
          console.log(`   Asks: ${orderBook.asks?.length || 0}`);
          if (orderBook.asks && orderBook.asks.length > 0) {
            console.log(`      Best: ${orderBook.asks[0].price} (size: ${orderBook.asks[0].size})`);
          }
        }
      }

      console.log(`\n   💡 This market exists and can be accessed directly!`);
      console.log(`   💡 Other CS2 markets likely exist but need different search method\n`);
    } else {
      console.log(`   Error: ${response.status}`);
    }
  } catch (err) {
    console.log(`   Error: ${err}`);
  }
}

tryDifferentFilters();
