# 📚 מפת הפרויקט - Tradovate Multi-Account Manager 

מדריך מהיר לכל הקבצים בפרויקט ומה הם עושים.

---

## 🚀 מתחיל? התחל כאן!

**→ [START_HERE.md](START_HERE.md)** - הוראות הפעלה מלאות

**→ [QUICK_SETUP.md](QUICK_SETUP.md)** - התקנה מהירה ב-3 שלבים

**→ [CHECKLIST.md](CHECKLIST.md)** - רשימת בדיקות

---

## 📖 תיעוד

| קובץ | תיאור | מתי להשתמש |
|------|--------|------------|
| **[README.md](README.md)** | תיעוד ראשי מקיף | סקירה כללית, API Reference |
| **[GUIDE.md](GUIDE.md)** | מדריך מפורט בעברית (650+ שורות) | למידה מעמיקה, דוגמאות מורחבות |
| **[QUICK_SETUP.md](QUICK_SETUP.md)** | התקנה מהירה | התחלה ב-3 צעדים |
| **[START_HERE.md](START_HERE.md)** | הוראות הפעלה מלאות | אחרי יצירת הפרויקט |
| **[CHECKLIST.md](CHECKLIST.md)** | רשימת בדיקות | וידוא שהכל עובד |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | סיכום הפרויקט | מבט כולל על המערכת |
| **[CHANGELOG.md](CHANGELOG.md)** | היסטוריית גרסאות | מה חדש בכל גרסה |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | מדריך תרומה | אם רוצים לתרום לפרויקט |
| **[LICENSE](LICENSE)** | רישיון ISC | תנאי שימוש |

---

## 💻 קוד מקור (src/)

| קובץ | שורות | תיאור | פונקציות עיקריות |
|------|-------|--------|-------------------|
| **TradovateClient.js** | ~430 | Client בודד לחשבון | authenticate, getBalance, getPositions, placeOrder |
| **MultiAccountManager.js** | ~270 | מנהל מרובה חשבונות | connectAll, getAllAccountsSummary, placeOrderOnAll |
| **utils.js** | ~300 | פונקציות עזר | formatCurrency, calculateRiskMetrics, generateReport |
| **TradovateWebSocketClient.js** | ~180 | תמיכה ב-WebSocket | connectWebSocket, subscribeToMarketData |
| **index.js** | ~150 | הדגמה בסיסית | דוגמת שימוש ראשונית |
| **advanced-examples.js** | ~200 | דוגמאות מתקדמות | ניטור, השוואות, סיכונים |
| **portfolio-manager.js** | ~250 | ניהול תיק | ניתוח, ניטור, ייצוא |

**סה"כ:** ~1,780 שורות קוד

---

## 📝 דוגמאות (examples/)

| קובץ | תיאור | הרצה |
|------|--------|------|
| **quick-start.js** | התחלה מהירה - הכי פשוט | `node examples/quick-start.js` |
| **place-orders.js** | ביצוע הזמנות | `node examples/place-orders.js` |
| **risk-monitor.js** | ניטור סיכונים | `node examples/risk-monitor.js` |
| **README.md** | הסבר הדוגמאות | קרא לפני הרצה |

---

## ⚙️ הגדרות

| קובץ | תיאור | חובה? |
|------|--------|-------|
| **package.json** | הגדרות NPM, סקריפטים | ✅ כן |
| **config.example.json** | דוגמת תצורה | לא - זה template |
| **config.json** | תצורה אמיתית שלך | ✅ כן (צור בעצמך) |
| **.env.example** | דוגמת משתני סביבה | לא - אופציונלי |
| **.gitignore** | קבצים להתעלם מהם ב-Git | ✅ כן |

---

## 📊 פקודות NPM

```powershell
# בסיסי
npm start                    # הרצה בסיסית
npm run advanced            # דוגמאות מתקדמות

# ניהול תיק
npm run portfolio           # ניתוח תיק
npm run portfolio:monitor   # ניטור רציף (30 שניות)
npm run portfolio:export    # ייצוא נתונים

# דוגמאות
node examples/quick-start.js     # התחלה מהירה
node examples/place-orders.js    # הזמנות
node examples/risk-monitor.js    # סיכונים
```

---

## 🗺️ מפת למידה

### רמה 1: מתחיל
1. קרא **START_HERE.md**
2. בדוק **CHECKLIST.md**
3. הרץ `npm start`
4. נסה **examples/quick-start.js**

### רמה 2: בינוני
1. קרא **README.md**
2. הרץ `npm run advanced`
3. נסה **examples/place-orders.js**
4. נסה **examples/risk-monitor.js**

### רמה 3: מתקדם
1. קרא **GUIDE.md** המפורט
2. הרץ `npm run portfolio:monitor`
3. קרא את הקוד ב-**src/**
4. התאם אישית לצרכים שלך
5. קרא **CONTRIBUTING.md** ותרום

---

## 📁 מבנה מלא

```
tradovate-multi-account/
│
├── 📂 src/                         # קוד מקור (1,780 שורות)
│   ├── TradovateClient.js
│   ├── MultiAccountManager.js
│   ├── TradovateWebSocketClient.js
│   ├── utils.js
│   ├── index.js
│   ├── advanced-examples.js
│   └── portfolio-manager.js
│
├── 📂 examples/                    # דוגמאות שימוש
│   ├── quick-start.js
│   ├── place-orders.js
│   ├── risk-monitor.js
│   └── README.md
│
├── 📖 README.md                    # תיעוד ראשי
├── 📖 GUIDE.md                     # מדריך מפורט (650+ שורות)
├── 📖 QUICK_SETUP.md               # התקנה מהירה
├── 📖 START_HERE.md                # התחל כאן!
├── 📖 CHECKLIST.md                 # רשימת בדיקות
├── 📖 PROJECT_SUMMARY.md           # סיכום פרויקט
├── 📖 CHANGELOG.md                 # היסטוריה
├── 📖 CONTRIBUTING.md              # תרומה
├── 📖 INDEX.md                     # המפה הזו
│
├── ⚙️ package.json                 # הגדרות NPM
├── ⚙️ config.example.json          # דוגמת תצורה
├── ⚙️ .env.example                 # דוגמת סביבה
├── ⚙️ .gitignore                   # Git ignore
│
└── 📄 LICENSE                      # רישיון ISC
```

---

## 🎯 מטרת כל קובץ

### תיעוד
- **README** = סקירה + API
- **GUIDE** = למידה מעמיקה
- **QUICK_SETUP** = התחלה מהירה
- **START_HERE** = הוראות לאחר יצירה
- **CHECKLIST** = בדיקת תקינות

### קוד
- **TradovateClient** = חיבור לחשבון בודד
- **MultiAccountManager** = ניהול מספר חשבונות
- **utils** = פונקציות עזר
- **examples** = דוגמאות מעשיות

---

## 🔍 חיפוש מהיר

**רוצה ללמוד על...?**
- **חיבור בסיסי** → START_HERE.md, examples/quick-start.js
- **הזמנות** → examples/place-orders.js, GUIDE.md
- **סיכונים** → examples/risk-monitor.js, utils.js
- **ניטור** → portfolio-manager.js, GUIDE.md
- **API** → README.md, TradovateClient.js
- **התאמה אישית** → GUIDE.md, src/

**יש בעיה?**
- **התקנה** → QUICK_SETUP.md, CHECKLIST.md
- **שגיאות** → START_HERE.md (פתרון בעיות)
- **שאלות** → GUIDE.md (FAQ)

---

## 📞 עזרה

- יש שאלה? → קרא **GUIDE.md**
- יש באג? → קרא **CONTRIBUTING.md**
- צריך תמיכה? → Tradovate API Docs

---

## 🎉 סטטיסטיקות

- **קבצי קוד:** 7
- **קבצי דוגמה:** 3
- **קבצי תיעוד:** 9
- **שורות קוד:** ~1,780
- **שורות תיעוד:** ~2,000+
- **פונקציות:** 40+

---

## ✅ Quick Reference

```powershell
# התקנה
npm install

# הגדרה
copy config.example.json config.json

# הרצה
npm start

# עזרה
עיין ב-START_HERE.md
```

---

**מסמך זה:** מפת ניווט לכל הפרויקט
**עודכן:** נובמבר 2025
**גרסה:** 1.0.0

---

🚀 **התחל ב-[START_HERE.md](START_HERE.md)!**
