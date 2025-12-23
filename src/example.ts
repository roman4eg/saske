/**
 * Example usage of CS2 Event Parser
 */

import { CS2EventParser } from './parser.js';
import { PolymarketAPI } from './api.js';

async function main() {
  const parser = new CS2EventParser();
  const api = new PolymarketAPI();

  console.log('🎮 CS2 Polymarket Event Parser\n');
  console.log('=' .repeat(80));
  console.log('\n');

  try {
    // First, let's check what esports events are available
    console.log('📋 Step 1: Checking all active esports events...\n');

    const searchTerms = ['cs2', 'counter-strike', 'counter strike', 'csgo', 'esports'];
    let allFoundEvents = [];

    for (const term of searchTerms) {
      console.log(`   Searching for: "${term}"...`);
      // Search without active filter to find all CS2 events
      const events = await api.searchEvents(term, { limit: 100 });
      console.log(`   Found ${events.length} event(s)`);

      if (events.length > 0) {
        allFoundEvents.push(...events);
      }
    }

    // Also try searching in all events by slug pattern
    console.log(`   Searching all events for CS2 patterns...`);
    const allEvents = await api.fetchEvents({ limit: 200 });
    const cs2BySlug = allEvents.filter(e =>
      e.slug.includes('cs2') ||
      e.slug.includes('counter-strike')
    );
    console.log(`   Found ${cs2BySlug.length} additional event(s) by slug`);

    if (cs2BySlug.length > 0) {
      allFoundEvents.push(...cs2BySlug);
    }

    // Remove duplicates
    const uniqueEvents = Array.from(new Map(allFoundEvents.map(e => [e.id, e])).values());
    console.log(`\n   Total unique events found: ${uniqueEvents.length}\n`);

    if (uniqueEvents.length === 0) {
      console.log('⚠️  No CS2 events found. Checking all events...\n');

      const allEvents = await api.fetchEvents({ limit: 20 });
      console.log(`Found ${allEvents.length} total events:\n`);

      allEvents.slice(0, 10).forEach((event, i) => {
        console.log(`${i + 1}. ${event.title}`);
        console.log(`   Slug: ${event.slug}`);
        console.log(`   Markets: ${event.markets?.length || 0}`);
        console.log('');
      });

      console.log('\n💡 Tip: Use parser.fetchCS2EventBySlug(slug) to get a specific event\n');
      return;
    }

    // Display found CS2 events
    console.log('=' .repeat(80));
    console.log('📊 Step 2: Parsing CS2 events with odds and order book data...\n');

    for (const event of uniqueEvents.slice(0, 5)) {
      console.log(`Processing: ${event.title}...`);

      try {
        const cs2Event = await parser.fetchCS2EventBySlug(event.slug);
        console.log(parser.formatCS2Event(cs2Event));
      } catch (err) {
        console.log(`   ⚠️  Could not fetch detailed data for ${event.title}`);
        console.log(`   Error: ${err instanceof Error ? err.message : String(err)}\n`);
      }
    }

    // Summary
    console.log('\n' + '=' .repeat(80));
    console.log('✅ Parsing complete!\n');
    console.log(`Total events processed: ${Math.min(uniqueEvents.length, 5)}`);

    if (uniqueEvents.length > 5) {
      console.log(`\n💡 ${uniqueEvents.length - 5} more events available. Showing first 5.`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Run the example
main();
