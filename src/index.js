import MultiAccountManager from './MultiAccountManager.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load configuration from config.json
 */
function loadConfig() {
  try {
    const configPath = path.join(__dirname, '../config.json');
    
    if (!fs.existsSync(configPath)) {
      console.error('❌ config.json not found!');
      console.log('\n📝 Please create config.json from config.example.json:');
      console.log('   1. Copy config.example.json to config.json');
      console.log('   2. Fill in your Tradovate account credentials');
      console.log('   3. Run the script again\n');
      process.exit(1);
    }

    const configFile = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configFile);
  } catch (error) {
    console.error('Failed to load config:', error.message);
    process.exit(1);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║     TRADOVATE MULTI-ACCOUNT CONNECTION MANAGER    ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  // Load configuration
  const config = loadConfig();
  
  if (!config.accounts || config.accounts.length === 0) {
    console.error('❌ No accounts configured in config.json');
    process.exit(1);
  }

  console.log(`📋 Found ${config.accounts.length} account(s) in configuration`);
  console.log(`🌍 Environment: ${config.settings.isDemo ? 'DEMO' : 'LIVE'}\n`);

  // Create multi-account manager
  const manager = new MultiAccountManager(config.settings.isDemo);

  // Add all accounts
  manager.addAccounts(config.accounts);

  try {
    // Connect to all accounts
    await manager.connectAll();

    // Display account status
    await manager.printStatus();

    // Example: Get all positions
    console.log('\n=== Checking positions across all accounts ===\n');
    const allPositions = await manager.getAllPositions();
    
    if (allPositions.length === 0) {
      console.log('No open positions found in any account');
    } else {
      allPositions.forEach(({ accountName, positions }) => {
        console.log(`\n[${accountName}] has ${positions.length} position(s):`);
        positions.forEach(pos => {
          console.log(`  - Contract: ${pos.contractId}, NetPos: ${pos.netPos}`);
        });
      });
    }

    // Example: Get all orders
    console.log('\n=== Checking orders across all accounts ===\n');
    const allOrders = await manager.getAllOrders();
    
    if (allOrders.length === 0) {
      console.log('No active orders found in any account');
    } else {
      allOrders.forEach(({ accountName, orders }) => {
        console.log(`\n[${accountName}] has ${orders.length} order(s):`);
        orders.forEach(order => {
          console.log(`  - Order ID: ${order.id}, Action: ${order.action}, Qty: ${order.qty}`);
        });
      });
    }

    // Example: Place order on a specific account (commented out for safety)
    /*
    console.log('\n=== Placing order on specific account ===\n');
    const orderData = {
      action: 'Buy',
      symbol: 'MESM4',
      orderQty: 1,
      orderType: 'Limit',
      price: 5000
    };
    
    await manager.placeOrder('Account1', orderData);
    */

    // Example: Get client for specific account
    console.log('\n=== Working with specific account ===\n');
    const accountNames = manager.getAccountNames();
    
    if (accountNames.length > 0) {
      const firstAccount = accountNames[0];
      const client = manager.getClient(firstAccount);
      
      console.log(`Getting detailed info for: ${firstAccount}`);
      const balance = await client.getBalance();
      console.log(`Current balance: $${balance.cashBalance || 0}`);
    }

    console.log('\n✅ All operations completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Error occurred:', error.message);
    console.error(error);
  } finally {
    // Cleanup
    manager.disconnect();
  }
}

// Run the main function
main().catch(console.error);
