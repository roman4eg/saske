/**
 * CS2 Event Parser for Polymarket
 */

import { PolymarketAPI } from './api.js';
import {
  Event,
  Market,
  CS2Event,
  CS2Market,
  MarketOdds,
  OutcomeOdds,
  OrderBookSummary,
  Order
} from './types.js';

export class CS2EventParser {
  private api: PolymarketAPI;

  constructor() {
    this.api = new PolymarketAPI();
  }

  /**
   * Fetch all live CS2 events
   */
  async fetchLiveCS2Events(): Promise<CS2Event[]> {
    const events = await this.api.searchEvents('cs2', {
      active: true,
      closed: false,
      limit: 100
    });

    const cs2Events: CS2Event[] = [];

    for (const event of events) {
      const markets = await this.parseMarketsForEvent(event);
      cs2Events.push({
        event,
        markets
      });
    }

    return cs2Events;
  }

  /**
   * Fetch CS2 events by specific slug
   */
  async fetchCS2EventBySlug(slug: string): Promise<CS2Event> {
    const event = await this.api.fetchEventBySlug(slug);
    const markets = await this.parseMarketsForEvent(event);

    return {
      event,
      markets
    };
  }

  /**
   * Search for CS2 events by keyword
   */
  async searchCS2Events(keyword: string): Promise<CS2Event[]> {
    const events = await this.api.searchEvents(`cs2 ${keyword}`, {
      active: true,
      limit: 100
    });

    const cs2Events: CS2Event[] = [];

    for (const event of events) {
      const markets = await this.parseMarketsForEvent(event);
      cs2Events.push({
        event,
        markets
      });
    }

    return cs2Events;
  }

  /**
   * Parse markets for an event and fetch order book data
   */
  private async parseMarketsForEvent(event: Event): Promise<CS2Market[]> {
    const cs2Markets: CS2Market[] = [];

    for (const market of event.markets) {
      const odds = this.calculateOdds(market);
      const orderBookSummary = await this.fetchOrderBookSummary(market);

      cs2Markets.push({
        market,
        odds,
        order_book_summary: orderBookSummary
      });
    }

    return cs2Markets;
  }

  /**
   * Calculate odds from market prices
   */
  private calculateOdds(market: Market): MarketOdds {
    const outcomes: OutcomeOdds[] = market.tokens.map(token => {
      const price = parseFloat(token.price);
      const probability = price;
      const decimalOdds = price > 0 ? 1 / price : 0;
      const americanOdds = this.convertToAmericanOdds(decimalOdds);

      return {
        outcome: token.outcome,
        token_id: token.token_id,
        probability: price,
        decimal_odds: decimalOdds,
        american_odds: americanOdds,
        implied_probability: probability
      };
    });

    return { outcomes };
  }

  /**
   * Convert decimal odds to American odds format
   */
  private convertToAmericanOdds(decimalOdds: number): string {
    if (decimalOdds >= 2) {
      return `+${Math.round((decimalOdds - 1) * 100)}`;
    } else if (decimalOdds > 1) {
      return `-${Math.round(100 / (decimalOdds - 1))}`;
    }
    return '+0';
  }

  /**
   * Fetch order book summary for all outcomes in a market
   */
  private async fetchOrderBookSummary(market: Market): Promise<OrderBookSummary[]> {
    const summaries: OrderBookSummary[] = [];

    for (const token of market.tokens) {
      const orderBook = await this.api.fetchOrderBook(token.token_id);

      if (!orderBook) {
        summaries.push({
          token_id: token.token_id,
          outcome: token.outcome,
          total_bid_size: 0,
          total_ask_size: 0
        });
        continue;
      }

      const bestBid = orderBook.bids.length > 0 ? orderBook.bids[0] : undefined;
      const bestAsk = orderBook.asks.length > 0 ? orderBook.asks[0] : undefined;

      const spread = bestBid && bestAsk
        ? parseFloat(bestAsk.price) - parseFloat(bestBid.price)
        : undefined;

      const midpoint = bestBid && bestAsk
        ? (parseFloat(bestBid.price) + parseFloat(bestAsk.price)) / 2
        : undefined;

      const totalBidSize = this.calculateTotalSize(orderBook.bids);
      const totalAskSize = this.calculateTotalSize(orderBook.asks);

      summaries.push({
        token_id: token.token_id,
        outcome: token.outcome,
        best_bid: bestBid,
        best_ask: bestAsk,
        spread,
        midpoint,
        total_bid_size: totalBidSize,
        total_ask_size: totalAskSize
      });
    }

    return summaries;
  }

  /**
   * Calculate total size from orders
   */
  private calculateTotalSize(orders: Order[]): number {
    return orders.reduce((sum, order) => sum + parseFloat(order.size), 0);
  }

  /**
   * Format CS2 event for display
   */
  formatCS2Event(cs2Event: CS2Event): string {
    let output = '';

    output += `\n${'='.repeat(80)}\n`;
    output += `EVENT: ${cs2Event.event.title}\n`;
    output += `Slug: ${cs2Event.event.slug}\n`;
    output += `Active: ${cs2Event.event.active ? 'Yes' : 'No'}\n`;
    output += `End Date: ${cs2Event.event.end_date_iso}\n`;
    if (cs2Event.event.volume) {
      output += `Volume: $${parseFloat(cs2Event.event.volume).toLocaleString()}\n`;
    }
    output += `${'='.repeat(80)}\n`;

    for (const marketData of cs2Event.markets) {
      const market = marketData.market;

      output += `\n  MARKET: ${market.question}\n`;
      output += `  Market Slug: ${market.market_slug}\n`;
      output += `  Volume: $${parseFloat(market.volume).toLocaleString()}\n`;
      output += `  Active: ${market.active ? 'Yes' : 'No'}\n`;
      output += `  Accepting Orders: ${market.accepting_orders ? 'Yes' : 'No'}\n`;
      output += `\n  ODDS:\n`;

      for (const outcome of marketData.odds.outcomes) {
        output += `    - ${outcome.outcome}:\n`;
        output += `      Probability: ${(outcome.probability * 100).toFixed(2)}%\n`;
        output += `      Decimal Odds: ${outcome.decimal_odds.toFixed(2)}\n`;
        output += `      American Odds: ${outcome.american_odds}\n`;

        const orderBookData = marketData.order_book_summary.find(
          ob => ob.token_id === outcome.token_id
        );

        if (orderBookData) {
          output += `\n      ORDER BOOK:\n`;
          if (orderBookData.best_bid) {
            output += `        Best Bid: ${orderBookData.best_bid.price} (Size: ${orderBookData.best_bid.size})\n`;
          }
          if (orderBookData.best_ask) {
            output += `        Best Ask: ${orderBookData.best_ask.price} (Size: ${orderBookData.best_ask.size})\n`;
          }
          if (orderBookData.spread !== undefined) {
            output += `        Spread: ${orderBookData.spread.toFixed(4)}\n`;
          }
          if (orderBookData.midpoint !== undefined) {
            output += `        Midpoint: ${orderBookData.midpoint.toFixed(4)}\n`;
          }
          output += `        Total Bid Size: ${orderBookData.total_bid_size.toFixed(2)}\n`;
          output += `        Total Ask Size: ${orderBookData.total_ask_size.toFixed(2)}\n`;
        }
      }

      output += `\n  ${'-'.repeat(76)}\n`;
    }

    return output;
  }

  /**
   * Get summary statistics for CS2 events
   */
  getEventsSummary(cs2Events: CS2Event[]): string {
    const totalEvents = cs2Events.length;
    const totalMarkets = cs2Events.reduce((sum, event) => sum + event.markets.length, 0);
    const activeEvents = cs2Events.filter(e => e.event.active).length;

    let totalVolume = 0;
    cs2Events.forEach(event => {
      if (event.event.volume) {
        totalVolume += parseFloat(event.event.volume);
      }
    });

    return `
CS2 EVENTS SUMMARY
==================
Total Events: ${totalEvents}
Active Events: ${activeEvents}
Total Markets: ${totalMarkets}
Total Volume: $${totalVolume.toLocaleString()}
`;
  }
}
