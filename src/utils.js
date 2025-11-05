/**
 * Utility functions for Tradovate multi-account management
 */

/**
 * Format currency value
 */
export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercent(value, decimals = 2) {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate percentage change
 */
export function calculatePercentChange(oldValue, newValue) {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Sleep/delay function
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}

/**
 * Calculate total P&L from positions
 */
export function calculateTotalPnL(positions) {
  if (!positions || positions.length === 0) return 0;
  
  return positions.reduce((total, pos) => {
    return total + (pos.netPnL || 0);
  }, 0);
}

/**
 * Group accounts by balance range
 */
export function groupAccountsByBalance(summaries) {
  const groups = {
    small: [],    // < $10,000
    medium: [],   // $10,000 - $50,000
    large: []     // > $50,000
  };

  summaries.forEach(summary => {
    const balance = summary.balance?.cashBalance || 0;
    
    if (balance < 10000) {
      groups.small.push(summary);
    } else if (balance < 50000) {
      groups.medium.push(summary);
    } else {
      groups.large.push(summary);
    }
  });

  return groups;
}

/**
 * Find accounts with specific conditions
 */
export function findAccountsWithCondition(summaries, condition) {
  return summaries.filter(condition);
}

/**
 * Get accounts with low balance
 */
export function getLowBalanceAccounts(summaries, threshold = 5000) {
  return findAccountsWithCondition(summaries, summary => {
    const balance = summary.balance?.cashBalance || 0;
    return balance < threshold;
  });
}

/**
 * Get accounts with open positions
 */
export function getAccountsWithPositions(summaries) {
  return findAccountsWithCondition(summaries, summary => {
    return summary.positions && summary.positions.length > 0;
  });
}

/**
 * Get accounts with pending orders
 */
export function getAccountsWithOrders(summaries) {
  return findAccountsWithCondition(summaries, summary => {
    return summary.orders && summary.orders.length > 0;
  });
}

/**
 * Calculate risk metrics
 */
export function calculateRiskMetrics(summary) {
  const balance = summary.balance?.cashBalance || 0;
  const positions = summary.positions || [];
  
  if (positions.length === 0) {
    return {
      balance,
      exposure: 0,
      exposurePercent: 0,
      positionCount: 0,
      avgPositionSize: 0,
      riskLevel: 'NONE'
    };
  }

  const totalExposure = positions.reduce((sum, pos) => {
    return sum + Math.abs(pos.netPos || 0);
  }, 0);

  const exposurePercent = balance > 0 ? (totalExposure / balance) * 100 : 0;
  const avgPositionSize = totalExposure / positions.length;

  let riskLevel = 'LOW';
  if (exposurePercent > 50) riskLevel = 'HIGH';
  else if (exposurePercent > 30) riskLevel = 'MEDIUM';

  return {
    balance,
    exposure: totalExposure,
    exposurePercent,
    positionCount: positions.length,
    avgPositionSize,
    riskLevel
  };
}

/**
 * Generate summary report
 */
export function generateSummaryReport(summaries) {
  const report = {
    totalAccounts: summaries.length,
    totalBalance: 0,
    totalPositions: 0,
    totalOrders: 0,
    accountsWithPositions: 0,
    accountsWithOrders: 0,
    lowBalanceAccounts: 0,
    averageBalance: 0,
    riskDistribution: {
      none: 0,
      low: 0,
      medium: 0,
      high: 0
    }
  };

  summaries.forEach(summary => {
    const balance = summary.balance?.cashBalance || 0;
    const positions = summary.positions?.length || 0;
    const orders = summary.orders?.length || 0;

    report.totalBalance += balance;
    report.totalPositions += positions;
    report.totalOrders += orders;

    if (positions > 0) report.accountsWithPositions++;
    if (orders > 0) report.accountsWithOrders++;
    if (balance < 5000) report.lowBalanceAccounts++;

    const risk = calculateRiskMetrics(summary);
    report.riskDistribution[risk.riskLevel.toLowerCase()]++;
  });

  report.averageBalance = report.totalBalance / report.totalAccounts;

  return report;
}

/**
 * Print summary report
 */
export function printSummaryReport(report) {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║              PORTFOLIO SUMMARY REPORT              ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  console.log('📊 Account Overview:');
  console.log(`   Total Accounts: ${report.totalAccounts}`);
  console.log(`   Total Balance: ${formatCurrency(report.totalBalance)}`);
  console.log(`   Average Balance: ${formatCurrency(report.averageBalance)}`);
  console.log(`   Low Balance Accounts: ${report.lowBalanceAccounts}`);

  console.log('\n📈 Trading Activity:');
  console.log(`   Total Open Positions: ${report.totalPositions}`);
  console.log(`   Total Active Orders: ${report.totalOrders}`);
  console.log(`   Accounts with Positions: ${report.accountsWithPositions}`);
  console.log(`   Accounts with Orders: ${report.accountsWithOrders}`);

  console.log('\n⚠️  Risk Distribution:');
  console.log(`   No Risk: ${report.riskDistribution.none} accounts`);
  console.log(`   Low Risk: ${report.riskDistribution.low} accounts`);
  console.log(`   Medium Risk: ${report.riskDistribution.medium} accounts`);
  console.log(`   High Risk: ${report.riskDistribution.high} accounts`);

  console.log('\n' + '═'.repeat(50) + '\n');
}

/**
 * Validate account configuration
 */
export function validateAccountConfig(config) {
  const required = ['accountName', 'username', 'password', 'appId', 'appVersion', 'cid', 'sec'];
  const missing = [];

  required.forEach(field => {
    if (!config[field]) {
      missing.push(field);
    }
  });

  if (missing.length > 0) {
    throw new Error(`Missing required fields in account config: ${missing.join(', ')}`);
  }

  return true;
}

/**
 * Safe JSON parse
 */
export function safeJsonParse(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('Failed to parse JSON:', error.message);
    return defaultValue;
  }
}

/**
 * Get timestamp string
 */
export function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

/**
 * Log with timestamp
 */
export function logWithTimestamp(message, level = 'INFO') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

export default {
  formatCurrency,
  formatPercent,
  calculatePercentChange,
  sleep,
  retryWithBackoff,
  calculateTotalPnL,
  groupAccountsByBalance,
  findAccountsWithCondition,
  getLowBalanceAccounts,
  getAccountsWithPositions,
  getAccountsWithOrders,
  calculateRiskMetrics,
  generateSummaryReport,
  printSummaryReport,
  validateAccountConfig,
  safeJsonParse,
  getTimestamp,
  formatTimestamp,
  logWithTimestamp
};
