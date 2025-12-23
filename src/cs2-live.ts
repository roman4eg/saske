/**
 * CS2 Live Markets Parser - Working Version
 */

import { PolymarketAPI } from './api.js';

interface CS2MarketData {
  id: string;
  question: string;
  slug: string;
  outcomes: string[];
  outcomePrices: number[];
  bestBid: number;
  bestAsk: number;
  spread: number;
  volume24hr: number;
  liquidity: number;
  active: boolean;
  closed: boolean;
  gameStartTime: string;
  clobTokenIds: string[];
}

async function findCS2Markets() {
  console.log('🎮 CS2 Live Markets Finder\n');
  console.log('=' .repeat(80));

  const baseUrl = 'https://gamma-api.polymarket.com';

  try {
    // Try different limits to find CS2 markets
    console.log('\n1️⃣  Searching for Counter-Strike markets...\n');

    const limits = [2000, 3000, 5000];
    let allCS2Markets: any[] = [];

    for (const limit of limits) {
      console.log(`   Trying limit=${limit}...`);

      const response = await fetch(`${baseUrl}/markets?limit=${limit}`);

      if (response.ok) {
        const markets = await response.json() as any[];
        console.log(`   Fetched ${markets.length} markets total`);

        const cs2Markets = markets.filter((m: any) =>
          m.question?.toLowerCase().includes('counter-strike') ||
          m.question?.toLowerCase().includes('cs2') ||
          m.slug?.includes('cs2-') ||
          m.description?.toLowerCase().includes('counter-strike')
        );

        console.log(`   Found ${cs2Markets.length} CS2 markets\n`);

        if (cs2Markets.length > 0) {
          allCS2Markets = cs2Markets;
          break;
        }
      }
    }

    if (allCS2Markets.length === 0) {
      console.log('   ⚠️  No CS2 markets found in standard results');
      console.log('   📝 CS2 markets might be in a restricted category\n');
      return;
    }

    // Display all found CS2 markets
    console.log('=' .repeat(80));
    console.log(`\n📊 Found ${allCS2Markets.length} CS2 Markets:\n`);

    allCS2Markets.forEach((market: any, i: number) => {
      console.log(`${i + 1}. ${market.question}`);
      console.log(`   ID: ${market.id}`);
      console.log(`   Slug: ${market.slug}`);
      console.log(`   URL: https://polymarket.com/event/${market.slug}`);
      console.log(`   Active: ${market.active} | Closed: ${market.closed}`);
      console.log(`   Game Start: ${market.gameStartTime || market.startDate || 'N/A'}`);
      console.log('');
    });

    // Parse detailed data for active markets
    const activeMarkets = allCS2Markets.filter((m: any) => m.active && !m.closed);

    if (activeMarkets.length > 0) {
      console.log('=' .repeat(80));
      console.log(`\n2️⃣  Detailed Data for Active Markets (${activeMarkets.length}):\n`);

      for (const market of activeMarkets.slice(0, 5)) {
        await displayMarketDetails(market);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
  }
}

async function displayMarketDetails(market: any) {
  console.log('\n' + '='.repeat(80));
  console.log(`📈 ${market.question}`);
  console.log('='.repeat(80));

  console.log(`\n📍 Market Info:`);
  console.log(`   ID: ${market.id}`);
  console.log(`   Slug: ${market.slug}`);
  console.log(`   URL: https://polymarket.com/event/${market.slug}`);
  console.log(`   Active: ${market.active}`);
  console.log(`   Game Start: ${market.gameStartTime || market.eventStartTime || 'N/A'}`);

  // Parse outcomes
  let outcomes: string[] = [];
  try {
    outcomes = typeof market.outcomes === 'string'
      ? JSON.parse(market.outcomes)
      : market.outcomes || [];
  } catch (e) {
    outcomes = [];
  }

  // Parse prices
  let prices: number[] = [];
  try {
    const priceStrings = typeof market.outcomePrices === 'string'
      ? JSON.parse(market.outcomePrices)
      : market.outcomePrices || [];
    prices = priceStrings.map((p: string) => parseFloat(p));
  } catch (e) {
    prices = [];
  }

  console.log(`\n💰 Odds & Prices:`);
  outcomes.forEach((outcome, i) => {
    const price = prices[i] || 0;
    const probability = price * 100;
    const decimalOdds = price > 0 ? 1 / price : 0;

    console.log(`\n   ${outcome}:`);
    console.log(`      Probability: ${probability.toFixed(2)}%`);
    console.log(`      Price: ${price.toFixed(2)}`);
    console.log(`      Decimal Odds: ${decimalOdds.toFixed(2)}`);
  });

  console.log(`\n📊 Order Book:`);
  console.log(`   Best Bid: ${market.bestBid || 0}`);
  console.log(`   Best Ask: ${market.bestAsk || 0}`);
  console.log(`   Spread: ${market.spread || 0}`);

  console.log(`\n💵 Volume & Liquidity:`);
  console.log(`   24h Volume: $${(market.volume24hr || 0).toLocaleString()}`);
  console.log(`   Total Volume: $${(market.volumeNum || 0).toLocaleString()}`);
  console.log(`   Liquidity: $${(market.liquidityNum || market.liquidityClob || 0).toLocaleString()}`);

  // Token IDs for order book
  let tokenIds: string[] = [];
  try {
    tokenIds = typeof market.clobTokenIds === 'string'
      ? JSON.parse(market.clobTokenIds)
      : market.clobTokenIds || [];
  } catch (e) {
    tokenIds = [];
  }

  if (tokenIds.length > 0) {
    console.log(`\n🔑 CLOB Token IDs (for order book):`);
    tokenIds.forEach((tokenId, i) => {
      console.log(`   ${outcomes[i] || `Outcome ${i}`}: ${tokenId.substring(0, 20)}...`);
    });

    // Fetch order book for first token
    if (tokenIds[0]) {
      console.log(`\n📖 Fetching order book for ${outcomes[0]}...`);
      await fetchOrderBookForToken(tokenIds[0], outcomes[0]);
    }
  }
}

async function fetchOrderBookForToken(tokenId: string, outcome: string) {
  try {
    const response = await fetch(`https://clob.polymarket.com/book?token_id=${tokenId}`);

    if (response.ok) {
      const orderBook = await response.json() as any;

      console.log(`\n   Bids (${orderBook.bids?.length || 0}):`);
      (orderBook.bids || []).slice(0, 5).forEach((bid: any) => {
        console.log(`      Price: ${bid.price}, Size: ${bid.size}`);
      });

      console.log(`\n   Asks (${orderBook.asks?.length || 0}):`);
      (orderBook.asks || []).slice(0, 5).forEach((ask: any) => {
        console.log(`      Price: ${ask.price}, Size: ${ask.size}`);
      });
    } else {
      console.log(`   ⚠️  Order book not available (${response.status})`);
    }
  } catch (err) {
    console.log(`   ❌ Error fetching order book: ${err instanceof Error ? err.message : String(err)}`);
  }
}

findCS2Markets();
