/**
 * Test with specific market ID from URL
 */

async function testMarketId() {
  console.log('🎯 Testing Specific Market ID\n');
  console.log('=' .repeat(80));

  const baseUrl = 'https://gamma-api.polymarket.com';

  // Market ID from the URL you provided
  const marketId = '995308';

  try {
    console.log(`\n1️⃣  Fetching market by ID: ${marketId}...\n`);

    // Try different endpoints
    const endpoints = [
      `/markets/${marketId}`,
      `/market/${marketId}`,
      `/markets?id=${marketId}`,
    ];

    for (const endpoint of endpoints) {
      console.log(`   Testing: ${baseUrl}${endpoint}`);

      try {
        const response = await fetch(`${baseUrl}${endpoint}`);
        console.log(`   Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
          const data = await response.json();
          console.log('\n   ✅ SUCCESS! Found market:');
          console.log(JSON.stringify(data, null, 2));
          console.log('\n');

          // Extract useful info
          if (Array.isArray(data) && data.length > 0) {
            const market = data[0];
            console.log('   📊 Market Summary:');
            console.log(`   Question: ${market.question || 'N/A'}`);
            console.log(`   ID: ${market.id || 'N/A'}`);
            console.log(`   Active: ${market.active !== undefined ? market.active : 'N/A'}`);
            console.log(`   Closed: ${market.closed !== undefined ? market.closed : 'N/A'}`);
          } else if (typeof data === 'object' && data !== null) {
            const market = data as any;
            console.log('   📊 Market Summary:');
            console.log(`   Question: ${market.question || 'N/A'}`);
            console.log(`   ID: ${market.id || 'N/A'}`);
            console.log(`   Active: ${market.active !== undefined ? market.active : 'N/A'}`);
            console.log(`   Closed: ${market.closed !== undefined ? market.closed : 'N/A'}`);
          }

          break;
        }
      } catch (err) {
        console.log(`   Error: ${err instanceof Error ? err.message : String(err)}`);
      }
      console.log('');
    }

    // Test market-clarifications endpoint
    console.log('=' .repeat(80));
    console.log(`\n2️⃣  Testing market-clarifications endpoint...\n`);

    const clarResponse = await fetch(`${baseUrl}/market-clarifications?market_id=${marketId}`);
    console.log(`   Status: ${clarResponse.status}`);

    if (clarResponse.ok) {
      const clarData = await clarResponse.json();
      console.log('   Data:', JSON.stringify(clarData, null, 2));
    }

    // Search in all markets for this ID
    console.log('\n' + '=' .repeat(80));
    console.log(`\n3️⃣  Searching for market ${marketId} in markets list...\n`);

    const marketsResponse = await fetch(`${baseUrl}/markets?limit=2000`);

    if (marketsResponse.ok) {
      const markets = await marketsResponse.json() as any[];
      console.log(`   Total markets: ${markets.length}`);

      const foundMarket = markets.find((m: any) => String(m.id) === marketId);

      if (foundMarket) {
        console.log('\n   ✅ Found the market in list!');
        console.log(JSON.stringify(foundMarket, null, 2));
      } else {
        console.log('\n   ⚠️  Market not found in the list');
        console.log('   This market might be closed, archived, or require different filters');
      }

      // Also look for any CS2 markets while we're here
      const cs2Markets = markets.filter((m: any) =>
        JSON.stringify(m).toLowerCase().includes('cs2') ||
        JSON.stringify(m).toLowerCase().includes('counter-strike')
      );

      if (cs2Markets.length > 0) {
        console.log(`\n   🎮 Found ${cs2Markets.length} CS2-related markets:`);

        cs2Markets.slice(0, 5).forEach((m: any, i: number) => {
          console.log(`\n   ${i + 1}. ${m.question || 'N/A'}`);
          console.log(`      ID: ${m.id || 'N/A'}`);
          console.log(`      URL: https://polymarket.com/event/${m.slug || m.market_slug || 'unknown'}`);
        });
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
  }
}

testMarketId();
