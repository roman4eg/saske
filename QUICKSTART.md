# 🚀 Швидкий старт (Windows)

## Крок 1: Перевірте Node.js

Відкрийте Command Prompt або PowerShell і виконайте:
```cmd
node --version
```

Якщо Node.js не встановлено, завантажте з: https://nodejs.org/

## Крок 2: Встановіть проєкт

**Варіант А: Автоматично (рекомендовано)**

Подвійний клік на файл:
```
install.bat
```

**Варіант Б: Вручну**

Відкрийте Command Prompt в папці проєкту:
```cmd
npm install
npm run build
```

## Крок 3: Запустіть приклад

**Варіант А: Подвійний клік**
```
run.bat
```

**Варіант Б: Командна строка**
```cmd
npm run dev
```

## 📋 Що буде відображено?

Парсер покаже:
- 🎮 Всі live події CS2 на Polymarket
- 💰 Коефіцієнти для кожної команди/результату
- 📊 Розміри ордерів (bid/ask)
- 📈 Spread та midpoint ціни
- 💵 Об'єм торгівлі

## 💡 Приклад коду

```typescript
import { CS2EventParser } from './src/parser.js';

const parser = new CS2EventParser();

// Отримати live події
const events = await parser.fetchLiveCS2Events();

// Показати дані
for (const event of events) {
  console.log(parser.formatCS2Event(event));
}
```

## 🔧 Troubleshooting

**Помилка: "Node.js is not installed"**
- Встановіть Node.js з https://nodejs.org/

**Помилка: "npm is not recognized"**
- Перезапустіть Command Prompt після встановлення Node.js

**Помилка при build**
- Видаліть папку `node_modules`
- Запустіть `npm install` знову

## 📚 Корисні команди

```cmd
npm install        # Встановити залежності
npm run build      # Зібрати проєкт
npm run dev        # Запустити в dev режимі
npm test           # Запустити тест
```

## 🌐 API Endpoints

Проєкт використовує:
- **Gamma API**: `https://gamma-api.polymarket.com` - події та ринки
- **CLOB API**: `https://clob.polymarket.com` - order book дані

Автентифікація не потрібна для читання даних! ✅
