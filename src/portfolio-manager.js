import MultiAccountManager from './MultiAccountManager.js';
import {
  generateSummaryReport,
  printSummaryReport,
  getLowBalanceAccounts,
  getAccountsWithPositions,
  calculateRiskMetrics,
  formatCurrency,
  retryWithBackoff,
  logWithTimestamp
} from './utils.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Complete portfolio management example
 */

function loadConfig() {
  const configPath = path.join(__dirname, '../config.json');
  if (!fs.existsSync(configPath)) {
    console.error('config.json not found!');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

/**
 * Full portfolio analysis
 */
async function analyzePortfolio(manager) {
  logWithTimestamp('Starting portfolio analysis...');

  const summaries = await manager.getAllAccountsSummary();

  // Generate and print report
  const report = generateSummaryReport(summaries);
  printSummaryReport(report);

  // Detailed risk analysis
  console.log('📊 Detailed Risk Analysis:\n');
  summaries.forEach(summary => {
    const metrics = calculateRiskMetrics(summary);
    console.log(`[${summary.accountName}]`);
    console.log(`  Balance: ${formatCurrency(metrics.balance)}`);
    console.log(`  Exposure: ${metrics.exposure} contracts (${metrics.exposurePercent.toFixed(2)}%)`);
    console.log(`  Risk Level: ${metrics.riskLevel}`);
    console.log('');
  });

  // Alert on low balance accounts
  const lowBalanceAccounts = getLowBalanceAccounts(summaries, 5000);
  if (lowBalanceAccounts.length > 0) {
    console.log('⚠️  Low Balance Alerts:');
    lowBalanceAccounts.forEach(summary => {
      const balance = summary.balance?.cashBalance || 0;
      console.log(`  - ${summary.accountName}: ${formatCurrency(balance)}`);
    });
    console.log('');
  }

  // Show accounts with positions
  const accountsWithPositions = getAccountsWithPositions(summaries);
  if (accountsWithPositions.length > 0) {
    console.log('📈 Accounts with Open Positions:');
    accountsWithPositions.forEach(summary => {
      console.log(`  - ${summary.accountName}: ${summary.positions.length} position(s)`);
      summary.positions.forEach(pos => {
        console.log(`    • Contract ${pos.contractId}: ${pos.netPos} lots`);
      });
    });
    console.log('');
  }
}

/**
 * Automated monitoring loop
 */
async function monitoringLoop(manager, intervalSeconds = 60) {
  console.log(`\n🔄 Starting monitoring loop (interval: ${intervalSeconds}s)`);
  console.log('Press Ctrl+C to stop\n');

  let iteration = 1;

  const monitor = setInterval(async () => {
    try {
      console.log(`\n${'='.repeat(60)}`);
      logWithTimestamp(`Monitoring iteration #${iteration}`);
      console.log('='.repeat(60));

      // Renew tokens if needed
      await manager.renewAllTokens();

      // Get fresh data
      const summaries = await manager.getAllAccountsSummary();

      // Quick status
      console.log('\nQuick Status:');
      summaries.forEach(summary => {
        const balance = summary.balance?.cashBalance || 0;
        const positions = summary.positions?.length || 0;
        const orders = summary.orders?.length || 0;

        console.log(
          `  ${summary.accountName.padEnd(15)}: ` +
          `${formatCurrency(balance).padEnd(12)} | ` +
          `${positions} pos | ${orders} orders`
        );
      });

      // Alerts
      const lowBalance = getLowBalanceAccounts(summaries, 5000);
      if (lowBalance.length > 0) {
        console.log(`\n⚠️  ${lowBalance.length} account(s) with low balance!`);
      }

      iteration++;
    } catch (error) {
      console.error('Monitoring error:', error.message);
    }
  }, intervalSeconds * 1000);

  // Handle exit
  process.on('SIGINT', () => {
    console.log('\n\nStopping monitoring...');
    clearInterval(monitor);
    manager.disconnect();
    process.exit(0);
  });
}

/**
 * Batch operations with retry
 */
async function batchOperationsExample(manager) {
  console.log('\n=== Batch Operations with Retry ===\n');

  const accountNames = manager.getAccountNames();

  for (const accountName of accountNames) {
    const client = manager.getClient(accountName);

    try {
      // Example: Get balance with retry
      const balance = await retryWithBackoff(async () => {
        return await client.getBalance();
      }, 3, 1000);

      console.log(`✅ ${accountName}: ${formatCurrency(balance.cashBalance || 0)}`);
    } catch (error) {
      console.error(`❌ ${accountName}: Failed after retries - ${error.message}`);
    }
  }
}

/**
 * Export portfolio data to JSON
 */
async function exportPortfolioData(manager, filename = 'portfolio-snapshot.json') {
  logWithTimestamp('Exporting portfolio data...');

  const summaries = await manager.getAllAccountsSummary();
  const report = generateSummaryReport(summaries);

  const exportData = {
    timestamp: new Date().toISOString(),
    report: report,
    accounts: summaries.map(summary => ({
      accountName: summary.accountName,
      accountId: summary.accountId,
      balance: summary.balance?.cashBalance || 0,
      positions: summary.positions || [],
      orders: summary.orders || [],
      risk: calculateRiskMetrics(summary)
    }))
  };

  const outputPath = path.join(__dirname, '..', filename);
  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

  console.log(`✅ Portfolio data exported to: ${outputPath}\n`);
}

/**
 * Main function
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║       TRADOVATE PORTFOLIO MANAGEMENT TOOL          ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  const config = loadConfig();
  const manager = new MultiAccountManager(config.settings.isDemo);

  manager.addAccounts(config.accounts);

  try {
    // Connect
    await manager.connectAll();

    // Choose mode
    const args = process.argv.slice(2);
    const mode = args[0] || 'analyze';

    switch (mode) {
      case 'analyze':
        await analyzePortfolio(manager);
        break;

      case 'monitor':
        const interval = parseInt(args[1]) || 60;
        await analyzePortfolio(manager); // Initial analysis
        await monitoringLoop(manager, interval);
        break;

      case 'export':
        const filename = args[1] || 'portfolio-snapshot.json';
        await exportPortfolioData(manager, filename);
        break;

      case 'batch':
        await batchOperationsExample(manager);
        break;

      default:
        console.log('Unknown mode. Available modes:');
        console.log('  - analyze (default): Run portfolio analysis');
        console.log('  - monitor [seconds]: Start monitoring loop');
        console.log('  - export [filename]: Export portfolio data');
        console.log('  - batch: Run batch operations');
    }

    if (mode !== 'monitor') {
      manager.disconnect();
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    manager.disconnect();
  }
}

// Run
main().catch(console.error);
