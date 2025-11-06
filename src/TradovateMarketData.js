import TradovateClient from './TradovateClient.js';
import WebSocket from 'ws';

/**
 * Handles real-time market data from Tradovate API
 * Extends TradovateClient to add WebSocket streaming capabilities
 */
class TradovateMarketData extends TradovateClient {
  constructor(accountConfig, isDemo = true) {
    super(accountConfig, isDemo);
    
    // WebSocket URL based on environment
    this.wsUrl = isDemo 
      ? 'wss://demo.tradovateapi.com/v1/websocket'
      : 'wss://live.tradovateapi.com/v1/websocket';
    
    this.ws = null;
    this.subscriptions = new Map();
    this.chartCallbacks = new Map();
    this.isConnected = false;
  }

  /**
   * Connect to Tradovate WebSocket for real-time data
   */
  async connectWebSocket() {
    // First authenticate via REST API
    await this.authenticate();
    
    return new Promise((resolve, reject) => {
      console.log(`[${this.accountName}] Connecting to WebSocket...`);
      
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.on('open', () => {
        console.log(`[${this.accountName}] ✅ WebSocket connected`);
        
        // Authorize WebSocket with market data token
        this.ws.send(JSON.stringify({
          op: 'authorize',
          data: {
            mdAccessToken: this.mdAccessToken
          }
        }));
        
        this.isConnected = true;
        resolve();
      });

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(message);
        } catch (error) {
          console.error(`[${this.accountName}] Failed to parse message:`, error);
        }
      });

      this.ws.on('error', (error) => {
        console.error(`[${this.accountName}] ❌ WebSocket error:`, error.message);
        this.isConnected = false;
        reject(error);
      });

      this.ws.on('close', () => {
        console.log(`[${this.accountName}] 🔌 WebSocket disconnected`);
        this.isConnected = false;
      });
    });
  }

  /**
   * Subscribe to real-time quote updates for a symbol
   * @param {string} symbol - Contract symbol (e.g., 'NQH5', 'ESM5')
   * @param {function} callback - Function to call with quote updates
   */
  async subscribeToQuote(symbol, callback) {
    try {
      const contract = await this.getContract(symbol);
      
      if (!contract) {
        console.error(`[${this.accountName}] Contract ${symbol} not found`);
        return null;
      }

      console.log(`[${this.accountName}] 📊 Subscribing to ${symbol} (ID: ${contract.id})`);
      
      this.subscriptions.set(contract.id, {
        symbol: contract.name,
        callback: callback
      });
      
      this.ws.send(JSON.stringify({
        op: 'md/subscribeQuote',
        data: {
          symbol: contract.name
        }
      }));

      return contract;
    } catch (error) {
      console.error(`[${this.accountName}] Failed to subscribe to ${symbol}:`, error.message);
      return null;
    }
  }

  /**
   * Subscribe to chart/histogram data (real-time bars)
   * @param {string} symbol - Contract symbol
   * @param {number} interval - Bar interval in minutes (1, 5, 15, etc.)
   * @param {function} callback - Function to call with bar updates
   */
  async subscribeToChart(symbol, interval = 1, callback) {
    try {
      const contract = await this.getContract(symbol);
      
      if (!contract) {
        console.error(`[${this.accountName}] Contract ${symbol} not found`);
        return null;
      }

      console.log(`[${this.accountName}] 📈 Subscribing to ${symbol} chart (${interval}min bars)`);
      
      const key = `${contract.id}_${interval}`;
      this.chartCallbacks.set(key, {
        symbol: contract.name,
        interval: interval,
        callback: callback
      });
      
      this.ws.send(JSON.stringify({
        op: 'md/subscribeHistogram',
        data: {
          symbol: contract.name,
          chartDescription: {
            underlyingType: 'MinuteBar',
            elementSize: interval,
            elementSizeUnit: 'UnderlyingUnits'
          }
        }
      }));

      return contract;
    } catch (error) {
      console.error(`[${this.accountName}] Failed to subscribe to chart:`, error.message);
      return null;
    }
  }

  /**
   * Get contract information by symbol
   * @param {string} symbol - Symbol to search for (e.g., 'NQ', 'ES', 'GC')
   */
  async getContract(symbol) {
    try {
      const response = await this.api.get(`/contract/suggest`, {
        params: { text: symbol }
      });
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      
      return null;
    } catch (error) {
      console.error(`[${this.accountName}] Failed to get contract ${symbol}:`, error.message);
      return null;
    }
  }

  /**
   * Get historical chart data
   * @param {string} symbol - Contract symbol
   * @param {number} interval - Bar interval in minutes
   * @param {number} bars - Number of bars to retrieve
   */
  async getChartData(symbol, interval = 1, bars = 100) {
    try {
      const contract = await this.getContract(symbol);
      
      if (!contract) {
        return null;
      }

      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - bars * interval * 60000);
      
      const response = await this.api.get('/md/getChart', {
        params: {
          symbol: contract.name,
          chartDescription: JSON.stringify({
            underlyingType: 'MinuteBar',
            elementSize: interval,
            elementSizeUnit: 'UnderlyingUnits'
          }),
          timeRange: JSON.stringify({
            closestTimestamp: endTime.toISOString(),
            asFarAsTimestamp: startTime.toISOString()
          })
        }
      });
      
      return {
        contract: contract,
        bars: response.data.bars || [],
        eoh: response.data.eoh
      };
    } catch (error) {
      console.error(`[${this.accountName}] Failed to get chart data:`, error.message);
      return null;
    }
  }

  /**
   * Get current orders and positions for chart overlay
   */
  async getOrdersForChart() {
    try {
      const [orders, positions] = await Promise.all([
        this.getOrders(),
        this.getPositions()
      ]);

      return {
        orders: orders || [],
        positions: positions || []
      };
    } catch (error) {
      console.error(`[${this.accountName}] Failed to get orders/positions:`, error.message);
      return { orders: [], positions: [] };
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleMessage(message) {
    // Market data quote updates
    if (message.e === 'md' && message.d && message.d.quotes) {
      message.d.quotes.forEach(quote => {
        const subscription = this.subscriptions.get(quote.contractId);
        if (subscription) {
          subscription.callback({
            symbol: subscription.symbol,
            contractId: quote.contractId,
            timestamp: new Date(quote.timestamp),
            bid: quote.bid,
            ask: quote.ask,
            last: quote.last,
            bidSize: quote.bidSize,
            askSize: quote.askSize,
            volume: quote.totalVolume,
            high: quote.high,
            low: quote.low,
            open: quote.open
          });
        }
      });
    }

    // Chart/histogram updates
    if (message.e === 'md' && message.d && message.d.histograms) {
      message.d.histograms.forEach(histogram => {
        this.chartCallbacks.forEach((subscription, key) => {
          if (subscription.symbol === histogram.symbol) {
            subscription.callback({
              symbol: histogram.symbol,
              timestamp: new Date(histogram.timestamp),
              bars: histogram.bars || []
            });
          }
        });
      });
    }

    // Authorization confirmation
    if (message.s === 200 && message.i === 'authorize') {
      console.log(`[${this.accountName}] ✅ WebSocket authorized`);
    }
  }

  /**
   * Unsubscribe from quote updates
   */
  unsubscribeFromQuote(symbol) {
    this.subscriptions.forEach((subscription, contractId) => {
      if (subscription.symbol === symbol) {
        this.ws.send(JSON.stringify({
          op: 'md/unsubscribeQuote',
          data: { symbol: symbol }
        }));
        this.subscriptions.delete(contractId);
        console.log(`[${this.accountName}] Unsubscribed from ${symbol}`);
      }
    });
  }

  /**
   * Close WebSocket connection
   */
  closeWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  /**
   * Close all connections
   */
  disconnect() {
    this.closeWebSocket();
  }
}

export default TradovateMarketData;
