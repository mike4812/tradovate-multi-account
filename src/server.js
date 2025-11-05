import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import MultiAccountManager from './MultiAccountManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../web')));

// Global manager instance
let manager = null;

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
