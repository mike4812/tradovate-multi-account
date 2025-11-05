# 🌐 Tradovate Multi-Account Manager - Web Interface

## מבט כללי

ממשק web אינטראקטיבי ויפהפה לניהול מספר חשבונות Tradovate.

---

## ✨ תכונות

### 📊 Dashboard מתקדם
- תצוגה של יתרה כוללת בכל החשבונות
- מספר חשבונות מחוברים
- פוזיציות והזמנות פעילות
- ניתוח סיכונים בזמן אמת

### 👥 ניהול חשבונות
- רשימת כל החשבונות
- סטטוס חיבור לכל חשבון
- יתרה, פוזיציות והזמנות לכל חשבון
- אינדיקטור רמת סיכון

### 📈 פוזיציות והזמנות
- טבלה מפורטת של כל הפוזיציות
- רווח/הפסד בזמן אמת
- רשימת הזמנות פעילות
- פילטר לפי חשבון

### ⚙️ הגדרות
- רענון אוטומטי
- התראות קוליות
- מעבר בין Demo ל-Live
- התנתקות מהירה

---

## 🚀 הפעלה

### התקנת תלויות
```powershell
npm install
```

### הפעלת השרת
```powershell
npm run web
```

או:
```powershell
npm run dev
```

האתר יהיה זמין ב: **http://localhost:3000**

---

## 📁 מבנה הקבצים

```
web/
├── index.html          # עמוד ראשי
├── css/
│   └── style.css       # עיצוב מלא ומרשים
└── js/
    └── app.js          # לוגיקת האפליקציה
```

---

## 🎨 עיצוב

האתר כולל:
- ✅ עיצוב מודרני ונקי
- ✅ תמיכה בעברית (RTL)
- ✅ אנימציות חלקות
- ✅ Responsive (מתאים לנייד)
- ✅ צבעים נעימים לעין
- ✅ קלות שימוש

---

## 💻 טכנולוגיות

- **HTML5** - מבנה סמנטי
- **CSS3** - עיצוב מתקדם עם Flexbox & Grid
- **Vanilla JavaScript** - ללא תלויות
- **Express.js** - שרת Node.js
- **Heebo Font** - פונט עברית יפה

---

## 🔧 התאמה אישית

### שינוי צבעים
ערוך את המשתנים ב-`css/style.css`:
```css
:root {
    --primary-color: #2563eb;
    --success-color: #10b981;
    --danger-color: #ef4444;
    /* ... */
}
```

### שינוי Port
```powershell
# Windows
$env:PORT=8080; npm run web

# Linux/Mac
PORT=8080 npm run web
```

### חיבור ל-Backend אמיתי
ערוך את `js/app.js` והחלף את הפונקציה `connectToAccounts()` עם קריאות API אמיתיות.

---

## 📊 צילומי מסך

### Dashboard
- סיכום כולל של כל החשבונות
- ניתוח סיכונים
- גרפים ויזואליים

### חשבונות
- כרטיסים לכל חשבון
- פרטים מלאים
- סטטוס בזמן אמת

### פוזיציות והזמנות
- טבלאות מסודרות
- צבעים לרווח/הפסד
- מידע מפורט

---

## 🚨 הערות חשובות

### 🎯 Demo Mode
כרגע האתר עובד במצב Demo עם נתונים מדומים.
לחיבור ל-Tradovate אמיתי, יש לחבר Backend.

### 🔐 אבטחה
- אל תשתף את האתר באינטרנט ללא אבטחה
- השתמש ב-HTTPS בסביבת production
- הגדר authentication למשתמשים

### 🌐 Production
לפריסה ל-production:
1. בנה את הקבצים
2. הגדר environment variables
3. השתמש ב-process manager (PM2)
4. הגדר reverse proxy (Nginx)

---

## 🎯 פיצ'רים עתידיים

רעיונות להרחבה:
- [ ] חיבור אמיתי ל-Tradovate API
- [ ] WebSocket לעדכונים בזמן אמת
- [ ] גרפים של מחירים (charts)
- [ ] היסטוריית מסחר
- [ ] ניהול הזמנות מהאתר
- [ ] התראות push
- [ ] מצב כהה (Dark mode)
- [ ] ייצוא דוחות PDF
- [ ] Mobile app

---

## 📱 Responsive

האתר מותאם לכל הגדלים:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

---

## 🆘 פתרון בעיות

### השרת לא עולה
```powershell
# בדוק אם הפורט תפוס
netstat -ano | findstr :3000

# נסה פורט אחר
$env:PORT=3001; npm run web
```

### האתר לא נטען
1. וודא ש-Express מותקן: `npm install`
2. בדוק את ה-console ב-browser (F12)
3. וודא שהקבצים בתיקייה `web/`

### שגיאות JavaScript
פתח Developer Tools (F12) → Console

---

## 📞 תמיכה

- 📖 README ראשי: [../README.md](../README.md)
- 📚 מדריך: [../GUIDE.md](../GUIDE.md)
- 🆘 בעיות: פתח Issue

---

## 🎉 תהנה!

האתר מוכן לשימוש. פשוט הרץ:
```powershell
npm run web
```

ופתח את: **http://localhost:3000**

---

**נבנה עם ❤️ עבור מסחרי Tradovate**

תאריך: נובמבר 2025
גרסה: 1.0.0
