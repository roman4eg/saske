/**
 * Example usage of CS2 Event Parser
 */

import { CS2EventParser } from './parser.js';

async function main() {
  const parser = new CS2EventParser();

  console.log('🎮 CS2 Polymarket Event Parser\n');
  console.log('Fetching live CS2 events...\n');

  try {
    // Fetch all live CS2 events
    const cs2Events = await parser.fetchLiveCS2Events();

    // Display summary
    console.log(parser.getEventsSummary(cs2Events));

    // Display detailed information for each event
    for (const cs2Event of cs2Events) {
      console.log(parser.formatCS2Event(cs2Event));
    }

    // Example: Search for specific events
    console.log('\n\nSearching for BLAST events...\n');
    const blastEvents = await parser.searchCS2Events('blast');

    if (blastEvents.length > 0) {
      console.log(`Found ${blastEvents.length} BLAST event(s)\n`);
      for (const event of blastEvents) {
        console.log(parser.formatCS2Event(event));
      }
    } else {
      console.log('No BLAST events found');
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the example
main();
