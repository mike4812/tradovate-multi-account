# 🚀 העלאה מהירה ל-GitHub - פקודות בלבד

## התקנת Git (פעם אחת)
```powershell
# בדוק אם מותקן
git --version

# אם לא - הורד מ: https://git-scm.com/download/win
```

## הגדרה ראשונית (פעם אחת)
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## צעדי העלאה

### 1. אתחול Git
```powershell
cd c:\projects\argaman-capital-main\tradovate-multi-account
git init
```

### 2. הוספת קבצים
```powershell
git add .
git commit -m "Initial commit - Tradovate Multi-Account Manager"
```

### 3. צור Repository ב-GitHub
1. פתח https://github.com/
2. לחץ על + → New repository
3. שם: `tradovate-multi-account`
4. לחץ Create repository

### 4. חבר ל-GitHub
```powershell
# החלף USERNAME בשם המשתמש שלך ב-GitHub!
git remote add origin https://github.com/USERNAME/tradovate-multi-account.git
git branch -M main
git push -u origin main
```

**זהו! הפרויקט ב-GitHub!** 🎉

---

## עדכונים עתידיים

```powershell
git add .
git commit -m "תיאור השינוי"
git push
```

---

## בעיות?

### אין לך Personal Access Token?
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token
3. בחר `repo`
4. השתמש ב-token במקום סיסמה

### Repository not found?
```powershell
git remote -v
# בדוק שה-URL נכון
```

---

**מדריך מפורט:** [GITHUB_UPLOAD.md](GITHUB_UPLOAD.md)
