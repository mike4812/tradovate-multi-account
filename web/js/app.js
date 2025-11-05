// App State
const state = {
    connected: false,
    accounts: [],
    positions: [],
    orders: [],
    autoRefresh: false,
    refreshInterval: null,
    // Trading control
    currentSymbol: 'NQ',  // המדד הנוכחי
    currentSide: 'long',  // Long/Short
    symbolChart: null     // גרף המדד
};

// DOM Elements
const elements = {
    connectBtn: document.getElementById('connectBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    disconnectBtn: document.getElementById('disconnectBtn'),
    connectionStatus: document.getElementById('connectionStatus'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    toastContainer: document.getElementById('toastContainer'),
    
    // Summary
    totalBalance: document.getElementById('totalBalance'),
    connectedAccounts: document.getElementById('connectedAccounts'),
    totalAccounts: document.getElementById('totalAccounts'),
    totalPositions: document.getElementById('totalPositions'),
    totalOrders: document.getElementById('totalOrders'),
    
    // Risk
    lowRiskCount: document.getElementById('lowRiskCount'),
    mediumRiskCount: document.getElementById('mediumRiskCount'),
    highRiskCount: document.getElementById('highRiskCount'),
    
    // Lists
    accountsList: document.getElementById('accountsList'),
    positionsList: document.getElementById('positionsList'),
    ordersList: document.getElementById('ordersList'),
    
    // Settings
    autoRefresh: document.getElementById('autoRefresh'),
    soundAlerts: document.getElementById('soundAlerts'),
    environmentSelect: document.getElementById('environmentSelect')
};

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Update nav
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Update sections
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
    });
});

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️';
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Loading Overlay
function showLoading(show = true) {
    elements.loadingOverlay.classList.toggle('active', show);
}

// Connect to Accounts (Real API Call)
async function connectToAccounts() {
    showLoading(true);
    
    try {
        // Try to connect to real backend
        const response = await fetch('/api/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            state.accounts = data.accounts || [];
            state.positions = data.positions || [];
            state.orders = data.orders || [];
        } else {
            // Fallback to demo data
            console.log('Using demo data');
            loadDemoData();
        }
        
        state.connected = true;
        updateAccountDropdown();
        updateUI();
        showToast('התחברת בהצלחה לכל החשבונות!', 'success');
        
    } catch (error) {
        console.log('Backend not available, using demo data');
        loadDemoData();
        state.connected = true;
        updateAccountDropdown();
        updateUI();
        showToast('מצב Demo - התחברת בהצלחה!', 'success');
    } finally {
        showLoading(false);
    }
}

// Load Demo Data
function loadDemoData() {
    state.accounts = [
        {
            name: 'חשבון ראשי',
            accountId: 'ACC001',
            balance: 50000,
            positions: 3,
            orders: 1,
            risk: 'low'
        },
        {
            name: 'חשבון משני',
            accountId: 'ACC002',
            balance: 35000,
            positions: 5,
            orders: 2,
            risk: 'medium'
        },
        {
            name: 'חשבון נוסף',
            accountId: 'ACC003',
            balance: 15000,
            positions: 2,
            orders: 0,
            risk: 'low'
        }
    ];
    
    // עדכן רשימת החשבונות בדרופדאון
    updateAccountDropdown();
    
    state.positions = [
        {
            account: 'חשבון ראשי',
            symbol: 'ES',
            side: 'long',
            contracts: 2,
            avgPrice: 4500,
            currentPrice: 4520,
            pnl: 400,
            stopLoss: 4450,
            takeProfit: 4550
        },
        {
            account: 'חשבון משני',
            symbol: 'NQ',
            side: 'short',
            contracts: 1,
            avgPrice: 15000,
            currentPrice: 14900,
            pnl: 100,
            stopLoss: 15100,
            takeProfit: 14800
        },
        {
            account: 'חשבון נוסף',
            symbol: 'ES',
            side: 'long',
            contracts: 1,
            avgPrice: 4510,
            currentPrice: 4520,
            pnl: 50,
            stopLoss: 4480,
            takeProfit: 4540
        }
    ];
    
    state.orders = [
        {
            account: 'חשבון ראשי',
            symbol: 'ES',
            type: 'Limit',
            action: 'Buy',
            quantity: 1,
            price: 4490,
            status: 'Working'
        }
    ];
}

// Update UI
function updateUI() {
    // Connection status
    if (state.connected) {
        elements.connectionStatus.classList.add('connected');
        elements.connectionStatus.querySelector('.status-text').textContent = 'מחובר';
        elements.connectBtn.textContent = 'מחובר ✓';
        elements.connectBtn.disabled = true;
        elements.refreshBtn.disabled = false;
        elements.disconnectBtn.disabled = false;
    } else {
        elements.connectionStatus.classList.remove('connected');
        elements.connectionStatus.querySelector('.status-text').textContent = 'מנותק';
        elements.connectBtn.textContent = 'התחבר לכל החשבונות';
        elements.connectBtn.disabled = false;
        elements.refreshBtn.disabled = true;
        elements.disconnectBtn.disabled = true;
    }
    
    // Summary
    const totalBalance = state.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalPositions = state.accounts.reduce((sum, acc) => sum + acc.positions, 0);
    const totalOrders = state.accounts.reduce((sum, acc) => sum + acc.orders, 0);
    
    elements.totalBalance.textContent = `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    elements.connectedAccounts.textContent = state.connected ? state.accounts.length : 0;
    elements.totalAccounts.textContent = state.accounts.length;
    elements.totalPositions.textContent = totalPositions;
    elements.totalOrders.textContent = totalOrders;
    
    // Risk
    const riskCounts = state.accounts.reduce((counts, acc) => {
        counts[acc.risk] = (counts[acc.risk] || 0) + 1;
        return counts;
    }, {});
    
    elements.lowRiskCount.textContent = riskCounts.low || 0;
    elements.mediumRiskCount.textContent = riskCounts.medium || 0;
    elements.highRiskCount.textContent = riskCounts.high || 0;
    
    // Accounts list
    renderAccounts();
    renderPositions();
    renderOrders();
}

// Render Accounts
function renderAccounts() {
    if (!state.connected || state.accounts.length === 0) {
        elements.accountsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔌</div>
                <p>התחבר כדי לראות את החשבונות</p>
            </div>
        `;
        return;
    }
    
    elements.accountsList.innerHTML = state.accounts.map(account => `
        <div class="account-card">
            <div class="account-header">
                <h3 class="account-name">${account.name}</h3>
                <span class="account-status connected">מחובר</span>
            </div>
            <div class="account-info">
                <div class="account-info-row">
                    <span class="account-label">מזהה חשבון</span>
                    <span class="account-value">${account.accountId}</span>
                </div>
                <div class="account-info-row">
                    <span class="account-label">יתרה</span>
                    <span class="account-value">$${account.balance.toLocaleString()}</span>
                </div>
                <div class="account-info-row">
                    <span class="account-label">פוזיציות</span>
                    <span class="account-value">${account.positions}</span>
                </div>
                <div class="account-info-row">
                    <span class="account-label">הזמנות</span>
                    <span class="account-value">${account.orders}</span>
                </div>
                <div class="account-info-row">
                    <span class="account-label">רמת סיכון</span>
                    <span class="account-value">${getRiskLabel(account.risk)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Render Positions
function renderPositions() {
    if (!state.connected || state.positions.length === 0) {
        elements.positionsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📊</div>
                <p>אין פוזיציות פתוחות</p>
            </div>
        `;
        return;
    }
    
    elements.positionsList.innerHTML = `
        <div style="margin-bottom: 20px;">
            <div class="action-buttons">
                <button class="btn btn-success" onclick="closeAllPositions('long')">
                    <span style="font-size: 1.2em;">📈</span> סגור כל ה-LONG
                </button>
                <button class="btn btn-danger" onclick="closeAllPositions('short')">
                    <span style="font-size: 1.2em;">📉</span> סגור כל ה-SHORT
                </button>
                <button class="btn btn-warning" onclick="closeAllPositions('all')">
                    <span style="font-size: 1.2em;">⛔</span> סגור הכל
                </button>
            </div>
        </div>
        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>חשבון</th>
                        <th>סימול</th>
                        <th>כיוון</th>
                        <th>חוזים</th>
                        <th>מחיר כניסה</th>
                        <th>מחיר נוכחי</th>
                        <th>Stop Loss</th>
                        <th>Take Profit</th>
                        <th>רווח/הפסד</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.positions.map((pos, idx) => `
                        <tr>
                            <td>${pos.account}</td>
                            <td><strong>${pos.symbol}</strong></td>
                            <td>
                                <span style="color: ${pos.side === 'long' ? 'var(--success-color)' : 'var(--danger-color)'}; font-weight: 600;">
                                    ${pos.side === 'long' ? '📈 LONG' : '📉 SHORT'}
                                </span>
                            </td>
                            <td>${pos.contracts}</td>
                            <td>$${pos.avgPrice.toLocaleString()}</td>
                            <td>$${pos.currentPrice.toLocaleString()}</td>
                            <td style="color: var(--danger-color);">
                                ${pos.stopLoss ? '🛑 $' + pos.stopLoss.toLocaleString() : '-'}
                            </td>
                            <td style="color: var(--success-color);">
                                ${pos.takeProfit ? '🎯 $' + pos.takeProfit.toLocaleString() : '-'}
                            </td>
                            <td style="color: ${pos.pnl >= 0 ? 'var(--success-color)' : 'var(--danger-color)'}; font-weight: 600;">
                                ${pos.pnl >= 0 ? '+' : ''}$${pos.pnl.toLocaleString()}
                            </td>
                            <td>
                                <button class="btn-sm btn-danger" onclick="closePosition(${idx})" title="סגור פוזיציה">
                                    ❌ סגור
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Render Orders
function renderOrders() {
    if (!state.connected || state.orders.length === 0) {
        elements.ordersList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <p>אין הזמנות פעילות</p>
            </div>
        `;
        return;
    }
    
    elements.ordersList.innerHTML = `
        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>חשבון</th>
                        <th>סימול</th>
                        <th>סוג</th>
                        <th>פעולה</th>
                        <th>כמות</th>
                        <th>מחיר</th>
                        <th>סטטוס</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.orders.map(order => `
                        <tr>
                            <td>${order.account}</td>
                            <td><strong>${order.symbol}</strong></td>
                            <td>${order.type}</td>
                            <td style="color: ${order.action === 'Buy' ? 'var(--success-color)' : 'var(--danger-color)'}">
                                ${order.action === 'Buy' ? 'קנייה' : 'מכירה'}
                            </td>
                            <td>${order.quantity}</td>
                            <td>$${order.price.toLocaleString()}</td>
                            <td><span style="color: var(--warning-color)">${order.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Helper Functions
function getRiskLabel(risk) {
    const labels = {
        low: '🟢 נמוך',
        medium: '🟡 בינוני',
        high: '🔴 גבוה'
    };
    return labels[risk] || risk;
}

// Auto Refresh
function startAutoRefresh() {
    if (state.refreshInterval) {
        clearInterval(state.refreshInterval);
    }
    
    state.refreshInterval = setInterval(() => {
        if (state.connected) {
            refreshData();
        }
    }, 30000); // 30 seconds
}

function stopAutoRefresh() {
    if (state.refreshInterval) {
        clearInterval(state.refreshInterval);
        state.refreshInterval = null;
    }
}

async function refreshData() {
    showToast('מרענן נתונים...', 'success');
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    updateUI();
}

// Disconnect
function disconnect() {
    state.connected = false;
    state.accounts = [];
    state.positions = [];
    state.orders = [];
    updateUI();
    stopAutoRefresh();
    showToast('התנתקת מכל החשבונות', 'warning');
}

// Event Listeners
elements.connectBtn.addEventListener('click', connectToAccounts);
elements.refreshBtn.addEventListener('click', refreshData);
elements.disconnectBtn.addEventListener('click', disconnect);

elements.autoRefresh.addEventListener('change', (e) => {
    state.autoRefresh = e.target.checked;
    if (state.autoRefresh && state.connected) {
        startAutoRefresh();
        showToast('רענון אוטומטי הופעל', 'success');
    } else {
        stopAutoRefresh();
        showToast('רענון אוטומטי כובה', 'warning');
    }
});

elements.environmentSelect.addEventListener('change', (e) => {
    const env = e.target.value;
    if (env === 'live') {
        const confirmed = confirm('⚠️ אזהרה! אתה עומד לעבור לסביבת LIVE.\nזה ישפיע על חשבונות אמיתיים!\n\nהאם אתה בטוח?');
        if (!confirmed) {
            e.target.value = 'demo';
            return;
        }
    }
    showToast(`עברת לסביבת ${env === 'demo' ? 'Demo' : 'Live'}`, env === 'live' ? 'warning' : 'success');
});

// Trading Functions

// Close Single Position
async function closePosition(index) {
    const position = state.positions[index];
    if (!position) return;
    
    const confirmed = confirm(
        `האם לסגור את הפוזיציה?\n\n` +
        `חשבון: ${position.account}\n` +
        `סימול: ${position.symbol}\n` +
        `כיוון: ${position.side === 'long' ? 'LONG' : 'SHORT'}\n` +
        `חוזים: ${position.contracts}\n` +
        `רווח/הפסד: $${position.pnl}`
    );
    
    if (!confirmed) return;
    
    showLoading(true);
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        state.positions.splice(index, 1);
        updateUI();
        showToast(`✅ סגרת פוזיציה ב-${position.symbol} בחשבון ${position.account}`, 'success');
    } catch (error) {
        showToast('❌ שגיאה בסגירת פוזיציה: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Close All Positions by Type
async function closeAllPositions(type) {
    let positionsToClose = [];
    let message = '';
    
    if (type === 'long') {
        positionsToClose = state.positions.filter(p => p.side === 'long');
        message = 'האם לסגור את כל הפוזיציות ה-LONG?';
    } else if (type === 'short') {
        positionsToClose = state.positions.filter(p => p.side === 'short');
        message = 'האם לסגור את כל הפוזיציות ה-SHORT?';
    } else {
        positionsToClose = state.positions;
        message = '⚠️ אזהרה! האם לסגור את כל הפוזיציות?';
    }
    
    if (positionsToClose.length === 0) {
        showToast(`אין פוזיציות ${type === 'long' ? 'LONG' : type === 'short' ? 'SHORT' : ''} לסגירה`, 'warning');
        return;
    }
    
    const confirmed = confirm(
        `${message}\n\n` +
        `סה"כ פוזיציות: ${positionsToClose.length}\n` +
        `סה"כ רווח/הפסד: $${positionsToClose.reduce((sum, p) => sum + p.pnl, 0).toLocaleString()}`
    );
    
    if (!confirmed) return;
    
    showLoading(true);
    
    try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const closedCount = positionsToClose.length;
        const totalPnL = positionsToClose.reduce((sum, p) => sum + p.pnl, 0);
        
        // Remove closed positions
        state.positions = state.positions.filter(p => !positionsToClose.includes(p));
        
        updateUI();
        showToast(
            `✅ נסגרו ${closedCount} פוזיציות | רווח/הפסד: $${totalPnL.toLocaleString()}`,
            'success'
        );
    } catch (error) {
        showToast('❌ שגיאה בסגירת פוזיציות: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Open New Position
async function openPosition(type, symbol, contracts) {
    if (!state.connected) {
        showToast('❌ יש להתחבר תחילה!', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newPosition = {
            account: state.accounts[0].name,
            symbol: symbol || 'ES',
            side: type,
            contracts: contracts || 1,
            avgPrice: type === 'long' ? 4500 : 4520,
            currentPrice: 4510,
            pnl: 0
        };
        
        state.positions.push(newPosition);
        updateUI();
        
        showToast(
            `✅ נפתחה פוזיציה ${type === 'long' ? 'LONG' : 'SHORT'} ב-${symbol || 'ES'}`,
            'success'
        );
    } catch (error) {
        showToast('❌ שגיאה בפתיחת פוזיציה: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Cancel All Orders
async function cancelAllOrders() {
    if (state.orders.length === 0) {
        showToast('אין הזמנות לביטול', 'warning');
        return;
    }
    
    const confirmed = confirm(
        `האם לבטל את כל ההזמנות?\n\n` +
        `סה"כ הזמנות: ${state.orders.length}`
    );
    
    if (!confirmed) return;
    
    showLoading(true);
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const canceledCount = state.orders.length;
        state.orders = [];
        
        updateUI();
        showToast(`✅ בוטלו ${canceledCount} הזמנות`, 'success');
    } catch (error) {
        showToast('❌ שגיאה בביטול הזמנות: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Place Order
async function placeOrder(action, symbol, quantity, price, orderType = 'Limit') {
    if (!state.connected) {
        showToast('❌ יש להתחבר תחילה!', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newOrder = {
            account: state.accounts[0].name,
            symbol: symbol || 'ES',
            type: orderType,
            action: action,
            quantity: quantity || 1,
            price: price || 4500,
            status: 'Working'
        };
        
        state.orders.push(newOrder);
        updateUI();
        
        showToast(
            `✅ ההזמנה נשלחה: ${action === 'Buy' ? 'קנייה' : 'מכירה'} ${quantity} חוזים של ${symbol}`,
            'success'
        );
    } catch (error) {
        showToast('❌ שגיאה בשליחת הזמנה: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Trade Form Handler
function initTradeForm() {
    const tradeForm = document.getElementById('tradeForm');
    const sideButtons = document.querySelectorAll('.btn-option');
    const sideInput = document.getElementById('tradeSide');
    
    // Handle side selection
    sideButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            sideButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            sideInput.value = btn.dataset.side;
        });
    });
    
    // Handle form submission
    if (tradeForm) {
        tradeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!state.connected) {
                showToast('❌ יש להתחבר תחילה!', 'error');
                return;
            }
            
            const formData = {
                side: document.getElementById('tradeSide').value,
                instrument: document.getElementById('tradeInstrument').value,
                contracts: parseInt(document.getElementById('tradeContracts').value),
                entryPrice: document.getElementById('entryPrice').value || null,
                stopLoss: document.getElementById('stopLoss').value || null,
                takeProfit: document.getElementById('takeProfit').value || null
            };
            
            await openPositionFromForm(formData);
        });
    }
}

// Open Position from Form
async function openPositionFromForm(data) {
    showLoading(true);
    
    try {
        // Try to send to backend
        const response = await fetch('/api/trade/open', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            showToast(`✅ הפוזיציה נפתחה בהצלחה!`, 'success');
            await refreshData();
        } else {
            throw new Error('Backend error');
        }
    } catch (error) {
        // Demo mode - simulate position opening
        const newPosition = {
            account: state.accounts[0].name,
            symbol: data.instrument,
            side: data.side,
            contracts: data.contracts,
            avgPrice: parseFloat(data.entryPrice) || (data.side === 'long' ? 4500 : 4520),
            currentPrice: 4510,
            pnl: 0,
            stopLoss: parseFloat(data.stopLoss) || null,
            takeProfit: parseFloat(data.takeProfit) || null
        };
        
        state.positions.push(newPosition);
        updateUI();
        
        showToast(
            `✅ פוזיציה ${data.side === 'long' ? 'LONG' : 'SHORT'} נפתחה!\n` +
            `${data.instrument} | ${data.contracts} חוזים\n` +
            `${data.stopLoss ? 'SL: ' + data.stopLoss : ''} ${data.takeProfit ? '| TP: ' + data.takeProfit : ''}`,
            'success'
        );
        
        // Reset form
        document.getElementById('tradeForm').reset();
        document.querySelector('.btn-long').click();
    } finally {
        showLoading(false);
    }
}

// Global Functions (accessible from window)
window.closePosition = closePosition;
window.closeAllPositions = closeAllPositions;
window.openPosition = openPosition;
window.cancelAllOrders = cancelAllOrders;
window.placeOrder = placeOrder;

// Login Handler
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const loginScreen = document.getElementById('loginScreen');
    const mainApp = document.getElementById('mainApp');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Check if already logged in
    const isLoggedIn = sessionStorage.getItem('argaman_logged_in');
    if (isLoggedIn === 'true') {
        showMainApp();
    }
    
    // Handle login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            showLoading(true);
            
            try {
                // Try to authenticate with backend
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                if (response.ok) {
                    sessionStorage.setItem('argaman_logged_in', 'true');
                    sessionStorage.setItem('argaman_username', username);
                    showMainApp();
                    showToast('🎉 התחברת בהצלחה!', 'success');
                } else {
                    throw new Error('Invalid credentials');
                }
            } catch (error) {
                // Try to load config.json for authentication
                try {
                    const configResponse = await fetch('../config.json');
                    if (configResponse.ok) {
                        const config = await configResponse.json();
                        if (config.webAuth && 
                            username === config.webAuth.username && 
                            password === config.webAuth.password) {
                            sessionStorage.setItem('argaman_logged_in', 'true');
                            sessionStorage.setItem('argaman_username', username);
                            showMainApp();
                            showToast('🎉 התחברת בהצלחה!', 'success');
                        } else {
                            showToast('❌ שם משתמש או סיסמה שגויים', 'error');
                        }
                    } else {
                        throw new Error('Config not found');
                    }
                } catch (configError) {
                    // Fallback - Demo mode (allow any credentials)
                    console.log('Config not available, using demo login');
                    if (username && password) {
                        sessionStorage.setItem('argaman_logged_in', 'true');
                        sessionStorage.setItem('argaman_username', username);
                        showMainApp();
                        showToast('🎉 התחברת בהצלחה! (Demo Mode)', 'success');
                    } else {
                        showToast('❌ שם משתמש וסיסמה נדרשים', 'error');
                    }
                }
            } finally {
                showLoading(false);
            }
        });
    }
    
    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const confirmed = confirm('האם אתה בטוח שברצונך להתנתק?');
            if (confirmed) {
                sessionStorage.removeItem('argaman_logged_in');
                sessionStorage.removeItem('argaman_username');
                disconnect();
                showLoginScreen();
                showToast('התנתקת בהצלחה', 'warning');
            }
        });
    }
    
    function showMainApp() {
        if (loginScreen) loginScreen.style.display = 'none';
        if (mainApp) mainApp.style.display = 'block';
    }
    
    function showLoginScreen() {
        if (loginScreen) loginScreen.style.display = 'flex';
        if (mainApp) mainApp.style.display = 'none';
    }
}

// Initialize Master Control Panel
function initMasterControl() {
    const symbolSelect = document.getElementById('masterSymbol');
    const longBtn = document.getElementById('masterLongBtn');
    const shortBtn = document.getElementById('masterShortBtn');
    const accountSelect = document.getElementById('accountSelect');
    const contractsAmount = document.getElementById('contractsAmount');
    const openPositionBtn = document.getElementById('openPositionBtn');
    const closeAllBtn = document.getElementById('closeAllPositionsBtn');

    // Symbol change
    if (symbolSelect) {
        symbolSelect.addEventListener('change', (e) => {
            state.currentSymbol = e.target.value;
            document.getElementById('currentSymbolDisplay').textContent = e.target.value;
            showToast(`מדד שונה ל-${e.target.value}`, 'success');
        });
    }

    // Long/Short buttons
    if (longBtn) {
        longBtn.addEventListener('click', () => {
            state.currentSide = 'long';
            longBtn.classList.add('active');
            shortBtn.classList.remove('active');
            document.getElementById('currentSideDisplay').textContent = 'LONG';
            showToast('כיוון שונה ל-LONG 📈', 'success');
        });
    }

    if (shortBtn) {
        shortBtn.addEventListener('click', () => {
            state.currentSide = 'short';
            shortBtn.classList.add('active');
            longBtn.classList.remove('active');
            document.getElementById('currentSideDisplay').textContent = 'SHORT';
            showToast('כיוון שונה ל-SHORT 📉', 'success');
        });
    }

    // Account selection change
    if (accountSelect) {
        accountSelect.addEventListener('change', (e) => {
            const selectedValue = e.target.value;
            const displayText = selectedValue === 'all' ? 'כל החשבונות' : selectedValue;
            document.getElementById('selectedAccountDisplay').textContent = displayText;
            showToast(`נבחר: ${displayText}`, 'success');
        });
    }

    // Contracts amount change
    if (contractsAmount) {
        contractsAmount.addEventListener('change', (e) => {
            const amount = parseInt(e.target.value) || 1;
            document.getElementById('contractsDisplay').textContent = amount;
        });
    }

    // Open position (single or all accounts)
    if (openPositionBtn) {
        openPositionBtn.addEventListener('click', async () => {
            if (!state.connected) {
                showToast('יש להתחבר קודם לחשבונות', 'error');
                return;
            }

            const selectedAccount = accountSelect.value;
            const contracts = parseInt(contractsAmount.value) || 1;
            
            let confirmMessage = '';
            if (selectedAccount === 'all') {
                confirmMessage = `האם לפתוח פוזיציה ${state.currentSide.toUpperCase()} ב-${state.currentSymbol}\nב-${state.accounts.length} חשבונות\nעם ${contracts} חוזים בכל חשבון?`;
            } else {
                confirmMessage = `האם לפתוח פוזיציה ${state.currentSide.toUpperCase()} ב-${state.currentSymbol}\nבחשבון: ${selectedAccount}\nעם ${contracts} חוזים?`;
            }

            const confirmed = confirm(confirmMessage);

            if (confirmed) {
                showLoading(true);
                try {
                    if (selectedAccount === 'all') {
                        // פתח בכל החשבונות
                        await openPosition(state.currentSide, state.currentSymbol, contracts);
                        showToast(
                            `נפתחה פוזיציה ${state.currentSide.toUpperCase()} ב-${state.currentSymbol} בכל ${state.accounts.length} החשבונות!`,
                            'success'
                        );
                    } else {
                        // פתח בחשבון ספציפי
                        await openPosition(state.currentSide, state.currentSymbol, contracts);
                        showToast(
                            `נפתחה פוזיציה ${state.currentSide.toUpperCase()} ב-${state.currentSymbol} בחשבון ${selectedAccount}!`,
                            'success'
                        );
                    }
                    await refreshData();
                } catch (error) {
                    showToast('שגיאה בפתיחת פוזיציה: ' + error.message, 'error');
                } finally {
                    showLoading(false);
                }
            }
        });
    }

    // Close all positions
    if (closeAllBtn) {
        closeAllBtn.addEventListener('click', async () => {
            if (!state.connected) {
                showToast('יש להתחבר קודם לחשבונות', 'error');
                return;
            }

            const confirmed = confirm('האם לסגור את כל הפוזיציות בכל החשבונות?');

            if (confirmed) {
                showLoading(true);
                try {
                    await closeAllPositions('all');
                } finally {
                    showLoading(false);
                }
            }
        });
    }
}

// Update account list in dropdown
function updateAccountDropdown() {
    const accountSelect = document.getElementById('accountSelect');
    if (!accountSelect) return;

    // שמור את הבחירה הנוכחית
    const currentSelection = accountSelect.value;

    // נקה את הרשימה
    accountSelect.innerHTML = '<option value="all">🌐 כל החשבונות</option>';

    // הוסף כל חשבון
    state.accounts.forEach((account, index) => {
        const option = document.createElement('option');
        option.value = account.name || `Account ${index + 1}`;
        option.textContent = `👤 ${account.name || `Account ${index + 1}`}`;
        accountSelect.appendChild(option);
    });

    // שחזר את הבחירה הקודמת אם אפשרי
    if (currentSelection && Array.from(accountSelect.options).some(opt => opt.value === currentSelection)) {
        accountSelect.value = currentSelection;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    updateUI();
    initTradeForm();
    initMasterControl();
    console.log('🚀 Argaman Capital - Automated Wealth');
    console.log('📝 Note: This is a demo UI. Connect to real backend for actual data.');
    console.log('🎯 Master Control Panel initialized');
    console.log('🎯 Trading functions available:');
    console.log('   - closePosition(index)');
    console.log('   - closeAllPositions("long"|"short"|"all")');
    console.log('   - openPosition("long"|"short", symbol, contracts)');
    console.log('   - cancelAllOrders()');
    console.log('   - placeOrder(action, symbol, quantity, price)');
});
