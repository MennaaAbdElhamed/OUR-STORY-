# Our Story — Deployment Guide

This is a static site (plain HTML/CSS/JS, no build step needed). The most common cause of a
Netlify "site not found" error is that the uploaded zip had everything wrapped inside an extra
folder, so `index.html` wasn't at the top level. This package fixes that — `index.html` is now
at the root, alongside `netlify.toml` and `vercel.json`.

## Easiest method: Netlify drag-and-drop (no account setup needed beyond signing in)

1. Go to https://app.netlify.com/drop
2. Drag the **entire unzipped folder** (not the .zip file itself) onto the page.
   - Make sure `index.html` is directly inside the folder you drag — not nested one level deeper.
3. Netlify uploads it and gives you a live URL in a few seconds.
4. Done. `netlify.toml` is already included, so no extra configuration is required.

If you'd rather connect it to a Netlify site via Git (GitHub/GitLab), just push this folder as
the repo root and set:
- Build command: *(leave empty)*
- Publish directory: `.`

## Alternative: Vercel

1. Go to https://vercel.com/new
2. Import the folder/repo (or drag-and-drop if using the Vercel CLI: `vercel --prod` from inside
   this folder).
3. Framework preset: "Other" — no build command needed.
4. `vercel.json` is already included for asset caching.

## Alternative: GitHub Pages

1. Push this folder's contents to a GitHub repo (files at the repo root, or in `/docs`).
2. Repo Settings → Pages → set source to the branch/folder you used.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

## Checklist if a deploy ever fails again

- `index.html` must be at the root of whatever you upload — not inside a subfolder.
- File names are case-sensitive on all of the above hosts (unlike Windows/Mac locally). All
  paths in this project are already lowercase and match the actual files exactly.
- No server/backend is required — everything (envelope animation, music, timeline) runs in the
  browser.
