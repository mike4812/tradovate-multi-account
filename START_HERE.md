# 🎯 הוראות הפעלה - Tradovate Multi-Account Manager

## ✅ הפרויקט מוכן!

הפרויקט נוצר בהצלחה והוא כולל את כל מה שצריך כדי להתחיל לעבוד עם מספר חשבונות Tradovate.

---

## 📋 מה נוצר?

### קבצי קוד מרכזיים (src/)
1. **TradovateClient.js** - Client לחשבון בודד
2. **MultiAccountManager.js** - מנהל מרובה חשבונות
3. **TradovateWebSocketClient.js** - תמיכה ב-WebSocket
4. **utils.js** - פונקציות עזר
5. **index.js** - הדגמה בסיסית
6. **advanced-examples.js** - דוגמאות מתקדמות
7. **portfolio-manager.js** - כלי ניהול תיק

### דוגמאות (examples/)
1. **quick-start.js** - התחלה מהירה
2. **place-orders.js** - ביצוע הזמנות
3. **risk-monitor.js** - ניטור סיכונים

### תיעוד
1. **README.md** - תיעוד ראשי
2. **GUIDE.md** - מדריך מפורט בעברית
3. **QUICK_SETUP.md** - התקנה מהירה
4. **PROJECT_SUMMARY.md** - סיכום הפרויקט
5. **CHANGELOG.md** - היסטוריית שינויים
6. **CONTRIBUTING.md** - מדריך תרומה
7. **LICENSE** - רישיון

---

## 🚀 צעדים הבאים

### שלב 1: התקן חבילות Node.js

פתח PowerShell/Terminal בתיקיית הפרויקט והרץ:

```powershell
cd tradovate-multi-account
npm install
```

זה יתקין:
- axios (HTTP requests)
- dotenv (משתני סביבה)

### שלב 2: צור קובץ תצורה

```powershell
copy config.example.json config.json
```

### שלב 3: ערוך את config.json

פתח את הקובץ `config.json` ומלא את הפרטים שלך:

```json
{
  "accounts": [
    {
      "accountName": "החשבון שלי",
      "username": "שם_משתמש_שלך",
      "password": "סיסמה_שלך",
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

**איפה מוצאים CID ו-SECRET?**
1. היכנס ל- https://trader.tradovate.com/
2. לך ל-Settings → API
3. צור API credentials חדשים
4. העתק את CID ו-SECRET

### שלב 4: הרץ את הפרויקט

```powershell
npm start
```

אם הכל עובד, תראה:
```
╔════════════════════════════════════════════════════╗
║     TRADOVATE MULTI-ACCOUNT CONNECTION MANAGER    ║
╚════════════════════════════════════════════════════╝

📋 Found 1 account(s) in configuration
🌍 Environment: DEMO

[Your Account] Authenticating...
[Your Account] Authentication successful
...
```

---

## 📚 פקודות שימושיות

```powershell
# הרצה בסיסית
npm start

# דוגמאות מתקדמות
npm run advanced

# ניהול תיק
npm run portfolio

# ניטור רציף (כל 30 שניות)
npm run portfolio:monitor

# ייצוא נתונים
npm run portfolio:export
```

### דוגמאות נוספות

```powershell
# התחלה מהירה
node examples/quick-start.js

# ביצוע הזמנות (בטוח - מסומן בהערות)
node examples/place-orders.js

# ניטור סיכונים
node examples/risk-monitor.js

# ניטור סיכונים רציף
node examples/risk-monitor.js --continuous
```

---

## 🎓 מה אפשר לעשות?

### 1. חיבור למספר חשבונות
```javascript
const manager = new MultiAccountManager(true);
manager.addAccounts([account1, account2, account3]);
await manager.connectAll();
```

### 2. קבלת מידע
```javascript
const totalBalance = await manager.getTotalBalance();
const positions = await manager.getAllPositions();
const orders = await manager.getAllOrders();
```

### 3. ביצוע הזמנות
```javascript
// חשבון ספציפי
await manager.placeOrder('Account1', orderData);

// כל החשבונות
await manager.placeOrderOnAll(orderData);
```

### 4. ניטור סיכונים
```javascript
const summaries = await manager.getAllAccountsSummary();
summaries.forEach(summary => {
  const risk = calculateRiskMetrics(summary);
  console.log(`${summary.accountName}: ${risk.riskLevel}`);
});
```

---

## 📖 קריאה מומלצת

1. **[QUICK_SETUP.md](QUICK_SETUP.md)** - התחל כאן!
2. **[README.md](README.md)** - תיעוד מלא
3. **[GUIDE.md](GUIDE.md)** - מדריך מפורט בעברית
4. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - סקירה כוללת

---

## 🔧 פתרון בעיות

### "npm not found"
**פתרון:** התקן Node.js מ- https://nodejs.org/

### "config.json not found"
**פתרון:** `copy config.example.json config.json`

### "Authentication failed"
**פתרון:** בדוק:
- שם משתמש וסיסמה נכונים
- CID ו-SECRET נכונים
- `isDemo: true` אם אתה בסביבת Demo

### "Cannot find module"
**פתרון:** הרץ `npm install` שוב

---

## ⚠️ אזהרות חשובות

1. **התחל תמיד בסביבת Demo** (`isDemo: true`)
2. **אל תשתף את config.json** - הוא מכיל סיסמאות
3. **בדוק קוד לפני הרצה ב-Live**
4. **שמור גיבויים של config.json**
5. **השתמש ב-.gitignore** כדי לא לשתף credentials

---

## 🎯 מסלולי למידה

### מתחיל
1. הרץ `npm start`
2. קרא את README.md
3. נסה `examples/quick-start.js`

### בינוני
1. הרץ `npm run advanced`
2. קרא את GUIDE.md
3. נסה `examples/place-orders.js`

### מתקדם
1. הרץ `npm run portfolio:monitor`
2. קרא את הקוד ב-src/
3. התאם אישית את הפונקציות

---

## 🌟 תכונות מיוחדות

✅ **חיבור מקבילי** - כל החשבונות מתחברים יחד
✅ **חידוש Token אוטומטי** - אף פעם לא expired
✅ **טיפול בשגיאות** - אם חשבון אחד נכשל, השאר ממשיכים
✅ **ניטור בזמן אמת** - עדכונים רציפים
✅ **דוחות מפורטים** - כל המידע במקום אחד

---

## 📞 תמיכה ועזרה

- **Tradovate API Docs:** https://api.tradovate.com/
- **Tradovate Community:** https://community.tradovate.com/
- **GitHub Issues:** צור issue אם יש בעיה

---

## 🎉 מוכן לעבודה!

הפרויקט מוכן לשימוש. כל מה שצריך זה:
1. ✅ התקן חבילות (`npm install`)
2. ✅ צור config.json
3. ✅ מלא פרטים
4. ✅ הרץ (`npm start`)

**בהצלחה במסחר! 🚀📈💰**

---

תאריך: נובמבר 2025
גרסה: 1.0.0
