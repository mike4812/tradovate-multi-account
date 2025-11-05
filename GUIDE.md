# מדריך שימוש מפורט - Tradovate Multi-Account Manager

## תוכן עניינים
1. [התקנה ראשונית](#התקנה-ראשונית)
2. [הגדרת חשבונות](#הגדרת-חשבונות)
3. [דוגמאות שימוש](#דוגמאות-שימוש)
4. [פקודות זמינות](#פקודות-זמינות)
5. [API מפורט](#api-מפורט)
6. [טיפים מתקדמים](#טיפים-מתקדמים)

---

## התקנה ראשונית

### שלב 1: התקן Node.js
אם אין לך Node.js מותקן:
1. הורד מ- [nodejs.org](https://nodejs.org/)
2. בחר את הגרסה LTS (מומלץ)
3. התקן והפעל מחדש את המחשב

### שלב 2: התקן את החבילות
```powershell
cd tradovate-multi-account
npm install
```

זה יתקין:
- `axios` - לבקשות HTTP
- `dotenv` - לניהול משתני סביבה

---

## הגדרת חשבונות

### אפשרות 1: שימוש ב-config.json (מומלץ)

1. העתק את הקובץ לדוגמה:
```powershell
copy config.example.json config.json
```

2. פתח את `config.json` וערוך:
```json
{
  "accounts": [
    {
      "accountName": "שם החשבון שלי",
      "username": "שם המשתמש שלך",
      "password": "הסיסמה שלך",
      "appId": "Sample App",
      "appVersion": "1.0",
      "cid": "YOUR_CID",
      "sec": "YOUR_SECRET"
    }
  ],
  "settings": {
    "isDemo": true,
    "autoReconnect": true,
    "tokenRefreshInterval": 3600000
  }
}
```

### איפה מוצאים את ה-CID ו-SECRET?

1. היכנס ל-[Tradovate](https://trader.tradovate.com/)
2. לך ל-Settings → API
3. צור API credentials חדשים
4. העתק את ה-CID ו-SECRET

### הוספת חשבונות נוספים

פשוט הוסף אובייקטים נוספים למערך `accounts`:
```json
{
  "accounts": [
    {
      "accountName": "חשבון 1",
      "username": "user1",
      ...
    },
    {
      "accountName": "חשבון 2",
      "username": "user2",
      ...
    },
    {
      "accountName": "חשבון 3",
      "username": "user3",
      ...
    }
  ]
}
```

---

## דוגמאות שימוש

### דוגמה בסיסית - חיבור וסטטוס

```powershell
npm start
```

זה יבצע:
1. חיבור לכל החשבונות
2. הצגת סטטוס כל חשבון
3. הצגת פוזיציות והזמנות
4. חישוב יתרה כוללת

### דוגמאות מתקדמות

```powershell
npm run advanced
```

כולל:
- ניטור חשבונות
- פעולות מותאמות אישית
- השוואת חשבונות
- ניהול סיכונים

### ניהול תיק השקעות

```powershell
npm run portfolio
```

מצבים זמינים:
```powershell
# ניתוח תיק
npm run portfolio

# ניטור רציף (כל 30 שניות)
npm run portfolio:monitor

# ייצוא נתונים
npm run portfolio:export
```

---

## פקודות זמינות

### npm start
הפעלה בסיסית של המערכת.

**דוגמת פלט:**
```
╔════════════════════════════════════════════════════╗
║     TRADOVATE MULTI-ACCOUNT CONNECTION MANAGER    ║
╚════════════════════════════════════════════════════╝

📋 Found 3 account(s) in configuration
🌍 Environment: DEMO

=== Connecting to all accounts ===

[Account1] Authenticating...
[Account1] Authentication successful
[Account1] User ID: 12345
...

╔════════════════════════════════════════════════════╗
║         MULTI-ACCOUNT STATUS DASHBOARD            ║
╚════════════════════════════════════════════════════╝

[Account 1]: Account1
──────────────────────────────────────────────────
Account ID: 67890
Balance: $50000
Open Positions: 2
Active Orders: 1
```

### npm run advanced
דוגמאות מתקדמות.

כולל:
- מעקב אחר חשבונות
- פעולות מותאמות
- הזמנות מסונכרנות
- השוואת חשבונות
- ניהול סיכונים

### npm run portfolio
כלי לניהול תיק השקעות.

**מצבים:**
- `analyze` (ברירת מחדל): ניתוח מלא של התיק
- `monitor [seconds]`: ניטור רציף
- `export [filename]`: ייצוא נתונים ל-JSON
- `batch`: פעולות אצווה

**דוגמאות:**
```powershell
# ניתוח בסיסי
node src/portfolio-manager.js

# ניטור כל 60 שניות
node src/portfolio-manager.js monitor 60

# ייצוא לקובץ מותאם
node src/portfolio-manager.js export my-portfolio.json

# פעולות אצווה עם retry
node src/portfolio-manager.js batch
```

---

## API מפורט

### MultiAccountManager

#### בנאי
```javascript
const manager = new MultiAccountManager(isDemo = true);
```
- `isDemo`: true לסביבת Demo, false ל-Live

#### הוספת חשבונות
```javascript
// חשבון בודד
manager.addAccount({
  accountName: 'Account1',
  username: 'user',
  password: 'pass',
  appId: 'app',
  appVersion: '1.0',
  cid: 'cid',
  sec: 'secret'
});

// מספר חשבונות
manager.addAccounts([account1, account2, account3]);
```

#### חיבור
```javascript
await manager.connectAll();
// מחזיר: Array של תוצאות חיבור
```

#### קבלת מידע
```javascript
// כל החשבונות
const summaries = await manager.getAllAccountsSummary();

// יתרה כוללת
const totalBalance = await manager.getTotalBalance();

// כל הפוזיציות
const positions = await manager.getAllPositions();

// כל ההזמנות
const orders = await manager.getAllOrders();
```

#### עבודה עם חשבון ספציפי
```javascript
const client = manager.getClient('Account1');
const balance = await client.getBalance();
const positions = await client.getPositions();
```

#### ביצוע הזמנות
```javascript
// חשבון ספציפי
await manager.placeOrder('Account1', {
  action: 'Buy',
  symbol: 'MESM4',
  orderQty: 1,
  orderType: 'Market'
});

// כל החשבונות
await manager.placeOrderOnAll({
  action: 'Buy',
  symbol: 'MESM4',
  orderQty: 1,
  orderType: 'Limit',
  price: 5000
});
```

### TradovateClient

#### אימות
```javascript
const client = new TradovateClient(accountConfig, isDemo);
await client.authenticate();
```

#### מידע על החשבון
```javascript
const accountInfo = await client.getAccountInfo();
const balance = await client.getBalance();
const positions = await client.getPositions();
const orders = await client.getOrders();
```

#### הזמנות
```javascript
// ביצוע הזמנה
const order = await client.placeOrder({
  action: 'Buy',        // או 'Sell'
  symbol: 'MESM4',
  orderQty: 1,
  orderType: 'Market',  // או 'Limit', 'Stop', 'StopLimit'
  price: 5000           // עבור Limit/StopLimit
});

// ביטול הזמנה
await client.cancelOrder(orderId);
```

### פונקציות עזר (utils.js)

```javascript
import {
  formatCurrency,
  calculateRiskMetrics,
  getLowBalanceAccounts,
  retryWithBackoff,
  generateSummaryReport
} from './utils.js';

// עיצוב מטבע
formatCurrency(50000); // "$50,000.00"

// חישוב סיכונים
const risk = calculateRiskMetrics(summary);
// { balance, exposure, exposurePercent, riskLevel, ... }

// חשבונות עם יתרה נמוכה
const lowBalance = getLowBalanceAccounts(summaries, 5000);

// ניסיון חוזר
await retryWithBackoff(async () => {
  return await someApiCall();
}, 3, 1000);

// דוח סיכום
const report = generateSummaryReport(summaries);
```

---

## טיפים מתקדמים

### 1. ניטור אוטומטי

צור סקריפט שרץ כל הזמן:
```javascript
setInterval(async () => {
  await manager.renewAllTokens();
  const summaries = await manager.getAllAccountsSummary();
  
  // בדוק תנאים
  const lowBalance = getLowBalanceAccounts(summaries, 5000);
  if (lowBalance.length > 0) {
    // שלח התראה (email, SMS, etc.)
  }
}, 60000); // כל דקה
```

### 2. ניהול סיכונים אוטומטי

```javascript
async function autoRiskManagement(manager) {
  const summaries = await manager.getAllAccountsSummary();
  
  for (const summary of summaries) {
    const risk = calculateRiskMetrics(summary);
    
    if (risk.riskLevel === 'HIGH') {
      console.log(`⚠️ High risk in ${summary.accountName}`);
      
      // בצע פעולה - למשל סגור חלק מהפוזיציות
      const client = manager.getClient(summary.accountName);
      // ... לוגיקה לסגירת פוזיציות
    }
  }
}
```

### 3. לוגים ודיווחים

```javascript
import fs from 'fs';

async function logDailyReport(manager) {
  const summaries = await manager.getAllAccountsSummary();
  const report = generateSummaryReport(summaries);
  
  const logEntry = {
    date: new Date().toISOString(),
    report: report
  };
  
  fs.appendFileSync(
    'daily-reports.json',
    JSON.stringify(logEntry) + '\n'
  );
}

// הרץ כל יום ב-17:00
// (השתמש ב-cron או task scheduler)
```

### 4. אסטרטגיות מסחר

```javascript
async function executeStrategy(manager, strategy) {
  const accountNames = manager.getAccountNames();
  
  for (const accountName of accountNames) {
    const client = manager.getClient(accountName);
    
    // קבל מידע עדכני
    const positions = await client.getPositions();
    const balance = await client.getBalance();
    
    // הרץ לוגיקת אסטרטגיה
    const signals = strategy.analyze(positions, balance);
    
    // בצע פעולות
    for (const signal of signals) {
      if (signal.action === 'BUY') {
        await client.placeOrder({
          action: 'Buy',
          symbol: signal.symbol,
          orderQty: signal.quantity,
          orderType: 'Market'
        });
      }
    }
  }
}
```

### 5. WebSocket לנתונים בזמן אמת

```javascript
import TradovateWebSocketClient from './TradovateWebSocketClient.js';

// הערה: דורש התקנה של חבילת ws
// npm install ws

const wsClient = new TradovateWebSocketClient(config, true);
await wsClient.authenticate();
await wsClient.connectWebSocket();

wsClient.subscribeToMarketData('MESM4', (data) => {
  console.log('Price update:', data);
});
```

---

## שאלות נפוצות

### האם זה בטוח?
כן, אבל:
- אל תשתף את `config.json`
- השתמש ב-Demo לפני Live
- אל תכתוב credentials בקוד

### כמה חשבונות אפשר לנהל?
אין הגבלה טכנית, אבל:
- Tradovate מגביל rate (בקשות לשנייה)
- מומלץ עד 10-20 חשבונות לביצועים אופטימליים

### מה קורה אם חשבון אחד נכשל?
המערכת ממשיכה לעבוד עם שאר החשבונות.

### איך מטפלים ב-Token Expiry?
המערכת מחדשת אוטומטית, או:
```javascript
await manager.renewAllTokens();
```

---

## תמיכה נוספת

- [Tradovate API Docs](https://api.tradovate.com/)
- [Tradovate GitHub](https://github.com/tradovate)
- [Developer Community](https://community.tradovate.com/)

---

**בהצלחה במסחר! 🚀📈**
