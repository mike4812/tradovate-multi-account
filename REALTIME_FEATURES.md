# 📊 Real-Time Market Data & Chart Features

## ✅ What's New

Your Tradovate Multi-Account Manager now includes:

1. **Real-Time Market Data Streaming** via WebSocket
2. **Interactive Charts** with orders and positions overlay
3. **Live Quotes** for NQ, ES, GC, and other futures
4. **Historical Chart Data** with customizable intervals

---

## 🚀 Quick Start

### Option 1: Run the Example Script

Stream live quotes and charts for NQ, ES, and GC:

```powershell
node examples/realtime-market-data.js
```

This will:
- Connect to Tradovate WebSocket
- Stream live quotes for NQ, ES, GC
- Display 5-minute chart bars
- Show your orders and positions on an ASCII chart

### Option 2: Use the Web Interface

1. **Start the web server:**
   ```powershell
   npm run web
   ```

2. **Open browser:** http://localhost:3000

3. **Navigate to "Positions" tab**

4. **Click "📡 התחל סטרימינג"** to start the live chart

The chart will display:
- 📈 Real-time price candles
- 🟢 LONG positions (green lines)
- 🔴 SHORT positions (red lines)
- 🟠 Pending orders (orange dashed lines)

---

## 📁 New Files Created

### 1. `src/TradovateMarketData.js`
Main class for real-time market data:
- WebSocket connection to Tradovate
- Subscribe to live quotes
- Subscribe to chart/histogram data
- Fetch historical bars
- Overlay orders and positions

**Example Usage:**
```javascript
import TradovateMarketData from './src/TradovateMarketData.js';

const marketData = new TradovateMarketData({
  accountName: 'My Account',
  username: 'your_username',
  password: 'your_password',
  appId: 'Sample App',
  appVersion: '1.0',
  cid: 'YOUR_CID',
  sec: 'YOUR_SEC'
}, true); // true = Demo mode

// Connect WebSocket
await marketData.connectWebSocket();

// Subscribe to NQ quotes
await marketData.subscribeToQuote('NQH5', (quote) => {
  console.log(`NQ: ${quote.last} | Bid: ${quote.bid} | Ask: ${quote.ask}`);
});

// Get historical chart
const chartData = await marketData.getChartData('NQH5', 5, 100);
console.log('Last 10 bars:', chartData.bars.slice(-10));
```

### 2. `examples/realtime-market-data.js`
Complete example showing:
- Live quote streaming for NQ, ES, GC
- 5-minute chart subscription
- Historical data fetching
- ASCII chart with orders overlay

### 3. Web Interface Updates

**Updated Files:**
- `web/index.html` - Added Chart.js and chart section
- `web/js/app.js` - Added chart functionality with orders overlay
- `src/server.js` - Added API endpoints for market data

**New API Endpoints:**
```javascript
GET /api/chart/:symbol?interval=5&bars=50  // Get historical chart
GET /api/quote/:symbol                      // Get current quote
GET /api/positions                          // Get positions & orders
```

---

## 📊 Available Instruments

### Futures Contracts:
- **NQ** - E-mini Nasdaq (NQH5, NQM5, NQU5, NQZ5)
- **ES** - E-mini S&P 500 (ESH5, ESM5, ESU5, ESZ5)
- **GC** - Gold Futures (GCG5, GCJ5, GCM5, GCQ5, GCV5, GCZ5)
- **CL** - Crude Oil
- **6E** - Euro FX
- **YM** - E-mini Dow
- **RTY** - E-mini Russell

### Contract Months:
- **H** = March
- **M** = June
- **U** = September
- **Z** = December

---

## 🎯 Chart Features

### Intervals Supported:
- 1 minute
- 5 minutes (default)
- 15 minutes
- 60 minutes

### Chart Overlays:
1. **Position Lines** (Green/Red)
   - Shows entry price for LONG/SHORT positions
   - Label displays position size

2. **Order Lines** (Orange Dashed)
   - Shows pending buy/sell orders
   - Label displays order price and quantity

3. **Interactive Tooltips**
   - Hover over price to see orders at that level
   - Shows position details

### Real-Time Updates:
- Chart updates every interval with new bar
- Orders and positions refresh automatically
- Price streams continuously via WebSocket

---

## 🔧 Configuration

### Enable Real Market Data:

Edit your `config.json`:

```json
{
  "accounts": [
    {
      "accountName": "My Trading Account",
      "username": "your_username",
      "password": "your_password",
      "appId": "Sample App",
      "appVersion": "1.0",
      "cid": "YOUR_CID",
      "sec": "YOUR_SECRET"
    }
  ],
  "settings": {
    "isDemo": true,
    "autoConnect": false
  }
}
```

### Get Tradovate API Credentials:

1. Log into your Tradovate account
2. Go to **Settings → API**
3. Generate new credentials
4. Copy **CID** (Client ID) and **SEC** (Secret)
5. Update your `config.json`

---

## 💻 Code Examples

### Subscribe to Multiple Symbols:

```javascript
import TradovateMarketData from './src/TradovateMarketData.js';

const marketData = new TradovateMarketData(accountConfig, true);
await marketData.connectWebSocket();

// Track latest quotes
const quotes = {};

// NQ
await marketData.subscribeToQuote('NQH5', (quote) => {
  quotes.NQ = quote;
  console.log(`NQ: ${quote.last}`);
});

// ES
await marketData.subscribeToQuote('ESH5', (quote) => {
  quotes.ES = quote;
  console.log(`ES: ${quote.last}`);
});

// GC
await marketData.subscribeToQuote('GCG5', (quote) => {
  quotes.GC = quote;
  console.log(`GC: ${quote.last}`);
});
```

### Get Chart with Orders:

```javascript
// Get historical data
const chartData = await marketData.getChartData('NQH5', 5, 50);

// Get current orders and positions
const ordersData = await marketData.getOrdersForChart();

// Display
console.log('Chart Bars:', chartData.bars.length);
console.log('Active Orders:', ordersData.orders);
console.log('Open Positions:', ordersData.positions);
```

### Subscribe to Chart Updates:

```javascript
await marketData.subscribeToChart('NQH5', 5, (data) => {
  if (data.bars && data.bars.length > 0) {
    const lastBar = data.bars[data.bars.length - 1];
    console.log(`New 5min bar: O=${lastBar.open} H=${lastBar.high} L=${lastBar.low} C=${lastBar.close}`);
  }
});
```

---

## 🌐 Web Interface Guide

### Starting the Chart:

1. Open http://localhost:3000
2. Click "התחבר לכל החשבונות" (Connect to all accounts)
3. Navigate to "פוזיציות" (Positions) tab
4. Select symbol (NQ/ES/GC)
5. Select interval (1/5/15/60 min)
6. Click "📡 התחל סטרימינג"

### Chart Controls:

- **Symbol Dropdown** - Choose which instrument to display
- **Interval Dropdown** - Choose bar interval
- **Start Streaming** - Begin real-time updates
- **Stop Streaming** - Pause updates

### Chart Legend:

- 🔵 **Blue Line** - Price movement
- 🟢 **Green Line** - LONG positions
- 🔴 **Red Line** - SHORT positions
- 🟠 **Orange Dashed** - Pending orders

---

## ⚙️ API Reference

### TradovateMarketData Methods:

```javascript
// Constructor
new TradovateMarketData(accountConfig, isDemo = true)

// Connect WebSocket
await connectWebSocket()

// Subscribe to quotes
await subscribeToQuote(symbol, callback)

// Subscribe to charts
await subscribeToChart(symbol, interval, callback)

// Get historical data
await getChartData(symbol, interval, bars)

// Get orders for overlay
await getOrdersForChart()

// Get contract info
await getContract(symbol)

// Unsubscribe
unsubscribeFromQuote(symbol)

// Disconnect
closeWebSocket()
disconnect()
```

### Server API Endpoints:

```javascript
GET  /api/status              // Server status
POST /api/login               // Login
POST /api/connect             // Connect to accounts
GET  /api/positions           // Get positions & orders
GET  /api/chart/:symbol       // Get chart data
GET  /api/quote/:symbol       // Get live quote
POST /api/trade/open          // Open position
POST /api/trade/close         // Close position
```

---

## 🐛 Troubleshooting

### "Cannot find module 'ws'"
```powershell
npm install ws
```

### Chart not loading
1. Check browser console for errors
2. Make sure server is running on port 3000
3. Try demo mode first (will use simulated data)

### No market data showing
1. Verify your CID and SEC in config.json
2. Check if you have market data subscription on Tradovate
3. Make sure you're using the correct contract symbols (NQH5, not just NQ)

### WebSocket connection fails
1. Check if demo vs live mode is correct
2. Verify credentials are valid
3. Try authenticating via REST first
4. Check Tradovate API status

---

## 📚 Additional Resources

- [Tradovate API Documentation](https://tradovate.github.io/api/)
- [WebSocket API Guide](https://tradovate.github.io/api/#websocket-api)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)

---

## 🎉 Next Steps

1. **Test with Demo Account:**
   ```powershell
   node examples/realtime-market-data.js
   ```

2. **Try Web Interface:**
   ```powershell
   npm run web
   ```

3. **Customize Charts:**
   - Edit `web/js/app.js` to change colors
   - Modify intervals and symbols
   - Add more indicators

4. **Build Trading Strategies:**
   - Use live quotes for signal generation
   - Overlay strategy entries/exits on charts
   - Backtest with historical data

---

**Created:** November 6, 2025  
**Version:** 2.0 - Real-Time Market Data Edition

🚀 **Happy Trading!**
