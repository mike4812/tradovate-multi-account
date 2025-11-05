# ✅ Checklist - רשימת בדיקות

השתמש ברשימה זו כדי לוודא שהכל מוכן לעבודה.

---

## 📋 התקנה ראשונית

- [ ] Node.js מותקן (גרסה 14+)
  - בדוק: `node --version`
  - אם לא: הורד מ- https://nodejs.org/

- [ ] npm מותקן
  - בדוק: `npm --version`
  - צריך להיות מותקן עם Node.js

- [ ] החבילות הותקנו
  - [ ] הרצת: `npm install`
  - [ ] אין שגיאות בהתקנה
  - [ ] תיקיית `node_modules` קיימת

---

## 🔧 הגדרה

- [ ] קובץ config.json קיים
  - [ ] העתקת מ-config.example.json
  - [ ] `copy config.example.json config.json`

- [ ] פרטי חיבור Tradovate מלאים
  - [ ] username
  - [ ] password
  - [ ] appId
  - [ ] appVersion
  - [ ] cid (מ-Tradovate API settings)
  - [ ] sec (מ-Tradovate API settings)

- [ ] הגדרות סביבה נכונות
  - [ ] `isDemo: true` לסביבת Demo
  - [ ] או `isDemo: false` ל-Live (זהירות!)

---

## 🧪 בדיקה בסיסית

- [ ] הרצת `npm start`
  - [ ] אין שגיאות
  - [ ] רואה הודעת חיבור
  - [ ] רואה מידע על החשבון

- [ ] כל החשבונות מתחברים
  - [ ] Authentication successful לכל חשבון
  - [ ] רואה Account ID
  - [ ] רואה Balance

---

## 📊 בדיקת תכונות

- [ ] קבלת מידע עובדת
  - [ ] Balance מוצג נכון
  - [ ] Positions מוצגות (אם יש)
  - [ ] Orders מוצגים (אם יש)

- [ ] פקודות NPM עובדות
  - [ ] `npm start` ✅
  - [ ] `npm run advanced` ✅
  - [ ] `npm run portfolio` ✅

- [ ] דוגמאות עובדות
  - [ ] `node examples/quick-start.js` ✅
  - [ ] `node examples/risk-monitor.js` ✅

---

## 🔐 בטיחות

- [ ] config.json לא ב-Git
  - [ ] רשום ב-.gitignore
  - [ ] לא משותף בשום מקום

- [ ] משתמש ב-Demo תחילה
  - [ ] `isDemo: true` בהתחלה
  - [ ] נבדק שהכל עובד
  - [ ] רק אז עובר ל-Live

- [ ] גיבוי של config.json קיים
  - [ ] שמור עותק במקום בטוח
  - [ ] לא משותף עם אחרים

---

## 📖 תיעוד

- [ ] קראתי את README.md
- [ ] קראתי את QUICK_SETUP.md
- [ ] מכיר את הפקודות הבסיסיות
- [ ] יודע איפה למצוא עזרה (GUIDE.md)

---

## 🎯 שימוש מתקדם (אופציונלי)

- [ ] ניסיתי דוגמאות מתקדמות
  - [ ] advanced-examples.js
  - [ ] portfolio-manager.js

- [ ] ניסיתי ניטור רציף
  - [ ] `npm run portfolio:monitor`
  - [ ] עובד כמו שצריך

- [ ] ניסיתי ייצוא נתונים
  - [ ] `npm run portfolio:export`
  - [ ] הקובץ נוצר

- [ ] קראתי את GUIDE.md המפורט

---

## 🚨 בעיות נפוצות - פתרתי

- [ ] "npm not found"
  - ✅ התקנתי Node.js

- [ ] "config.json not found"
  - ✅ יצרתי config.json מ-config.example.json

- [ ] "Authentication failed"
  - ✅ בדקתי username/password
  - ✅ בדקתי CID/SECRET
  - ✅ בדקתי isDemo setting

- [ ] "Cannot find module"
  - ✅ הרצתי `npm install`

---

## 🎉 סיימתי!

אם סימנת את כל הפריטים בחלק "התקנה ראשונית" ו"הגדרה" ו"בדיקה בסיסית", אתה מוכן לעבודה!

### צעדים הבאים:
1. ✅ התחל עם `npm start`
2. ✅ נסה דוגמאות ב-examples/
3. ✅ קרא את GUIDE.md לתכונות מתקדמות
4. ✅ התאם אישית לצרכים שלך

---

**בהצלחה! 🚀📈**

---

💡 **טיפ:** שמור קובץ זה והשתמש בו כל פעם שמתקין מחדש או מגדיר סביבה חדשה.
