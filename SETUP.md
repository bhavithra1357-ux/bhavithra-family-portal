# 🌷 Bhavithra Family Portal — Setup Guide

This guide gets you a real, working website with a shareable link.
You will **not write any code**. You will only copy-paste a few values.
Total time: about 15 minutes, once.

There are 3 steps:
1. Create your free database (Supabase) — 5 min
2. Put your project on GitHub — 5 min
3. Deploy it to Vercel to get your link — 5 min

---

## STEP 1: Create your database (Supabase)

1. Go to **supabase.com** and click **Start your project**. Sign up (free, no credit card).
2. Click **New Project**.
   - Name: `bhavithra-family-portal`
   - Database password: pick anything, save it somewhere safe
   - Region: pick the one closest to you
   - Click **Create new project** and wait ~1 minute while it sets up.
3. Once it's ready, on the left sidebar click **SQL Editor**.
4. Click **New query**.
5. Open the file `supabase-setup.sql` (included in this project), copy **everything** in it, and paste it into the SQL editor.
6. Click **Run** (bottom right). You should see "Success. No rows returned." That means your database and photo storage are ready. ✅
7. Now on the left sidebar, click the gear icon **Project Settings** → **API**.
8. You'll see two values you need:
   - **Project URL** → looks like `https://abcdefgh.supabase.co`
   - **anon public key** → a long string of letters/numbers
9. Keep this tab open — you'll need these two values in Step 3.

---

## STEP 2: Put the project on GitHub

GitHub is just a place to store your project's code so Vercel (Step 3) can grab it.

1. Go to **github.com** and sign up if you don't have an account (free).
2. Click the **+** icon top right → **New repository**.
   - Name it: `bhavithra-family-portal`
   - Keep it **Public** or **Private**, your choice
   - Click **Create repository**
3. On the new repo page, click **uploading an existing file**.
4. Drag and drop **all the project files and folders** (everything except `node_modules`, which doesn't exist yet anyway) into the upload box.
5. Scroll down, click **Commit changes**.

That's it — your code is now on GitHub.

---

## STEP 3: Deploy to Vercel (this gives you your shareable link)

1. Go to **vercel.com** and sign up using your **GitHub account** (one click).
2. Click **Add New Project**.
3. Find and select your `bhavithra-family-portal` repository → click **Import**.
4. Before clicking deploy, click **Environment Variables** and add these 3:

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | (paste your Project URL from Step 1) |
   | `VITE_SUPABASE_ANON_KEY` | (paste your anon public key from Step 1) |
   | `VITE_ADMIN_PASSWORD` | (make up your own admin password, e.g. `BhavithraRules2026`) |

5. Click **Deploy**. Wait about 1 minute.
6. You'll see a screen with confetti and a link like:
   `https://bhavithra-family-portal.vercel.app`

🎉 **That link is what you share with your friends.**

---

## How to use it day-to-day

- **Share this with friends:** `https://bhavithra-family-portal.vercel.app/#/join`
  (sends them straight to the form — or just share the homepage link and they can tap "Join Family")
- **Friends check their status anytime:** they go to the site and tap "Check Status", enter their Application ID (e.g. `BVP12345`). They will only ever see their own application — never anyone else's.
- **You manage everything:** go to `https://bhavithra-family-portal.vercel.app/#/admin`, enter the admin password you set in Step 3, and you can see every application, approve, reject, and assign roles + connections.

## Want to change anything later?

- **Change the admin password:** Vercel dashboard → your project → Settings → Environment Variables → edit `VITE_ADMIN_PASSWORD` → Redeploy.
- **Change colors/text:** edit the relevant file and re-upload to GitHub (Vercel auto-redeploys). If this ever feels confusing, just paste the file you want changed back to Claude and ask for the edit — you'll get an updated file to re-upload.
- **See all data directly:** Supabase dashboard → Table Editor → `applications` table shows every entry in spreadsheet form.

## Notes on privacy

- The admin page is protected by your password, but the URL itself (`/#/admin`) isn't secret — anyone who finds it still needs the password to do anything.
- Friends checking status can only retrieve the one record matching the exact Application ID they type in. There's no listing or search of everyone's data on that page.
- Photos are stored in a public bucket (needed so they display on the Members page), so don't upload anything friends wouldn't want publicly viewable via direct link.
