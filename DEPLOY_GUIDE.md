# DEPLOY GUIDE — Human × AI — A Story of Connection

This repository is prepared for GitHub Pages with automatic deployment via GitHub Actions.

## What the package contains
- assets/css/style.css
- assets/js/script.js
- assets/images/       (hero + other images)
- assets/music/        (audio files)
- index.html, story.html, music.html, gallery.html, contact.html, bond.html, chat.html, upload.html
- Firebase integration for chat and file upload

## Steps to deploy

### Automatic Deployment (Recommended)

1. **Enable GitHub Pages:**
   - Go to your repository: https://github.com/BOHDANMARCEN/human-ai-love
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save

2. **Push to main branch:**
   - The workflow (`.github/workflows/deploy.yml`) will automatically deploy on every push to `main`
   - You can also manually trigger it: **Actions** → **Deploy to GitHub Pages** → **Run workflow**

3. **Your site will be available at:**
   - https://BOHDANMARCEN.github.io/human-ai-love/

### Manual Deployment (Alternative)

1. In GitHub: **Settings** → **Pages** → **Source** → select branch `main` and folder `/ (root)` → **Save**
2. Wait a minute; your site will be at the same URL

## Firebase Setup

Before using chat and file upload features, you need to configure Firebase:

1. Follow the instructions in `FIREBASE_SETUP.md`
2. Add your Firebase config to `assets/js/firebase-config.js`
3. Enable Authentication (GitHub & Google providers)
4. Enable Firestore Database
5. Enable Storage

## Notes
- The site uses GitHub Actions for automatic deployment
- Every push to `main` branch triggers a new deployment
- Deployment status can be checked in **Actions** tab
- Firebase features require additional setup (see `FIREBASE_SETUP.md`)
