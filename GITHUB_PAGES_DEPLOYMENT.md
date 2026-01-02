# 🚀 Deploy Your Hackathon Guide to GitHub Pages

## 📋 Complete Step-by-Step Guide

### Step 1: Create GitHub Repository

1. Go to: https://github.com
2. Click "+" (top right) → "New repository"
3. Repository name: `bytequst-hackathon-guide`
4. Description: "Complete guide for ByteQuest Hackathon 2026"
5. **Make it PUBLIC** (required for GitHub Pages)
6. ✅ Check "Add a README file"
7. Click "Create repository"

---

### Step 2: Prepare Your Files

**Create a folder on Desktop:**

```cmd
cd Desktop
mkdir bytequst-hackathon-guide
cd bytequst-hackathon-guide
```

**Copy all website files here:**
- index.html
- team-workflow.html
- safe-pull.html
- git-commands.html
- branch-work.html
- commits-count.html
- styles.css
- script.js

---

### Step 3: Initialize Git and Push

**Open terminal in your folder:**

```cmd
cd Desktop\bytequst-hackathon-guide

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Hackathon guide website"

# Add remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/bytequst-hackathon-guide.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" (left sidebar)
4. Under "Source":
   - Select "Deploy from a branch"
   - Branch: `main`
   - Folder: `/ (root)`
5. Click "Save"

**Wait 2-3 minutes...**

---

### Step 5: Get Your Live URL

**Your website will be live at:**
```
https://YOUR-USERNAME.github.io/bytequst-hackathon-guide/
```

**Example:**
```
https://rajan7013.github.io/bytequst-hackathon-guide/
```

---

## 📊 Quick Commands Reference

### First Time Setup:
```cmd
cd Desktop
mkdir bytequst-hackathon-guide
cd bytequst-hackathon-guide

# Copy all files here

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/bytequst-hackathon-guide.git
git branch -M main
git push -u origin main
```

### Update Website Later:
```cmd
cd Desktop\bytequst-hackathon-guide

# Make changes to files

git add .
git commit -m "Update guides"
git push origin main

# Wait 1-2 minutes, changes will be live!
```

---

## 🎯 Share with Team

**Send this link to your team:**
```
https://YOUR-USERNAME.github.io/bytequst-hackathon-guide/
```

**Or create a short link:**
1. Go to: https://bit.ly
2. Paste your GitHub Pages URL
3. Create short link
4. Share: `bit.ly/bytequst-guide`

---

## ✅ Verification Checklist

- [ ] Repository created on GitHub
- [ ] All files copied to local folder
- [ ] Git initialized and pushed
- [ ] GitHub Pages enabled in Settings
- [ ] Website is live (check URL)
- [ ] All pages working
- [ ] Text-to-speech working
- [ ] Navigation working
- [ ] Shared with team

---

## 🆘 Troubleshooting

### Issue: "Permission denied"
**Solution:**
```cmd
# Use Personal Access Token
# GitHub → Settings → Developer settings → Personal access tokens
# Generate new token → Copy it
# Use as password when pushing
```

### Issue: "404 Not Found"
**Solution:**
- Wait 5 minutes (GitHub Pages takes time)
- Check Settings → Pages → URL is correct
- Ensure repository is PUBLIC

### Issue: "Pages not showing in Settings"
**Solution:**
- Repository must be PUBLIC
- Must have at least one commit
- Refresh the page

---

**You're ready to deploy! Follow the steps above! 🚀**
