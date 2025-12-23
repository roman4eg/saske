/**
 * CS2 Sports Markets Finder - Using Sports-Specific Endpoints
 */

async function findCS2ThroughSports() {
  console.log('⚽ CS2 Sports Markets Finder\n');
  console.log('=' .repeat(80));

  const baseUrl = 'https://gamma-api.polymarket.com';

  try {
    // Try sports-specific endpoints
    const sportsEndpoints = [
      '/sports',
      '/sports/markets',
      '/markets?category=esports',
      '/markets?category=counter-strike',
      '/markets?sportsMarketType=moneyline',
      '/sampling-simplified-markets',
      '/sampling-markets',
    ];

    console.log('\n1️⃣  Testing sports-specific endpoints...\n');

    for (const endpoint of sportsEndpoints) {
      console.log(`\n   Testing: ${endpoint}`);
      console.log(`   URL: ${baseUrl}${endpoint}`);

      try {
        const response = await fetch(`${baseUrl}${endpoint}`);
        console.log(`   Status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data)) {
            console.log(`   Response: Array with ${data.length} items`);

            // Check if any items are CS2 related
            const cs2Items = data.filter((item: any) =>
              JSON.stringify(item).toLowerCase().includes('counter-strike') ||
              JSON.stringify(item).toLowerCase().includes('cs2')
            );

            if (cs2Items.length > 0) {
              console.log(`   🎮 FOUND ${cs2Items.length} CS2-related items!`);
              console.log(JSON.stringify(cs2Items[0], null, 2));
            }
          } else if (typeof data === 'object' && data !== null) {
            console.log(`   Response: Object with keys: ${Object.keys(data).join(', ')}`);

            // Check if object contains CS2 data
            const dataStr = JSON.stringify(data).toLowerCase();
            if (dataStr.includes('counter-strike') || dataStr.includes('cs2')) {
              console.log(`   🎮 FOUND CS2 data in response!`);
              console.log(JSON.stringify(data, null, 2));
            }
          }
        }
      } catch (err) {
        console.log(`   Error: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Try with restricted filter
    console.log('\n\n' + '=' .repeat(80));
    console.log('\n2️⃣  Testing with restricted parameter...\n');

    const restrictedTests = [
      'restricted=true',
      'restricted=false',
      'enableOrderBook=true',
      'gameId=1278650', // From market 995308
    ];

    for (const param of restrictedTests) {
      console.log(`\n   Testing: ${baseUrl}/markets?${param}&limit=100`);

      try {
        const response = await fetch(`${baseUrl}/markets?${param}&limit=100`);
        console.log(`   Status: ${response.status}`);

        if (response.ok) {
          const markets = await response.json() as any[];
          console.log(`   Markets: ${markets.length}`);

          const cs2Markets = markets.filter((m: any) =>
            m.question?.toLowerCase().includes('counter-strike') ||
            m.slug?.includes('cs2-')
          );

          if (cs2Markets.length > 0) {
            console.log(`   🎮 FOUND ${cs2Markets.length} CS2 markets!`);
            cs2Markets.forEach((m: any) => {
              console.log(`      - ${m.question} (ID: ${m.id})`);
            });
          }
        }
      } catch (err) {
        console.log(`   Error: ${err}`);
      }
    }

    // Alternative: Scrape from Polymarket website structure
    console.log('\n\n' + '=' .repeat(80));
    console.log('\n3️⃣  Checking Polymarket public pages...\n');

    const publicPages = [
      'https://polymarket.com/sports/counter-strike',
      'https://polymarket.com/sports/esports',
      'https://polymarket.com/sports/cs2',
    ];

    console.log('   💡 CS2 markets are likely available at:');
    publicPages.forEach(url => {
      console.log(`      - ${url}`);
    });

    console.log('\n   📝 These pages might have JSON data we can parse');
    console.log('   📝 Or we can build a list of known CS2 market IDs');

    // Solution: Direct market ID list
    console.log('\n\n' + '=' .repeat(80));
    console.log('\n4️⃣  WORKING SOLUTION: Direct Market ID Access\n');

    console.log('   Since CS2 markets are restricted from general queries,');
    console.log('   we can:');
    console.log('   ');
    console.log('   ✅ Option A: Maintain a list of known CS2 market IDs');
    console.log('   ✅ Option B: Fetch from Polymarket\'s public sports pages');
    console.log('   ✅ Option C: Use their undocumented sports API');
    console.log('');
    console.log('   For now, let\'s create a parser that works with known market IDs...\n');

    // Demonstrate working with known market
    const knownMarketIds = ['995308']; // We can add more as we find them

    console.log('   📊 Fetching known CS2 markets:\n');

    for (const marketId of knownMarketIds) {
      const response = await fetch(`${baseUrl}/markets/${marketId}`);
      if (response.ok) {
        const market = await response.json() as any;

        console.log(`   Market ${marketId}:`);
        console.log(`      ${market.question}`);
        console.log(`      Outcomes: ${market.outcomes}`);
        console.log(`      Prices: ${market.outcomePrices}`);
        console.log(`      URL: https://polymarket.com/event/${market.slug}`);
        console.log('');
      }
    }

    console.log('=' .repeat(80));
    console.log('\n💡 RECOMMENDATION:\n');
    console.log('   Create a scraper for https://polymarket.com/sports/counter-strike');
    console.log('   Or use their internal API that the website uses');
    console.log('   Market IDs can be extracted from page source or network requests\n');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

findCS2ThroughSports();
