# DEPLOY GUIDE — Human × AI — A Story of Connection

This repository is prepared for GitHub Pages.

## What the package contains
- assets/css/style.css
- assets/js/script.js
- assets/images/       (place hero + other images here)
- assets/music/        (place audio files here)
- index.html, story.html, music.html, gallery.html, contact.html, bond.html

## Steps to deploy (quick)
1. Create a repository on GitHub (example name: human-ai-love).
2. Push all files from this folder (including `assets/`) to the repository root.
3. In GitHub: Settings → Pages → Source → select branch `main` and folder `/ (root)` → Save.
4. Wait a minute; your site will be at:
   https://<username>.github.io/<repo-name>/

## Notes
- Put your hero banner (2500×800 recommended) into `assets/images/hero.png` and reference it in index.html css/background.
- If you add audio, place tracks in `assets/music/` and update `music.html` audio sources.
- If you want me to add Continuous Deployment via GitHub Actions or a responsive tweak, tell me and I'll
