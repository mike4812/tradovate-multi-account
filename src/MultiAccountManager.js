import TradovateClient from './TradovateClient.js';

/**
 * Multi-Account Manager for Tradovate
 * Manages multiple Tradovate accounts simultaneously
 */
class MultiAccountManager {
  constructor(isDemo = true) {
    this.isDemo = isDemo;
    this.clients = new Map();
    this.accountConfigs = [];
  }

  /**
   * Add an account configuration
   */
  addAccount(accountConfig) {
    this.accountConfigs.push(accountConfig);
    console.log(`Added account configuration: ${accountConfig.accountName}`);
  }

  /**
   * Add multiple account configurations
   */
  addAccounts(accountConfigs) {
    accountConfigs.forEach(config => this.addAccount(config));
  }

  /**
   * Initialize and authenticate all accounts
   */
  async connectAll() {
    console.log('\n=== Connecting to all accounts ===\n');
    
    const connectionPromises = this.accountConfigs.map(async (config) => {
      try {
        const client = new TradovateClient(config, this.isDemo);
        await client.authenticate();
        this.clients.set(config.accountName, client);
        return { accountName: config.accountName, success: true };
      } catch (error) {
        console.error(`Failed to connect account ${config.accountName}:`, error.message);
        return { accountName: config.accountName, success: false, error: error.message };
      }
    });

    const results = await Promise.allSettled(connectionPromises);
    
    const connected = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - connected;
    
    console.log(`\n=== Connection Summary ===`);
    console.log(`Total accounts: ${results.length}`);
    console.log(`Connected: ${connected}`);
    console.log(`Failed: ${failed}\n`);

    return results;
  }

  /**
   * Get a specific client by account name
   */
  getClient(accountName) {
    return this.clients.get(accountName);
  }

  /**
   * Get all connected clients
   */
  getAllClients() {
    return Array.from(this.clients.values());
  }

  /**
   * Get all account names
   */
  getAccountNames() {
    return Array.from(this.clients.keys());
  }

  /**
   * Execute a function on all accounts in parallel
   */
  async executeOnAll(fn, ...args) {
    const promises = Array.from(this.clients.entries()).map(async ([accountName, client]) => {
      try {
        const result = await fn(client, ...args);
        return { accountName, success: true, result };
      } catch (error) {
        return { accountName, success: false, error: error.message };
      }
    });

    return await Promise.allSettled(promises);
  }

  /**
   * Get summary of all accounts
   */
  async getAllAccountsSummary() {
    console.log('\n=== Fetching all accounts summary ===\n');
    
    const summaries = await this.executeOnAll(async (client) => {
      return await client.getAccountSummary();
    });

    const results = [];
    summaries.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.success) {
        results.push(result.value.result);
      }
    });

    return results;
  }

  /**
   * Get total balance across all accounts
   */
  async getTotalBalance() {
    const summaries = await this.getAllAccountsSummary();
    
    let totalBalance = 0;
    summaries.forEach(summary => {
      if (summary.balance) {
        totalBalance += summary.balance.cashBalance || 0;
      }
    });

    return totalBalance;
  }

  /**
   * Get all positions across all accounts
   */
  async getAllPositions() {
    console.log('\n=== Fetching all positions ===\n');
    
    const results = await this.executeOnAll(async (client) => {
      return await client.getPositions();
    });

    const allPositions = [];
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.success) {
        const positions = result.value.result;
        if (positions && positions.length > 0) {
          allPositions.push({
            accountName: result.value.accountName,
            positions: positions
          });
        }
      }
    });

    return allPositions;
  }

  /**
   * Get all orders across all accounts
   */
  async getAllOrders() {
    console.log('\n=== Fetching all orders ===\n');
    
    const results = await this.executeOnAll(async (client) => {
      return await client.getOrders();
    });

    const allOrders = [];
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.success) {
        const orders = result.value.result;
        if (orders && orders.length > 0) {
          allOrders.push({
            accountName: result.value.accountName,
            orders: orders
          });
        }
      }
    });

    return allOrders;
  }

  /**
   * Place order on a specific account
   */
  async placeOrder(accountName, orderData) {
    const client = this.getClient(accountName);
    if (!client) {
      throw new Error(`Account ${accountName} not found`);
    }

    return await client.placeOrder(orderData);
  }

  /**
   * Place the same order on all accounts
   */
  async placeOrderOnAll(orderData) {
    console.log('\n=== Placing order on all accounts ===\n');
    
    return await this.executeOnAll(async (client) => {
      return await client.placeOrder(orderData);
    });
  }

  /**
   * Renew tokens for all accounts
   */
  async renewAllTokens() {
    console.log('\n=== Renewing all tokens ===\n');
    
    return await this.executeOnAll(async (client) => {
      return await client.renewToken();
    });
  }

  /**
   * Disconnect all accounts
   */
  disconnect() {
    console.log('\n=== Disconnecting all accounts ===\n');
    this.clients.clear();
    console.log('All accounts disconnected');
  }

  /**
   * Print status of all accounts
   */
  async printStatus() {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║         MULTI-ACCOUNT STATUS DASHBOARD            ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    const summaries = await this.getAllAccountsSummary();

    summaries.forEach((summary, index) => {
      console.log(`\n[Account ${index + 1}]: ${summary.accountName}`);
      console.log('─'.repeat(50));
      
      if (summary.accountInfo) {
        console.log(`Account ID: ${summary.accountId}`);
        console.log(`Balance: $${summary.accountInfo.cashBalance || 0}`);
      }
      
      if (summary.positions && summary.positions.length > 0) {
        console.log(`Open Positions: ${summary.positions.length}`);
      } else {
        console.log('Open Positions: 0');
      }
      
      if (summary.orders && summary.orders.length > 0) {
        console.log(`Active Orders: ${summary.orders.length}`);
      } else {
        console.log('Active Orders: 0');
      }
    });

    console.log('\n' + '═'.repeat(50));
    
    const totalBalance = await this.getTotalBalance();
    console.log(`\nTotal Balance Across All Accounts: $${totalBalance.toFixed(2)}`);
    console.log(`Total Accounts Connected: ${this.clients.size}\n`);
  }
}

export default MultiAccountManager;
