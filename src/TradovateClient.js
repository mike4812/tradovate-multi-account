import axios from 'axios';

/**
 * Tradovate API Client
 * Supports authentication and API calls for a single account
 */
class TradovateClient {
  constructor(accountConfig, isDemo = true) {
    this.accountName = accountConfig.accountName;
    this.username = accountConfig.username;
    this.password = accountConfig.password;
    this.appId = accountConfig.appId;
    this.appVersion = accountConfig.appVersion;
    this.cid = accountConfig.cid;
    this.sec = accountConfig.sec;
    
    // Set API URL based on environment
    this.baseURL = isDemo 
      ? 'https://demo.tradovateapi.com/v1'
      : 'https://live.tradovateapi.com/v1';
    
    this.accessToken = null;
    this.mdAccessToken = null;
    this.userId = null;
    this.accountId = null;
    this.expirationTime = null;
    
    // Create axios instance
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers['Authorization'] = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * Authenticate with Tradovate API
   */
  async authenticate() {
    try {
      console.log(`[${this.accountName}] Authenticating...`);
      
      const authData = {
        name: this.username,
        password: this.password,
        appId: this.appId,
        appVersion: this.appVersion,
        cid: this.cid,
        sec: this.sec
      };

      const response = await axios.post(`${this.baseURL}/auth/accesstokenrequest`, authData);
      
      if (response.data) {
        this.accessToken = response.data.accessToken;
        this.mdAccessToken = response.data.mdAccessToken;
        this.userId = response.data.userId;
        this.expirationTime = response.data.expirationTime;
        
        console.log(`[${this.accountName}] Authentication successful`);
        console.log(`[${this.accountName}] User ID: ${this.userId}`);
        
        // Get account information
        await this.getAccountInfo();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`[${this.accountName}] Authentication failed:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get account information
   */
  async getAccountInfo() {
    try {
      const response = await this.api.get('/account/list');
      
      if (response.data && response.data.length > 0) {
        this.accountId = response.data[0].id;
        const accountData = response.data[0];
        
        console.log(`[${this.accountName}] Account ID: ${this.accountId}`);
        console.log(`[${this.accountName}] Account Name: ${accountData.name}`);
        console.log(`[${this.accountName}] Account Balance: $${accountData.cashBalance || 0}`);
        
        return accountData;
      }
      
      return null;
    } catch (error) {
      console.error(`[${this.accountName}] Failed to get account info:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get current positions
   */
  async getPositions() {
    try {
      const response = await this.api.get(`/position/list`);
      return response.data || [];
    } catch (error) {
      console.error(`[${this.accountName}] Failed to get positions:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getBalance() {
    try {
      const response = await this.api.get(`/cashBalance/getcashbalance?accountId=${this.accountId}`);
      return response.data;
    } catch (error) {
      console.error(`[${this.accountName}] Failed to get balance:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get orders
   */
  async getOrders() {
    try {
      const response = await this.api.get('/order/list');
      return response.data || [];
    } catch (error) {
      console.error(`[${this.accountName}] Failed to get orders:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Place an order
   */
  async placeOrder(orderData) {
    try {
      const response = await this.api.post('/order/placeorder', {
        accountId: this.accountId,
        ...orderData
      });
      
      console.log(`[${this.accountName}] Order placed successfully:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`[${this.accountName}] Failed to place order:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId) {
    try {
      const response = await this.api.post('/order/cancelorder', {
        orderId: orderId
      });
      
      console.log(`[${this.accountName}] Order cancelled successfully`);
      return response.data;
    } catch (error) {
      console.error(`[${this.accountName}] Failed to cancel order:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired() {
    if (!this.expirationTime) return true;
    
    const now = new Date().toISOString();
    return now >= this.expirationTime;
  }

  /**
   * Renew access token
   */
  async renewToken() {
    if (!this.isTokenExpired()) {
      console.log(`[${this.accountName}] Token still valid`);
      return true;
    }
    
    console.log(`[${this.accountName}] Token expired, re-authenticating...`);
    return await this.authenticate();
  }

  /**
   * Get account status summary
   */
  async getAccountSummary() {
    try {
      const [accountInfo, positions, orders, balance] = await Promise.all([
        this.getAccountInfo().catch(() => null),
        this.getPositions().catch(() => []),
        this.getOrders().catch(() => []),
        this.getBalance().catch(() => null)
      ]);

      return {
        accountName: this.accountName,
        accountId: this.accountId,
        accountInfo,
        positions,
        orders,
        balance
      };
    } catch (error) {
      console.error(`[${this.accountName}] Failed to get account summary:`, error.message);
      throw error;
    }
  }
}

export default TradovateClient;
