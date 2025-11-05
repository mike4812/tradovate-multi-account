# Contributing to Tradovate Multi-Account Manager

תודה על העניין לתרום לפרויקט! 🎉

## כיצד לתרום

### דיווח על באגים

אם מצאת באג, אנא:
1. בדוק אם הבאג כבר דווח
2. צור Issue חדש עם:
   - תיאור ברור של הבעיה
   - שלבים לשחזור
   - התנהגות צפויה vs. התנהגות בפועל
   - סביבת העבודה (OS, Node.js version, etc.)
   - לוגים/שגיאות רלוונטיים

### הצעת פיצ'רים חדשים

1. צור Issue עם תיאור הפיצ'ר
2. הסבר למה זה שימושי
3. תן דוגמאות שימוש

### תרומת קוד

1. **Fork** את הפרויקט
2. צור **branch** חדש: `git checkout -b feature/amazing-feature`
3. **Commit** השינויים: `git commit -m 'Add amazing feature'`
4. **Push** ל-branch: `git push origin feature/amazing-feature`
5. פתח **Pull Request**

## קוד Style Guidelines

### JavaScript
- השתמש ב-ES6+ features
- השתמש ב-async/await במקום promises chains
- הוסף תיעוד JSDoc לפונקציות
- שמות משתנים ברורים ותיאוריים

דוגמה:
```javascript
/**
 * Get account balance
 * @param {string} accountId - The account ID
 * @returns {Promise<Object>} Balance information
 */
async function getBalance(accountId) {
  // Implementation
}
```

### עקרונות כתיבה
- קוד נקי וקריא
- פונקציות קצרות וממוקדות
- טיפול בשגיאות נכון
- אל תשאיר console.logs מיותרים

## בדיקות

לפני Pull Request:
1. בדוק שהקוד עובד
2. ודא שאין שגיאות
3. בדוק עם Demo accounts לפני Live
4. עדכן תיעוד אם נדרש

## Structure

```
src/
├── TradovateClient.js        # Core client
├── MultiAccountManager.js    # Manager
├── utils.js                  # Utilities
└── examples/                 # Usage examples
```

## תיעוד

- עדכן README.md אם צריך
- הוסף דוגמאות שימוש
- תרגם לעברית אם אפשר

## License

כל תרומה מסכימה ל-ISC License של הפרויקט.

## שאלות?

פתח Issue או צור קשר.

---

**תודה על התרומה! 🙏**
