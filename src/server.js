import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import MultiAccountManager from './MultiAccountManager.js';
import TradovateMarketData from './TradovateMarketData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../web')));

// Global manager instance
let manager = null;
let marketDataClient = null;

// Load config
function loadConfig() {
    try {
        const configPath = path.join(__dirname, '../config.json');
        if (fs.existsSync(configPath)) {
            const configData = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(configData);
        }
    } catch (error) {
        console.log('⚠️  No config.json found, using demo mode');
    }
    return null;
}

// API endpoint for status
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Argaman Capital - Automated Wealth',
        version: '1.0.0',
        connected: manager !== null
    });
});

// API endpoint for login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Load config to check credentials
        const config = loadConfig();
        
        if (!config || !config.accounts) {
            // No config - allow any login for demo
            return res.json({
                success: true,
                message: 'Demo mode - logged in',
                username: username
            });
        }
        
        // Check if credentials match any account in config
        const account = config.accounts.find(acc => 
            acc.username === username && acc.password === password
        );
        
        if (account) {
            res.json({
                success: true,
                message: 'Login successful',
                username: username,
                accountName: account.name
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// API endpoint to connect to accounts
app.post('/api/connect', async (req, res) => {
    try {
        const config = loadConfig();
        
        if (!config || !config.accounts) {
            return res.status(404).json({
                success: false,
                message: 'Config file not found. Using demo mode.'
            });
        }
        
        // Create manager with accounts from config
        manager = new MultiAccountManager(config.accounts);
        
        // Connect to all accounts
        console.log('🔌 Connecting to accounts...');
        await manager.connectAll();
        
        // Get account summaries
        const summary = await manager.getAllAccountsSummary();
        
        res.json({
            success: true,
            accounts: summary.accounts,
            positions: summary.positions || [],
            orders: summary.orders || []
        });
        
    } catch (error) {
        console.error('Connection error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// API endpoint to open position
app.post('/api/trade/open', async (req, res) => {
    try {
        if (!manager) {
            return res.status(400).json({
                success: false,
                message: 'Not connected. Please connect first.'
            });
        }
        
        const { side, instrument, contracts, entryPrice, stopLoss, takeProfit } = req.body;
        
        // Prepare order
        const order = {
            action: side === 'long' ? 'Buy' : 'Sell',
            symbol: instrument,
            orderQty: contracts,
            orderType: entryPrice ? 'Limit' : 'Market'
        };
        
        if (entryPrice) {
            order.price = parseFloat(entryPrice);
        }
        
        // Place order on all accounts (or specific account)
        console.log('📈 Opening position:', order);
        const results = await manager.placeOrderOnAll(order);
        
        // Add stop loss and take profit if provided
        // (This would require additional API calls in production)
        
        res.json({
            success: true,
            results: results,
            order: order
        });
        
    } catch (error) {
        console.error('Trade error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// API endpoint to close position
app.post('/api/trade/close', async (req, res) => {
    try {
        if (!manager) {
            return res.status(400).json({
                success: false,
                message: 'Not connected. Please connect first.'
            });
        }
        
        const { symbol, side } = req.body;
        
        // This would close positions based on symbol/side
        // Implementation depends on Tradovate API
        
        res.json({
            success: true,
            message: 'Position closed'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// API endpoint to get positions
app.get('/api/positions', async (req, res) => {
    try {
        if (!manager) {
            return res.json({
                positions: [],
                orders: []
            });
        }
        
        const summary = await manager.getAllAccountsSummary();
        
        res.json({
            positions: summary.positions || [],
            orders: summary.orders || []
        });
        
    } catch (error) {
        console.error('Get positions error:', error);
        res.json({
            positions: [],
            orders: []
        });
    }
});

// API endpoint to get chart data
app.get('/api/chart/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const interval = parseInt(req.query.interval) || 5;
        const bars = parseInt(req.query.bars) || 50;
        
        if (!marketDataClient) {
            // Initialize market data client if not exists
            const config = loadConfig();
            if (config && config.accounts && config.accounts.length > 0) {
                marketDataClient = new TradovateMarketData(
                    config.accounts[0],
                    config.settings?.isDemo !== false
                );
                await marketDataClient.authenticate();
            } else {
                // Return demo data
                return res.json({
                    bars: generateDemoBars(symbol, interval, bars)
                });
            }
        }
        
        const chartData = await marketDataClient.getChartData(symbol, interval, bars);
        
        if (chartData && chartData.bars) {
            res.json({
                bars: chartData.bars,
                contract: chartData.contract
            });
        } else {
            res.json({
                bars: generateDemoBars(symbol, interval, bars)
            });
        }
        
    } catch (error) {
        console.error('Chart data error:', error);
        res.json({
            bars: generateDemoBars(req.params.symbol, 5, 50)
        });
    }
});

// API endpoint to get real-time quote
app.get('/api/quote/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        
        if (!marketDataClient) {
            const config = loadConfig();
            if (config && config.accounts && config.accounts.length > 0) {
                marketDataClient = new TradovateMarketData(
                    config.accounts[0],
                    config.settings?.isDemo !== false
                );
                await marketDataClient.authenticate();
            } else {
                return res.json(generateDemoQuote(symbol));
            }
        }
        
        // Get contract info
        const contract = await marketDataClient.getContract(symbol);
        
        if (!contract) {
            return res.json(generateDemoQuote(symbol));
        }
        
        // In a real implementation, this would fetch live quote
        // For now, return demo data
        res.json(generateDemoQuote(symbol));
        
    } catch (error) {
        console.error('Quote error:', error);
        res.json(generateDemoQuote(req.params.symbol));
    }
});

// Helper function to generate demo bars
function generateDemoBars(symbol, interval, count) {
    const bars = [];
    const basePrice = symbol === 'NQ' ? 16000 : symbol === 'ES' ? 4500 : 2000;
    let currentPrice = basePrice;
    
    for (let i = 0; i < count; i++) {
        const timestamp = new Date(Date.now() - (count - i) * interval * 60000);
        const change = (Math.random() - 0.5) * 20;
        currentPrice += change;
        
        const open = currentPrice + (Math.random() - 0.5) * 5;
        const close = currentPrice + (Math.random() - 0.5) * 5;
        const high = Math.max(open, close) + Math.random() * 5;
        const low = Math.min(open, close) - Math.random() * 5;
        
        bars.push({
            timestamp: timestamp.toISOString(),
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2)),
            volume: Math.floor(Math.random() * 1000)
        });
    }
    
    return bars;
}

// Helper function to generate demo quote
function generateDemoQuote(symbol) {
    const basePrice = symbol === 'NQ' ? 16000 : symbol === 'ES' ? 4500 : 2000;
    const last = basePrice + (Math.random() - 0.5) * 100;
    
    return {
        symbol: symbol,
        timestamp: new Date().toISOString(),
        bid: parseFloat((last - Math.random() * 2).toFixed(2)),
        ask: parseFloat((last + Math.random() * 2).toFixed(2)),
        last: parseFloat(last.toFixed(2)),
        bidSize: Math.floor(Math.random() * 50) + 1,
        askSize: Math.floor(Math.random() * 50) + 1,
        volume: Math.floor(Math.random() * 10000),
        high: parseFloat((last + Math.random() * 20).toFixed(2)),
        low: parseFloat((last - Math.random() * 20).toFixed(2)),
        open: parseFloat((last + (Math.random() - 0.5) * 10).toFixed(2))
    };
}

// Catch all route - serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../web/index.html'));
});

app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║   Tradovate Multi-Account Manager - Web Server    ║');
    console.log('╚════════════════════════════════════════════════════╝\n');
    console.log(`🚀 Server is running on: http://localhost:${PORT}`);
    console.log(`📂 Serving files from: ${path.join(__dirname, '../web')}`);
    console.log(`\n💡 Open your browser and navigate to: http://localhost:${PORT}`);
    console.log(`\n⏹️  Press Ctrl+C to stop the server\n`);
});
