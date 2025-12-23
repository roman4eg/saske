/**
 * Test fetching a specific CS2 event
 */

import { PolymarketAPI } from './api.js';
import { CS2EventParser } from './parser.js';

async function testSpecific() {
  console.log('🎯 Testing Specific CS2 Event\n');
  console.log('=' .repeat(80));

  const api = new PolymarketAPI();
  const parser = new CS2EventParser();

  try {
    // Try to fetch the specific event you mentioned
    const slug = 'cs2-33-g1-2025-12-23';

    console.log(`\n1️⃣  Fetching event: ${slug}...\n`);

    const event = await api.fetchEventBySlug(slug);

    console.log('✅ Event found!');
    console.log(`Title: ${event.title}`);
    console.log(`Slug: ${event.slug}`);
    console.log(`Active: ${event.active}`);
    console.log(`Closed: ${event.closed}`);
    console.log(`Markets: ${event.markets?.length || 0}`);
    console.log('');

    // Now get full details with odds and order book
    console.log('=' .repeat(80));
    console.log('\n2️⃣  Fetching odds and order book data...\n');

    const cs2Event = await parser.fetchCS2EventBySlug(slug);
    console.log(parser.formatCS2Event(cs2Event));

    // Let's also try to find all CS2 events
    console.log('\n' + '=' .repeat(80));
    console.log('\n3️⃣  Searching for all events with "cs2" in slug...\n');

    const allEvents = await api.fetchEvents({ limit: 100 });
    const cs2Events = allEvents.filter(e =>
      e.slug.includes('cs2') ||
      e.slug.includes('counter-strike') ||
      e.title.toLowerCase().includes('cs2') ||
      e.title.toLowerCase().includes('counter-strike')
    );

    console.log(`Found ${cs2Events.length} CS2-related events:\n`);

    cs2Events.forEach((event, i) => {
      console.log(`${i + 1}. ${event.title}`);
      console.log(`   Slug: ${event.slug}`);
      console.log(`   Active: ${event.active} | Closed: ${event.closed}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

testSpecific();
