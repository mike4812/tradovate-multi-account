/**
 * Real-Time Market Data Example
 * 
 * Shows how to get live quotes and charts for NQ, ES, GC with orders overlay
 * Run: node examples/realtime-market-data.js
 */

import TradovateMarketData from '../src/TradovateMarketData.js';

async function main() {
  console.log('📊 Tradovate Real-Time Market Data with Orders\n');

  // Create market data client (true = Demo mode)
  const marketData = new TradovateMarketData({
    accountName: 'Market Data Feed',
    username: 'ergeZalivanskii47',
    password: 'sdgL5168V5980N8440tv==',
    appId: 'Sample App',
    appVersion: '1.0',
    cid: 'ewr',
    sec: 'wer'
  }, true);

  try {
    // Connect WebSocket
    console.log('🔌 Connecting to WebSocket...\n');
    await marketData.connectWebSocket();

    console.log('✅ Connected! Starting market data streams...\n');

    // Track latest quotes
    const latestQuotes = {};

    // Subscribe to NQ (Nasdaq futures)
    await marketData.subscribeToQuote('NQH5', (quote) => {
      latestQuotes.NQ = quote;
      console.log(`📈 NQ: ${quote.last.toFixed(2)} | Bid: ${quote.bid} x ${quote.bidSize} | Ask: ${quote.ask} x ${quote.askSize} | Vol: ${quote.volume}`);
    });

    // Subscribe to ES (S&P 500 futures)
    await marketData.subscribeToQuote('ESH5', (quote) => {
      latestQuotes.ES = quote;
      console.log(`📊 ES: ${quote.last.toFixed(2)} | Bid: ${quote.bid} x ${quote.bidSize} | Ask: ${quote.ask} x ${quote.askSize} | Vol: ${quote.volume}`);
    });

    // Subscribe to GC (Gold futures)
    await marketData.subscribeToQuote('GCG5', (quote) => {
      latestQuotes.GC = quote;
      console.log(`🥇 GC: ${quote.last.toFixed(2)} | Bid: ${quote.bid} x ${quote.bidSize} | Ask: ${quote.ask} x ${quote.askSize} | Vol: ${quote.volume}`);
    });

    // Subscribe to 5-minute chart for NQ
    await marketData.subscribeToChart('NQH5', 5, (data) => {
      if (data.bars && data.bars.length > 0) {
        const lastBar = data.bars[data.bars.length - 1];
        console.log(`📊 NQ 5min Bar: O=${lastBar.open} H=${lastBar.high} L=${lastBar.low} C=${lastBar.close} V=${lastBar.volume}`);
      }
    });

    // Get historical chart data for NQ
    console.log('\n📈 Fetching historical chart data for NQ...');
    const chartData = await marketData.getChartData('NQH5', 5, 20);
    
    if (chartData && chartData.bars) {
      console.log(`\n📊 Last 5 bars for NQ (5min):`);
      chartData.bars.slice(-5).forEach((bar, idx) => {
        console.log(`  ${idx + 1}. Time: ${new Date(bar.timestamp).toLocaleTimeString()} | O: ${bar.open} H: ${bar.high} L: ${bar.low} C: ${bar.close} V: ${bar.volume}`);
      });
    }

    // Get current orders and positions
    console.log('\n📋 Fetching current orders and positions...');
    const ordersData = await marketData.getOrdersForChart();
    
    if (ordersData.orders.length > 0) {
      console.log(`\n🔵 Active Orders (${ordersData.orders.length}):`);
      ordersData.orders.forEach(order => {
        console.log(`  - ${order.action} ${order.orderQty} ${order.contractId} @ ${order.price || 'Market'} [${order.ordStatus}]`);
      });
    } else {
      console.log('\n📭 No active orders');
    }

    if (ordersData.positions.length > 0) {
      console.log(`\n📍 Open Positions (${ordersData.positions.length}):`);
      ordersData.positions.forEach(pos => {
        const pnl = pos.netPos * (latestQuotes[pos.contractId]?.last - pos.avgPrice || 0);
        console.log(`  - ${pos.netPos > 0 ? 'LONG' : 'SHORT'} ${Math.abs(pos.netPos)} @ ${pos.avgPrice.toFixed(2)} | P&L: $${pnl.toFixed(2)}`);
      });
    } else {
      console.log('\n📭 No open positions');
    }

    // Display chart with orders overlay
    console.log('\n' + '='.repeat(80));
    console.log('📊 CHART WITH ORDERS VISUALIZATION');
    console.log('='.repeat(80));
    
    if (chartData && chartData.bars && chartData.bars.length > 0) {
      displayChartWithOrders(chartData.bars.slice(-10), ordersData.orders, ordersData.positions);
    }

    // Keep streaming for 60 seconds
    console.log('\n⏱️  Streaming live data for 60 seconds...');
    console.log('Press Ctrl+C to stop\n');
    
    await new Promise(resolve => setTimeout(resolve, 60000));

    console.log('\n✅ Demo complete!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  } finally {
    marketData.disconnect();
    console.log('\n👋 Disconnected');
  }
}

/**
 * Display ASCII chart with orders overlay
 */
function displayChartWithOrders(bars, orders, positions) {
  if (!bars || bars.length === 0) {
    console.log('No chart data available');
    return;
  }

  const width = 60;
  const height = 15;
  
  // Find min/max prices
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  
  bars.forEach(bar => {
    minPrice = Math.min(minPrice, bar.low);
    maxPrice = Math.max(maxPrice, bar.high);
  });

  // Add some padding
  const padding = (maxPrice - minPrice) * 0.1;
  minPrice -= padding;
  maxPrice += padding;

  const priceRange = maxPrice - minPrice;
  
  // Create grid
  const grid = Array(height).fill(null).map(() => Array(width).fill(' '));

  // Plot bars
  bars.forEach((bar, idx) => {
    const x = Math.floor((idx / bars.length) * width);
    const openY = height - Math.floor(((bar.open - minPrice) / priceRange) * height);
    const closeY = height - Math.floor(((bar.close - minPrice) / priceRange) * height);
    const highY = height - Math.floor(((bar.high - minPrice) / priceRange) * height);
    const lowY = height - Math.floor(((bar.low - minPrice) / priceRange) * height);

    // Draw vertical line for high-low
    for (let y = Math.max(0, highY); y <= Math.min(height - 1, lowY); y++) {
      if (x < width) {
        grid[y][x] = '│';
      }
    }

    // Mark open and close
    if (openY >= 0 && openY < height && x < width) {
      grid[openY][x] = bar.close > bar.open ? '↑' : '↓';
    }
  });

  // Draw orders on chart
  orders.forEach(order => {
    if (order.price) {
      const orderY = height - Math.floor(((order.price - minPrice) / priceRange) * height);
      if (orderY >= 0 && orderY < height) {
        for (let x = 0; x < width; x++) {
          if (grid[orderY][x] === ' ') {
            grid[orderY][x] = order.action === 'Buy' ? 'B' : 'S';
          }
        }
      }
    }
  });

  // Draw positions
  positions.forEach(pos => {
    if (pos.avgPrice) {
      const posY = height - Math.floor(((pos.avgPrice - minPrice) / priceRange) * height);
      if (posY >= 0 && posY < height) {
        for (let x = 0; x < width; x++) {
          if (grid[posY][x] === ' ') {
            grid[posY][x] = pos.netPos > 0 ? 'L' : 'H';
          }
        }
      }
    }
  });

  // Print chart
  console.log(`\nPrice: ${maxPrice.toFixed(2)}`);
  grid.forEach(row => {
    console.log('  |' + row.join('') + '|');
  });
  console.log(`Price: ${minPrice.toFixed(2)}`);
  console.log('\nLegend: ↑=Bullish ↓=Bearish B=Buy Order S=Sell Order L=Long Position H=Short Position');
}

main().catch(console.error);
