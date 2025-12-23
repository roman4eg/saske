/**
 * Test fetching a specific CS2 event
 */

import { PolymarketAPI } from './api.js';
import { CS2EventParser } from './parser.js';

async function testSpecific() {
  console.log('🎯 CS2 Live Events Finder\n');
  console.log('=' .repeat(80));

  const api = new PolymarketAPI();
  const parser = new CS2EventParser();

  try {
    // First, let's find all CS2 events
    console.log('\n1️⃣  Searching for all CS2 events in Polymarket...\n');

    const allEvents = await api.fetchEvents({ limit: 500 });
    console.log(`   Fetched ${allEvents.length} total events from API`);

    const cs2Events = allEvents.filter(e =>
      e.slug.includes('cs2-') ||
      e.slug.includes('counter-strike') ||
      e.title.toLowerCase().includes('cs2') ||
      e.title.toLowerCase().includes('counter-strike') ||
      e.title.toLowerCase().includes('counter strike')
    );

    console.log(`   Found ${cs2Events.length} CS2-related events\n`);

    if (cs2Events.length === 0) {
      console.log('⚠️  No CS2 events found. Showing sample of all events:\n');

      allEvents.slice(0, 20).forEach((event, i) => {
        console.log(`${i + 1}. ${event.title}`);
        console.log(`   Slug: ${event.slug}`);
        console.log(`   URL: https://polymarket.com/event/${event.slug}`);
        console.log('');
      });

      return;
    }

    console.log('=' .repeat(80));
    console.log('\n📋 CS2 Events List:\n');

    cs2Events.forEach((event, i) => {
      console.log(`${i + 1}. ${event.title}`);
      console.log(`   Slug: ${event.slug}`);
      console.log(`   URL: https://polymarket.com/event/${event.slug}`);
      console.log(`   Active: ${event.active} | Closed: ${event.closed}`);
      console.log(`   Markets: ${event.markets?.length || 0}`);
      console.log('');
    });

    // Now try to get detailed data for the first CS2 event found
    if (cs2Events.length > 0) {
      console.log('=' .repeat(80));
      console.log('\n2️⃣  Fetching detailed data for first CS2 event...\n');

      const firstEvent = cs2Events[0];
      console.log(`Processing: ${firstEvent.title}`);
      console.log(`Slug: ${firstEvent.slug}\n`);

      try {
        const cs2Event = await parser.fetchCS2EventBySlug(firstEvent.slug);
        console.log(parser.formatCS2Event(cs2Event));

        // Process more events if available
        const eventsToProcess = Math.min(cs2Events.length, 3);
        if (eventsToProcess > 1) {
          console.log('\n' + '=' .repeat(80));
          console.log(`\n3️⃣  Processing ${eventsToProcess - 1} more CS2 event(s)...\n`);

          for (let i = 1; i < eventsToProcess; i++) {
            const event = cs2Events[i];
            console.log(`\nProcessing: ${event.title}...`);

            try {
              const cs2Event = await parser.fetchCS2EventBySlug(event.slug);
              console.log(parser.formatCS2Event(cs2Event));
            } catch (err) {
              console.log(`   ⚠️  Could not fetch data: ${err instanceof Error ? err.message : String(err)}\n`);
            }
          }
        }

      } catch (err) {
        console.log(`   ⚠️  Error fetching event details: ${err instanceof Error ? err.message : String(err)}\n`);
      }
    }

    console.log('\n' + '=' .repeat(80));
    console.log(`\n✅ Found and processed ${cs2Events.length} CS2 event(s)\n`);

  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
    process.exit(1);
  }
}

testSpecific();
