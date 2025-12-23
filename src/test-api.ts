/**
 * Simple test to verify API connectivity
 */

import { PolymarketAPI } from './api.js';

async function test() {
  console.log('🧪 Testing Polymarket API Connection\n');
  console.log('=' .repeat(60));

  const api = new PolymarketAPI();

  try {
    console.log('\n1️⃣  Fetching top 10 active events...\n');

    const events = await api.fetchEvents({ active: true, limit: 10 });

    console.log(`✅ Success! Found ${events.length} active events:\n`);

    events.forEach((event, i) => {
      console.log(`${i + 1}. ${event.title}`);
      console.log(`   📍 Slug: ${event.slug}`);
      console.log(`   📊 Markets: ${event.markets?.length || 0}`);
      console.log(`   🔴 Active: ${event.active ? 'Yes' : 'No'}`);
      console.log(`   💰 Volume: ${event.volume ? '$' + parseFloat(event.volume).toLocaleString() : 'N/A'}`);
      console.log('');
    });

    // Test searching
    console.log('=' .repeat(60));
    console.log('\n2️⃣  Testing search functionality...\n');

    const searchResults = await api.searchEvents('esports', { active: true });
    console.log(`✅ Search for "esports": Found ${searchResults.length} event(s)\n`);

    if (searchResults.length > 0) {
      searchResults.slice(0, 3).forEach((event, i) => {
        console.log(`   ${i + 1}. ${event.title}`);
      });
    }

    // Test order book (if we have events with markets)
    if (events.length > 0 && events[0].markets && events[0].markets.length > 0) {
      const market = events[0].markets[0];
      if (market.tokens && market.tokens.length > 0) {
        const tokenId = market.tokens[0].token_id;

        console.log('\n' + '=' .repeat(60));
        console.log('\n3️⃣  Testing order book fetch...\n');
        console.log(`   Token ID: ${tokenId}`);

        const orderBook = await api.fetchOrderBook(tokenId);

        if (orderBook) {
          console.log(`   ✅ Order book fetched successfully!`);
          console.log(`   📈 Bids: ${orderBook.bids.length}`);
          console.log(`   📉 Asks: ${orderBook.asks.length}`);

          if (orderBook.bids.length > 0) {
            console.log(`   💵 Best Bid: ${orderBook.bids[0].price} (Size: ${orderBook.bids[0].size})`);
          }
          if (orderBook.asks.length > 0) {
            console.log(`   💵 Best Ask: ${orderBook.asks[0].price} (Size: ${orderBook.asks[0].size})`);
          }
        } else {
          console.log(`   ⚠️  No order book available for this token`);
        }
      }
    }

    console.log('\n' + '=' .repeat(60));
    console.log('\n✅ All tests passed!\n');

  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
    process.exit(1);
  }
}

test();
