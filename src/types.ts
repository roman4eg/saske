/**
 * Types for Polymarket CS2 Event Parser
 */

export interface Market {
  condition_id: string;
  question_id: string;
  question: string;
  description: string;
  market_slug: string;
  end_date_iso: string;
  game_start_time?: string;
  outcomes: string[];
  outcome_prices: string[];
  volume: string;
  active: boolean;
  closed: boolean;
  accepting_orders: boolean;
  tokens: Token[];
  rewards?: Rewards;
}

export interface Token {
  token_id: string;
  outcome: string;
  price: string;
  winner: boolean;
}

export interface Rewards {
  min_size: string;
  max_spread: string;
  event_start_date?: string;
  event_end_date?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  start_date_iso?: string;
  end_date_iso: string;
  image?: string;
  icon?: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  markets: Market[];
  volume?: string;
  liquidity?: string;
  enable_order_book?: boolean;
}

export interface OrderBook {
  token_id: string;
  market: string;
  asset_id: string;
  bids: Order[];
  asks: Order[];
  timestamp: number;
}

export interface Order {
  price: string;
  size: string;
}

export interface OrderBookSummary {
  token_id: string;
  outcome: string;
  best_bid?: Order;
  best_ask?: Order;
  spread?: number;
  midpoint?: number;
  total_bid_size: number;
  total_ask_size: number;
}

export interface CS2Event {
  event: Event;
  markets: CS2Market[];
}

export interface CS2Market {
  market: Market;
  odds: MarketOdds;
  order_book_summary: OrderBookSummary[];
}

export interface MarketOdds {
  outcomes: OutcomeOdds[];
}

export interface OutcomeOdds {
  outcome: string;
  token_id: string;
  probability: number;
  decimal_odds: number;
  american_odds: string;
  implied_probability: number;
}

export interface GammaAPIParams {
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  ascending?: boolean;
  tag?: string;
  slug?: string;
}
