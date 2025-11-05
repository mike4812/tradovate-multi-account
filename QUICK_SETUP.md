# התקנה מהירה / Quick Setup

## התקנה ב-3 שלבים

### שלב 1: התקן חבילות
```powershell
cd tradovate-multi-account
npm install
```

### שלב 2: צור קובץ תצורה
```powershell
copy config.example.json config.json
```

### שלב 3: ערוך את config.json
פתח `config.json` ומלא את הפרטים שלך:

```json
{
  "accounts": [
    {
      "accountName": "החשבון שלי",
      "username": "שם_משתמש",
      "password": "סיסמה",
      "appId": "Sample App",
      "appVersion": "1.0",
      "cid": "YOUR_CID",
      "sec": "YOUR_SECRET"
    }
  ],
  "settings": {
    "isDemo": true
  }
}
```

### הרצה ראשונה
```powershell
npm start
```

---

## איפה מוצאים את CID ו-SECRET?

1. היכנס ל-Tradovate: https://trader.tradovate.com/
2. Settings → API
3. Create new API credentials
4. העתק את CID ו-SECRET

---

## פקודות שימושיות

```powershell
# הרצה בסיסית
npm start

# דוגמאות מתקדמות
npm run advanced

# ניהול תיק
npm run portfolio

# ניטור רציף
npm run portfolio:monitor

# ייצוא נתונים
npm run portfolio:export
```

---

## דוגמאות נוספות

```powershell
# התחלה מהירה
node examples/quick-start.js

# ביצוע הזמנות
node examples/place-orders.js

# ניטור סיכונים
node examples/risk-monitor.js

# ניטור סיכונים רציף
node examples/risk-monitor.js --continuous
```

---

## בעיות נפוצות

### "config.json not found"
פתרון: `copy config.example.json config.json`

### "Authentication failed"
בדוק:
- שם משתמש וסיסמה נכונים
- CID ו-SECRET נכונים
- `isDemo: true` אם אתה בסביבת Demo

### "npm not found"
פתרון: התקן Node.js מ- https://nodejs.org/

---

## עזרה נוספת

📖 [מדריך מפורט בעברית](GUIDE.md)
📖 [README](README.md)
📖 [Contributing](CONTRIBUTING.md)

---

**מוכן לעבודה! 🚀**
