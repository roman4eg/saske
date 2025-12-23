/**
 * Debug API to understand structure better
 */

async function debugAPI() {
  console.log('🔍 Debugging Polymarket API Structure\n');
  console.log('=' .repeat(80));

  const baseUrl = 'https://gamma-api.polymarket.com';

  try {
    // Test 1: Try to get the specific event directly by constructing different slug patterns
    console.log('\n1️⃣  Testing direct event access with different slug formats...\n');

    const slugVariants = [
      'cs2-33-g1-2025-12-23',
      'cs2-33-g1',
      'cs-2-33-g1-2025-12-23'
    ];

    for (const slug of slugVariants) {
      console.log(`   Testing slug: ${slug}`);
      try {
        const response = await fetch(`${baseUrl}/events/${slug}`);
        console.log(`   Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
          const data = await response.json();
          console.log(`   ✅ SUCCESS! Found event:`, data);
          break;
        }
      } catch (err) {
        console.log(`   ❌ Error: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Test 2: Try markets endpoint instead
    console.log('\n\n2️⃣  Testing markets endpoint and structure...\n');

    try {
      const response = await fetch(`${baseUrl}/markets?limit=5`);
      console.log(`   Status: ${response.status}`);

      if (response.ok) {
        const markets = await response.json() as any[];
        console.log(`   Found ${markets.length} markets\n`);

        // Show FULL structure of first market
        if (markets.length > 0) {
          console.log('   📋 Full structure of first market:');
          console.log(JSON.stringify(markets[0], null, 2));
          console.log('\n');

          // Extract and show all available fields
          console.log('   🔑 Available fields in market object:');
          console.log('   ', Object.keys(markets[0]).join(', '));
          console.log('\n');

          // Try to find market_id field
          if (markets[0].id) {
            console.log(`   ✅ Found market ID: ${markets[0].id}`);

            // Test market-clarifications endpoint
            console.log(`\n   Testing /market-clarifications with market_id=${markets[0].id}...`);
            const clarResponse = await fetch(`${baseUrl}/market-clarifications?market_id=${markets[0].id}`);
            console.log(`   Status: ${clarResponse.status}`);

            if (clarResponse.ok) {
              const clarData = await clarResponse.json();
              console.log('   Clarifications:', clarData);
            }
          }
        }
      }
    } catch (err) {
      console.log(`   Error: ${err}`);
    }

    // Test 3: Try with tags/categories
    console.log('\n\n3️⃣  Testing tags endpoint...\n');

    try {
      const response = await fetch(`${baseUrl}/tags`);
      console.log(`   Status: ${response.status}`);

      if (response.ok) {
        const tags = await response.json() as any[];
        console.log(`   Found ${tags.length} tags`);

        // Look for sports/esports tags
        const sportsTags = tags.filter((tag: any) =>
          tag.label?.toLowerCase().includes('sport') ||
          tag.label?.toLowerCase().includes('esport') ||
          tag.label?.toLowerCase().includes('cs') ||
          tag.label?.toLowerCase().includes('game')
        );

        console.log(`\n   Sports-related tags:`);
        sportsTags.forEach((tag: any) => {
          console.log(`      - ${tag.label} (slug: ${tag.slug}, id: ${tag.id})`);
        });

        // Try to get events for each sports tag
        if (sportsTags.length > 0) {
          console.log('\n   Fetching events for sports tags...');

          for (const tag of sportsTags.slice(0, 3)) {
            console.log(`\n   Tag: ${tag.label}`);
            const eventsResponse = await fetch(`${baseUrl}/events?tag=${tag.slug}&limit=10`);

            if (eventsResponse.ok) {
              const events = await eventsResponse.json() as any[];
              console.log(`      Found ${events.length} events`);

              events.forEach((event: any, i: number) => {
                console.log(`         ${i + 1}. ${event.title}`);
                console.log(`            Slug: ${event.slug}`);
              });
            }
          }
        }
      }
    } catch (err) {
      console.log(`   Error: ${err}`);
    }

    // Test 4: Try searching markets by keyword
    console.log('\n\n4️⃣  Searching markets for CS2 (checking 1000 markets)...\n');

    try {
      const response = await fetch(`${baseUrl}/markets?limit=1000`);

      if (response.ok) {
        const markets = await response.json() as any[];
        console.log(`   Total markets fetched: ${markets.length}`);

        const cs2Markets = markets.filter((m: any) =>
          m.question?.toLowerCase().includes('cs2') ||
          m.question?.toLowerCase().includes('counter-strike') ||
          m.question?.toLowerCase().includes('counter strike') ||
          JSON.stringify(m).toLowerCase().includes('cs2') ||
          JSON.stringify(m).toLowerCase().includes('counter-strike')
        );

        console.log(`   Found ${cs2Markets.length} CS2 markets:\n`);

        cs2Markets.slice(0, 10).forEach((market: any, i: number) => {
          console.log(`   ${i + 1}. ${market.question || 'N/A'}`);
          console.log(`      ID: ${market.id || 'N/A'}`);
          console.log(`      Market slug: ${market.market_slug || market.slug || 'N/A'}`);
          console.log(`      Condition ID: ${market.condition_id || 'N/A'}`);

          // Show all keys for CS2 market
          if (i === 0) {
            console.log(`      Available fields: ${Object.keys(market).join(', ')}`);
          }
          console.log('');
        });

        // If we found CS2 markets, try to get one in detail
        if (cs2Markets.length > 0 && cs2Markets[0].id) {
          console.log(`\n   🎯 Getting detailed info for first CS2 market (ID: ${cs2Markets[0].id})...\n`);

          const detailResponse = await fetch(`${baseUrl}/markets/${cs2Markets[0].id}`);
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            console.log('   Detailed market data:');
            console.log(JSON.stringify(detailData, null, 2));
          } else {
            console.log(`   Could not fetch detailed data: ${detailResponse.status}`);
          }
        }
      }
    } catch (err) {
      console.log(`   Error: ${err}`);
    }

  } catch (error) {
    console.error('\n❌ Fatal Error:', error);
  }
}

debugAPI();
