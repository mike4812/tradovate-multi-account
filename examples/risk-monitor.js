/**
 * Risk Monitoring Example
 * 
 * Monitors risk levels across all accounts and sends alerts.
 * Run: node examples/risk-monitor.js
 */

import MultiAccountManager from '../src/MultiAccountManager.js';
import { calculateRiskMetrics, formatCurrency } from '../src/utils.js';
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

// Risk thresholds
const RISK_THRESHOLDS = {
  LOW_BALANCE: 5000,
  HIGH_EXPOSURE_PERCENT: 50,
  MEDIUM_EXPOSURE_PERCENT: 30,
  MAX_POSITIONS: 5
};

function checkRiskAlerts(summary) {
  const alerts = [];
  const balance = summary.balance?.cashBalance || 0;
  const positions = summary.positions || [];
  const risk = calculateRiskMetrics(summary);

  // Low balance alert
  if (balance < RISK_THRESHOLDS.LOW_BALANCE) {
    alerts.push({
      severity: 'HIGH',
      type: 'LOW_BALANCE',
      message: `Balance below ${formatCurrency(RISK_THRESHOLDS.LOW_BALANCE)}: ${formatCurrency(balance)}`
    });
  }

  // High exposure alert
  if (risk.exposurePercent > RISK_THRESHOLDS.HIGH_EXPOSURE_PERCENT) {
    alerts.push({
      severity: 'HIGH',
      type: 'HIGH_EXPOSURE',
      message: `Exposure at ${risk.exposurePercent.toFixed(2)}% (threshold: ${RISK_THRESHOLDS.HIGH_EXPOSURE_PERCENT}%)`
    });
  } else if (risk.exposurePercent > RISK_THRESHOLDS.MEDIUM_EXPOSURE_PERCENT) {
    alerts.push({
      severity: 'MEDIUM',
      type: 'MEDIUM_EXPOSURE',
      message: `Exposure at ${risk.exposurePercent.toFixed(2)}% (threshold: ${RISK_THRESHOLDS.MEDIUM_EXPOSURE_PERCENT}%)`
    });
  }

  // Too many positions alert
  if (positions.length > RISK_THRESHOLDS.MAX_POSITIONS) {
    alerts.push({
      severity: 'MEDIUM',
      type: 'MANY_POSITIONS',
      message: `${positions.length} open positions (max recommended: ${RISK_THRESHOLDS.MAX_POSITIONS})`
    });
  }

  return alerts;
}

function printAlert(accountName, alert) {
  const icon = alert.severity === 'HIGH' ? '🔴' : '🟡';
  console.log(`${icon} [${accountName}] ${alert.type}: ${alert.message}`);
}

async function monitorRisk(manager) {
  console.log('\n' + '═'.repeat(60));
  console.log(`Risk Check at ${new Date().toLocaleString()}`);
  console.log('═'.repeat(60) + '\n');

  const summaries = await manager.getAllAccountsSummary();
  let totalAlerts = 0;

  summaries.forEach(summary => {
    const alerts = checkRiskAlerts(summary);
    
    if (alerts.length > 0) {
      console.log(`\n[${summary.accountName}] - ${alerts.length} Alert(s)`);
      alerts.forEach(alert => printAlert(summary.accountName, alert));
      totalAlerts += alerts.length;
    } else {
      console.log(`\n[${summary.accountName}] - 🟢 All Clear`);
    }

    // Show metrics
    const risk = calculateRiskMetrics(summary);
    console.log(`  Balance: ${formatCurrency(risk.balance)}`);
    console.log(`  Positions: ${risk.positionCount}`);
    console.log(`  Exposure: ${risk.exposurePercent.toFixed(2)}%`);
    console.log(`  Risk Level: ${risk.riskLevel}`);
  });

  console.log('\n' + '─'.repeat(60));
  console.log(`Total Alerts: ${totalAlerts}`);
  
  if (totalAlerts === 0) {
    console.log('✅ All accounts within acceptable risk levels');
  } else {
    console.log('⚠️  Please review accounts with alerts');
  }
  console.log('─'.repeat(60) + '\n');
}

async function main() {
  console.log('🛡️  Risk Monitoring System\n');

  const config = loadConfig();
  const manager = new MultiAccountManager(config.settings.isDemo);
  manager.addAccounts(config.accounts);

  try {
    await manager.connectAll();

    // Check once
    await monitorRisk(manager);

    // Optionally: continuous monitoring
    const shouldMonitorContinuously = process.argv.includes('--continuous');
    
    if (shouldMonitorContinuously) {
      console.log('\n🔄 Starting continuous monitoring (every 60 seconds)');
      console.log('Press Ctrl+C to stop\n');

      setInterval(async () => {
        try {
          await manager.renewAllTokens();
          await monitorRisk(manager);
        } catch (error) {
          console.error('Error during monitoring:', error.message);
        }
      }, 60000);

      // Keep process running
      process.on('SIGINT', () => {
        console.log('\n\nStopping monitoring...');
        manager.disconnect();
        process.exit(0);
      });
    } else {
      manager.disconnect();
      console.log('\nTip: Run with --continuous flag for continuous monitoring');
    }

  } catch (error) {
    console.error('Error:', error.message);
    manager.disconnect();
  }
}

main().catch(console.error);
