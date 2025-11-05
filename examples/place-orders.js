/**
 * Order Placement Example
 * 
 * Shows how to place orders on specific accounts or all accounts.
 * Run: node examples/place-orders.js
 */

import MultiAccountManager from '../src/MultiAccountManager.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadConfig() {
  const configPath = path.join(__dirname, '../config.json');
  if (!fs.existsSync(configPath)) {
    console.error('config.json not found!');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

async function main() {
  console.log('📊 Order Placement Example\n');

  const config = loadConfig();
  const manager = new MultiAccountManager(config.settings.isDemo);
  manager.addAccounts(config.accounts);

  try {
    await manager.connectAll();

    // Example 1: Place order on specific account
    console.log('\n=== Example 1: Order on Specific Account ===');
    
    const accountName = manager.getAccountNames()[0];
    console.log(`Placing order on: ${accountName}`);

    // Uncomment to actually place order:
    /*
    const orderData = {
      action: 'Buy',
      symbol: 'MESM4',
      orderQty: 1,
      orderType: 'Limit',
      price: 5000
    };
    
    const result = await manager.placeOrder(accountName, orderData);
    console.log('Order placed:', result);
    */

    console.log('(Order placement is commented out for safety)');

    // Example 2: Place order on all accounts
    console.log('\n=== Example 2: Order on All Accounts ===');
    console.log('This would place the same order on all accounts');

    // Uncomment to actually place orders:
    /*
    const multiOrderData = {
      action: 'Buy',
      symbol: 'MESM4',
      orderQty: 1,
      orderType: 'Market'
    };
    
    const results = await manager.placeOrderOnAll(multiOrderData);
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log(`${result.value.accountName}: ${result.value.success ? '✅' : '❌'}`);
      }
    });
    */

    console.log('(Multi-order placement is commented out for safety)');

    // Show current orders
    console.log('\n=== Current Orders ===');
    const allOrders = await manager.getAllOrders();
    
    if (allOrders.length === 0) {
      console.log('No active orders');
    } else {
      allOrders.forEach(({ accountName, orders }) => {
        console.log(`\n[${accountName}]:`);
        orders.forEach(order => {
          console.log(`  Order ${order.id}: ${order.action} ${order.orderQty} @ ${order.orderType}`);
        });
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    manager.disconnect();
  }
}

main().catch(console.error);
