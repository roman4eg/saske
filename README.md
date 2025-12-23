# CS2 Polymarket Event Parser

Парсер подій CS2 (Counter-Strike 2) з Polymarket з отриманням коефіцієнтів та розміру ордерів у реальному часі.

## Особливості

- ✅ Отримання live подій CS2 з Polymarket
- ✅ Парсинг коефіцієнтів (odds) для кожного результату
- ✅ Отримання даних order book (розміри ордерів, bid/ask)
- ✅ Підтримка пошуку подій за ключовими словами
- ✅ Розрахунок ймовірностей та різних форматів коефіцієнтів
- ✅ TypeScript з повною типізацією

## Встановлення

### Windows (Швидке встановлення)

**Варіант 1: Batch файл (рекомендовано)**
```cmd
install.bat
```

**Варіант 2: PowerShell**
```powershell
.\install.ps1
```

**Варіант 3: Вручну**
```cmd
npm install
npm run build
```

### Linux / macOS

```bash
npm install
npm run build
```

> **Примітка**: Для роботи потрібен Node.js версії 18 або вище. Завантажити можна з [nodejs.org](https://nodejs.org/)

## Використання

### Базове використання

```typescript
import { CS2EventParser } from './src/parser.js';

const parser = new CS2EventParser();

// Отримати всі live події CS2
const cs2Events = await parser.fetchLiveCS2Events();

// Показати summary
console.log(parser.getEventsSummary(cs2Events));

// Показати детальну інформацію
for (const event of cs2Events) {
  console.log(parser.formatCS2Event(event));
}
```

### Пошук подій

```typescript
// Пошук за ключовим словом
const blastEvents = await parser.searchCS2Events('blast');

// Отримання конкретної події за slug
const event = await parser.fetchCS2EventBySlug('cs2-blasttv-austin-major');
```

### Запуск прикладу

**Windows:**
```cmd
run.bat
```
або
```cmd
npm run dev
```

**Linux / macOS:**
```bash
npm run dev
```

**Альтернативно:**
```bash
npm test
```

### Збірка проєкту

```bash
npm run build
npm start
```

## Структура даних

### CS2Event

```typescript
interface CS2Event {
  event: Event;          // Основна інформація про подію
  markets: CS2Market[];  // Ринки з коефіцієнтами та order book
}
```

### CS2Market

```typescript
interface CS2Market {
  market: Market;                      // Інформація про ринок
  odds: MarketOdds;                    // Коефіцієнти для результатів
  order_book_summary: OrderBookSummary[]; // Дані order book
}
```

### OutcomeOdds

```typescript
interface OutcomeOdds {
  outcome: string;              // Назва результату (напр. "Team A wins")
  token_id: string;             // ID токена
  probability: number;          // Ймовірність (0-1)
  decimal_odds: number;         // Десяткові коефіцієнти
  american_odds: string;        // Американські коефіцієнти (+100, -150, etc.)
  implied_probability: number;  // Імплікована ймовірність
}
```

### OrderBookSummary

```typescript
interface OrderBookSummary {
  token_id: string;
  outcome: string;
  best_bid?: Order;        // Найкраща ціна покупки
  best_ask?: Order;        // Найкраща ціна продажу
  spread?: number;         // Спред між bid/ask
  midpoint?: number;       // Середня ціна
  total_bid_size: number;  // Загальний розмір bid ордерів
  total_ask_size: number;  // Загальний розмір ask ордерів
}
```

## API

### CS2EventParser

#### `fetchLiveCS2Events(): Promise<CS2Event[]>`
Отримує всі активні live події CS2.

#### `fetchCS2EventBySlug(slug: string): Promise<CS2Event>`
Отримує конкретну подію за slug.

#### `searchCS2Events(keyword: string): Promise<CS2Event[]>`
Шукає події CS2 за ключовим словом.

#### `formatCS2Event(cs2Event: CS2Event): string`
Форматує подію для відображення в консолі.

#### `getEventsSummary(cs2Events: CS2Event[]): string`
Повертає summary статистику по подіях.

### PolymarketAPI

#### `fetchEvents(params?: GammaAPIParams): Promise<Event[]>`
Отримує події з Gamma API.

#### `fetchEventBySlug(slug: string): Promise<Event>`
Отримує подію за slug.

#### `fetchOrderBook(tokenId: string): Promise<OrderBook | null>`
Отримує order book для токена.

#### `fetchMidpoint(tokenId: string): Promise<number | null>`
Отримує midpoint ціну для токена.

#### `fetchPrice(tokenId: string): Promise<number | null>`
Отримує поточну ціну для токена.

## Приклад виводу

```
================================================================================
EVENT: CS2: BLAST.tv Austin Major
Slug: cs2-blasttv-austin-major
Active: Yes
End Date: 2025-01-20T00:00:00.000Z
Volume: $150,000
================================================================================

  MARKET: Who will win the BLAST.tv Austin Major?
  Market Slug: blast-austin-major-winner
  Volume: $75,000
  Active: Yes
  Accepting Orders: Yes

  ODDS:
    - Team Spirit:
      Probability: 35.50%
      Decimal Odds: 2.82
      American Odds: +182

      ORDER BOOK:
        Best Bid: 0.3520 (Size: 500.00)
        Best Ask: 0.3580 (Size: 450.00)
        Spread: 0.0060
        Midpoint: 0.3550
        Total Bid Size: 2500.00
        Total Ask Size: 2200.00

    - FaZe Clan:
      Probability: 28.30%
      Decimal Odds: 3.53
      American Odds: +253

      ORDER BOOK:
        Best Bid: 0.2810 (Size: 300.00)
        Best Ask: 0.2850 (Size: 350.00)
        Spread: 0.0040
        Midpoint: 0.2830
        Total Bid Size: 1800.00
        Total Ask Size: 1600.00
```

## Джерела

- [Polymarket Gamma API](https://gamma-api.polymarket.com/)
- [Polymarket CLOB API](https://docs.polymarket.com/developers/CLOB/introduction)
- [CS2 Events на Polymarket](https://polymarket.com/sports/counter-strike/games)

## Ліцензія

MIT
