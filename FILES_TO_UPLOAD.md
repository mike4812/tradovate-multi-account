# 📦 אילו קבצים להעלות ל-GitHub?

## ✅ קבצים להעלאה (כן!)

### 📄 קבצי תיעוד
```
✅ README.md
✅ README_HE.md
✅ GUIDE.md
✅ QUICK_SETUP.md
✅ START_HERE.md
✅ WEB_START.md
✅ PROJECT_SUMMARY.md
✅ INDEX.md
✅ CHECKLIST.md
✅ CHANGELOG.md
✅ CONTRIBUTING.md
✅ GITHUB_UPLOAD.md
✅ GITHUB_QUICK.md
✅ COMMANDS.md
✅ LICENSE
```

### 💻 קבצי קוד (src/)
```
✅ src/TradovateClient.js
✅ src/MultiAccountManager.js
✅ src/TradovateWebSocketClient.js
✅ src/utils.js
✅ src/index.js
✅ src/advanced-examples.js
✅ src/portfolio-manager.js
✅ src/server.js
```

### 🌐 קבצי האתר (web/)
```
✅ web/index.html
✅ web/css/style.css
✅ web/js/app.js
✅ web/README.md
```

### 📝 דוגמאות (examples/)
```
✅ examples/quick-start.js
✅ examples/place-orders.js
✅ examples/risk-monitor.js
✅ examples/README.md
```

### ⚙️ קבצי תצורה
```
✅ package.json
✅ .gitignore
✅ config.example.json      ← דוגמה בלבד!
✅ .env.example             ← דוגמה בלבד!
```

---

## ❌ קבצים שלא להעלות (לא!)

### 🔐 קבצים רגישים
```
❌ config.json             ← יש בו סיסמאות!
❌ .env                    ← משתני סביבה רגישים
❌ *.key                   ← מפתחות API
❌ secrets/                ← כל תיקיית סודות
```

### 📦 תלויות
```
❌ node_modules/           ← גדול מדי (יותקן עם npm install)
❌ package-lock.json       ← (אופציונלי - לפי העדפה)
```

### 🗑️ קבצי מערכת
```
❌ .DS_Store               ← Mac files
❌ Thumbs.db               ← Windows files
❌ *.log                   ← Log files
❌ .vscode/                ← הגדרות אישיות (אופציונלי)
```

### 📊 נתונים
```
❌ portfolio-snapshot.json ← נתונים שנוצרו
❌ daily-reports.json      ← דוחות
❌ *.csv                   ← קבצי נתונים
```

---

## 🔍 איך לבדוק מה יועלה?

### לפני העלאה:
```powershell
# ראה מה Git יעלה
git status

# ראה את כל הקבצים (כולל מוסתרים)
git ls-files

# בדוק מה נמצא ב-.gitignore
cat .gitignore
```

---

## 📋 רשימת בדיקה מהירה

לפני `git push`, וודא:

- [ ] `config.json` **לא** ברשימה (רק `config.example.json`)
- [ ] `.env` **לא** ברשימה (רק `.env.example`)
- [ ] `node_modules/` **לא** ברשימה
- [ ] כל קבצי ה-`.js` כן ברשימה
- [ ] כל קבצי התיעוד כן ברשימה
- [ ] `package.json` כן ברשימה

### בדיקה:
```powershell
git status

# אם רואה config.json - זה רע!
# אם רואה node_modules/ - זה רע!
# אם רואה רק קבצי .js, .md, package.json - זה טוב!
```

---

## 🛡️ ה-.gitignore שלך (כבר מוגדר!)

הקובץ `.gitignore` שלך כבר מוגדר נכון:

```gitignore
node_modules/
.env
config.json
*.log
.DS_Store
```

זה אומר שהקבצים האלה **אוטומטית לא יועלו**.

---

## 💡 מה קורה אם בטעות העלית קובץ רגיש?

### אם עדיין לא עשית `git push`:
```powershell
# הסר מה-staging
git reset HEAD config.json

# או בטל את ה-commit האחרון
git reset --soft HEAD~1
```

### אם כבר עשית `git push`:
```powershell
# הסר מ-Git אבל שמור במחשב
git rm --cached config.json

# commit
git commit -m "Remove sensitive file"

# push
git push
```

**⚠️ חשוב:** אם העלית סיסמה אמיתית - **שנה אותה מיד**!
הקובץ נשאר בהיסטוריה של Git.

---

## 📊 גודל הפרויקט

### עם node_modules:
```
~150 MB (לא להעלות!)
```

### בלי node_modules:
```
~2-5 MB (מעולה להעלאה!)
```

---

## 🎯 סיכום מהיר

### העלה:
✅ כל קבצי הקוד (`.js`)
✅ כל קבצי התיעוד (`.md`)
✅ `package.json`
✅ קבצי דוגמה (`.example`)
✅ `.gitignore`

### אל תעלה:
❌ `config.json` (סיסמאות!)
❌ `node_modules/` (גדול מדי)
❌ `.env` (משתני סביבה)
❌ קבצי log

---

## 🔄 התהליך הנכון

```powershell
# 1. ראה מה ישתנה
git status

# 2. הוסף רק מה שצריך
git add .

# 3. בדוק שוב
git status

# 4. אם הכל טוב - commit
git commit -m "Your message"

# 5. העלה
git push
```

---

## 📸 דוגמה - מה אתה אמור לראות

### ✅ טוב:
```
Changes to be committed:
  new file:   src/TradovateClient.js
  new file:   README.md
  new file:   package.json
  new file:   web/index.html
```

### ❌ רע:
```
Changes to be committed:
  new file:   config.json          ← לא טוב!
  new file:   node_modules/...     ← לא טוב!
  new file:   .env                 ← לא טוב!
```

אם אתה רואה את הקבצים הרעים - **עצור ותקן**!

---

## 🆘 עזרה מהירה

### שאלה: "האם להעלות את הקובץ X?"

**כלל פשוט:**
- יש בו סיסמה/API key? → ❌ לא
- זה `node_modules`? → ❌ לא
- זה קוד שכתבת? → ✅ כן
- זה תיעוד? → ✅ כן
- זה `.example`? → ✅ כן

### עדיין לא בטוח?
שאל את עצמך:
1. האם מישהו אחר צריך את זה כדי להריץ את הפרויקט?
2. האם יש בקובץ מידע רגיש?

אם כן לשאלה 1 ולא לשאלה 2 → העלה!

---

## 📦 מה המשתמש שמוריד יצטרך לעשות?

```bash
# 1. שכפל את הפרויקט
git clone https://github.com/USERNAME/tradovate-multi-account.git

# 2. התקן תלויות
cd tradovate-multi-account
npm install

# 3. צור config
cp config.example.json config.json

# 4. ערוך את config.json
# (מלא סיסמאות)

# 5. הרץ
npm run web
```

לכן `config.json` **לא** צריך להיות ב-GitHub!

---

**זכור:** אם אתה מסופק - אל תעלה! עדיף בטוח מאשר מצטער. 🔐

---

תאריך: נובמבר 2025
