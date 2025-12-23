/**
 * API client for Polymarket Gamma and CLOB APIs
 */

import { Event, OrderBook, GammaAPIParams } from './types.js';

const GAMMA_API_BASE = 'https://gamma-api.polymarket.com';
const CLOB_API_BASE = 'https://clob.polymarket.com';

export class PolymarketAPI {
  /**
   * Fetch events from Gamma API
   */
  async fetchEvents(params: GammaAPIParams = {}): Promise<Event[]> {
    const queryParams = new URLSearchParams();

    if (params.active !== undefined) queryParams.append('active', String(params.active));
    if (params.closed !== undefined) queryParams.append('closed', String(params.closed));
    if (params.archived !== undefined) queryParams.append('archived', String(params.archived));
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.offset) queryParams.append('offset', String(params.offset));
    if (params.order) queryParams.append('order', params.order);
    if (params.ascending !== undefined) queryParams.append('ascending', String(params.ascending));
    if (params.tag) queryParams.append('tag', params.tag);

    const url = `${GAMMA_API_BASE}/events?${queryParams.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Gamma API request failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data as Event[];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific event by slug
   */
  async fetchEventBySlug(slug: string): Promise<Event> {
    const url = `${GAMMA_API_BASE}/events/${slug}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Gamma API request failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data as Event;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }

  /**
   * Fetch order book for a specific token
   */
  async fetchOrderBook(tokenId: string): Promise<OrderBook | null> {
    const url = `${CLOB_API_BASE}/book?token_id=${tokenId}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Order book not available for token ${tokenId}: ${response.status}`);
        return null;
      }
      const data = await response.json() as any;
      return {
        token_id: tokenId,
        market: data.market || '',
        asset_id: data.asset_id || tokenId,
        bids: data.bids || [],
        asks: data.asks || [],
        timestamp: Date.now()
      };
    } catch (error) {
      console.warn(`Error fetching order book for token ${tokenId}:`, error);
      return null;
    }
  }

  /**
   * Fetch midpoint price for a token
   */
  async fetchMidpoint(tokenId: string): Promise<number | null> {
    const url = `${CLOB_API_BASE}/midpoint?token_id=${tokenId}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return null;
      }
      const data = await response.json() as any;
      return data.mid ? parseFloat(data.mid) : null;
    } catch (error) {
      console.warn(`Error fetching midpoint for token ${tokenId}:`, error);
      return null;
    }
  }

  /**
   * Fetch price for a token
   */
  async fetchPrice(tokenId: string): Promise<number | null> {
    const url = `${CLOB_API_BASE}/price?token_id=${tokenId}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return null;
      }
      const data = await response.json() as any;
      return data.price ? parseFloat(data.price) : null;
    } catch (error) {
      console.warn(`Error fetching price for token ${tokenId}:`, error);
      return null;
    }
  }

  /**
   * Search for events by keyword
   */
  async searchEvents(keyword: string, params: GammaAPIParams = {}): Promise<Event[]> {
    const events = await this.fetchEvents(params);
    const lowerKeyword = keyword.toLowerCase();

    return events.filter(event =>
      event.title.toLowerCase().includes(lowerKeyword) ||
      event.slug.toLowerCase().includes(lowerKeyword) ||
      (event.description && event.description.toLowerCase().includes(lowerKeyword))
    );
  }
}
