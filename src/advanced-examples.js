import MultiAccountManager from './MultiAccountManager.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Advanced example: Custom strategies across multiple accounts
 */

// Load config
function loadConfig() {
  const configPath = path.join(__dirname, '../config.json');
  if (!fs.existsSync(configPath)) {
    console.error('config.json not found!');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

/**
 * Example 1: Monitor all accounts and alert on specific conditions
 */
async function monitorAccounts(manager) {
  console.log('\n=== Account Monitoring Example ===\n');

  const summaries = await manager.getAllAccountsSummary();

  summaries.forEach(summary => {
    const balance = summary.balance?.cashBalance || 0;
    const positions = summary.positions?.length || 0;
    const orders = summary.orders?.length || 0;

    console.log(`\n[${summary.accountName}]`);
    console.log(`  Balance: $${balance}`);
    console.log(`  Positions: ${positions}`);
    console.log(`  Orders: ${orders}`);

    // Alert conditions
    if (balance < 5000) {
      console.log(`  ⚠️  WARNING: Low balance!`);
    }

    if (positions > 5) {
      console.log(`  ⚠️  WARNING: Many open positions!`);
    }
  });
}

/**
 * Example 2: Execute custom function on all accounts
 */
async function customOperation(manager) {
  console.log('\n=== Custom Operation Example ===\n');

  const results = await manager.executeOnAll(async (client) => {
    // Your custom logic here
    const accountInfo = await client.getAccountInfo();
    const positions = await client.getPositions();
    
    return {
      accountName: accountInfo.name,
      balance: accountInfo.cashBalance,
      positionCount: positions.length
    };
  });

  console.log('Results from all accounts:');
  results.forEach(result => {
    if (result.status === 'fulfilled' && result.value.success) {
      console.log(`\n${result.value.accountName}:`, result.value.result);
    }
  });
}

/**
 * Example 3: Synchronized order placement
 */
async function synchronizedOrders(manager) {
  console.log('\n=== Synchronized Order Placement Example ===\n');
  console.log('This example shows how to place orders on all accounts at once');
  console.log('(Commented out for safety)\n');

  /*
  const orderData = {
    action: 'Buy',
    symbol: 'MESM4',
    orderQty: 1,
    orderType: 'Market'
  };

  console.log('Placing orders on all accounts...');
  const results = await manager.placeOrderOnAll(orderData);

  results.forEach(result => {
    if (result.status === 'fulfilled') {
      if (result.value.success) {
        console.log(`✅ ${result.value.accountName}: Order placed successfully`);
      } else {
        console.log(`❌ ${result.value.accountName}: ${result.value.error}`);
      }
    }
  });
  */
}

/**
 * Example 4: Account comparison and analysis
 */
async function compareAccounts(manager) {
  console.log('\n=== Account Comparison Example ===\n');

  const summaries = await manager.getAllAccountsSummary();

  // Calculate statistics
  const stats = {
    totalBalance: 0,
    totalPositions: 0,
    totalOrders: 0,
    accounts: []
  };

  summaries.forEach(summary => {
    const balance = summary.balance?.cashBalance || 0;
    const positions = summary.positions?.length || 0;
    const orders = summary.orders?.length || 0;

    stats.totalBalance += balance;
    stats.totalPositions += positions;
    stats.totalOrders += orders;

    stats.accounts.push({
      name: summary.accountName,
      balance,
      positions,
      orders
    });
  });

  // Display comparison
  console.log('Account Comparison:');
  console.log('─'.repeat(70));
  console.log(`${'Account'.padEnd(20)} | ${'Balance'.padEnd(15)} | ${'Positions'.padEnd(10)} | Orders`);
  console.log('─'.repeat(70));

  stats.accounts.forEach(acc => {
    console.log(
      `${acc.name.padEnd(20)} | $${acc.balance.toFixed(2).padEnd(14)} | ${acc.positions.toString().padEnd(10)} | ${acc.orders}`
    );
  });

  console.log('─'.repeat(70));
  console.log(`${'TOTAL'.padEnd(20)} | $${stats.totalBalance.toFixed(2).padEnd(14)} | ${stats.totalPositions.toString().padEnd(10)} | ${stats.totalOrders}`);
  console.log('═'.repeat(70));
}

/**
 * Example 5: Risk management across accounts
 */
async function riskManagement(manager) {
  console.log('\n=== Risk Management Example ===\n');

  const summaries = await manager.getAllAccountsSummary();

  summaries.forEach(summary => {
    const balance = summary.balance?.cashBalance || 0;
    const positions = summary.positions || [];

    console.log(`\n[${summary.accountName}] Risk Analysis:`);
    console.log(`  Account Balance: $${balance}`);
    console.log(`  Open Positions: ${positions.length}`);

    if (positions.length > 0) {
      let totalExposure = 0;
      positions.forEach(pos => {
        // Calculate exposure (this is simplified, adjust based on your needs)
        const exposure = Math.abs(pos.netPos || 0);
        totalExposure += exposure;
      });

      const exposurePercent = (totalExposure / balance * 100).toFixed(2);
      console.log(`  Total Exposure: ${totalExposure} contracts`);
      console.log(`  Exposure/Balance: ${exposurePercent}%`);

      // Risk alerts
      if (exposurePercent > 50) {
        console.log(`  🔴 HIGH RISK: Exposure exceeds 50% of balance!`);
      } else if (exposurePercent > 30) {
        console.log(`  🟡 MEDIUM RISK: Exposure is 30-50% of balance`);
      } else {
        console.log(`  🟢 LOW RISK: Exposure is under 30% of balance`);
      }
    } else {
      console.log(`  🟢 NO POSITIONS: No current exposure`);
    }
  });
}

/**
 * Main function
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║   TRADOVATE MULTI-ACCOUNT - ADVANCED EXAMPLES     ║');
  console.log('╚════════════════════════════════════════════════════╝');

  const config = loadConfig();
  const manager = new MultiAccountManager(config.settings.isDemo);

  manager.addAccounts(config.accounts);

  try {
    // Connect to all accounts
    await manager.connectAll();

    // Run examples
    await monitorAccounts(manager);
    await customOperation(manager);
    await compareAccounts(manager);
    await riskManagement(manager);
    await synchronizedOrders(manager);

    console.log('\n✅ All advanced examples completed!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    manager.disconnect();
  }
}

// Run
main().catch(console.error);
