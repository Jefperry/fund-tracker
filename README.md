# Treasury — Team Contributions Dashboard

A multi-currency contribution tracker for distributed teams. Records who paid what, when, in which currency, with live FX conversion locked at transaction time. Public read-only view for transparency, single admin account for recording payments.

**Features:**

- Multi-currency support (USD, EUR, CHF, CAD, RUB) with live exchange rates
- Single admin authentication (only the account you create can modify data)
- Public read-only dashboard (shareable URL, no login required for viewing)
- Per-member contribution history with currency conversion
- Time-based filtering (this month, last week, last 2 weeks, custom ranges)
- Locked USD values at payment time (FX fluctuations don't change historical records)
- Responsive design (works on mobile, tablet, desktop)

---

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** Supabase (Postgres + Auth + Row-Level Security)
- **Deployment:** Vercel
- **FX Data:** open.er-api.com (free tier, no API key required)

---

## Prerequisites

1. **Node.js 18+** — [Download here](https://nodejs.org/)
2. **Git** — [Download here](https://git-scm.com/)
3. **A Supabase account** (free tier) — [Sign up here](https://supabase.com/)
4. **A Vercel account** (free tier) — [Sign up here](https://vercel.com/)
5. **A GitHub account** — [Sign up here](https://github.com/) (to deploy from repo)

---

## Step 1: Set Up Supabase

### 1.1 Create a New Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com/)
2. Click **"New project"**
3. Choose your organization (or create one)
4. Fill in:
   - **Name:** `treasury` (or anything you like)
   - **Database Password:** Generate a strong password (save it — you won't need it often, but keep it safe)
   - **Region:** Choose the region closest to your team
5. Click **"Create new project"** and wait ~2 minutes for provisioning

### 1.2 Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `supabase/schema.sql` from this repo
4. Paste into the SQL editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. You should see a green success message. The tables `members` and `transactions` are now created with Row-Level Security enabled.

### 1.3 Disable Sign-Ups (Critical for Single-Account Constraint)

This step enforces the "only one admin account" rule:

1. Go to **Authentication** → **Providers** (left sidebar)
2. Find **Email** in the providers list
3. Click the **⋮** menu next to Email → **Edit configuration**
4. **Uncheck** the box labeled **"Enable Sign Ups"**
5. Click **"Save"**

Now no one can create new accounts via the sign-up flow. You'll manually create the single admin account next.

### 1.4 Create the Admin User

1. Go to **Authentication** → **Users** (left sidebar)
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email:** Your admin email (e.g., `president@yourteam.com`)
   - **Password:** A strong password (this is what you'll use to sign in to the dashboard)
   - **Auto Confirm User:** Check this box (so you don't need to verify email)
4. Click **"Create user"**

This is the **only** account that will be able to sign in. Anyone else who tries to log in will be rejected.

### 1.5 Get Your Supabase Credentials

1. Go to **Settings** → **API** (left sidebar, gear icon → API)
2. Copy these two values (you'll need them for Vercel):
   - **Project URL** (looks like `https://abcdefghijk.supabase.co`)
   - **`anon` `public`** key (the long string under "Project API keys")

---

## Step 2: Deploy to Vercel

### 2.1 Push This Code to GitHub

1. Clone this repo (or download it as a ZIP and extract)
2. If you haven't already, initialize a git repo:
   ```bash
   cd treasury
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Create a new repo on GitHub (name it `treasury` or whatever you like)
4. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/treasury.git
   git branch -M main
   git push -u origin main
   ```

### 2.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com/) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your `treasury` repo from GitHub
4. Vercel auto-detects Next.js — click **"Deploy"** but **WAIT!**
5. Before deploying, click **"Environment Variables"** and add these two:
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`  
     **Value:** Your Supabase Project URL (from Step 1.5)
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
     **Value:** Your Supabase `anon public` key (from Step 1.5)
6. Now click **"Deploy"**

Vercel will build and deploy your app in ~2 minutes. When done, you'll get a live URL like `https://treasury-abc123.vercel.app`.

---

## Step 3: Test Your Deployment

### 3.1 Visit the Dashboard (Read-Only View)

1. Open your Vercel deployment URL in a browser
2. You should see the dashboard with **zero members** and **zero payments** (it's empty because you haven't added any data yet)
3. Notice the **"Admin sign-in"** button in the top-right — this is for you

### 3.2 Sign In as Admin

1. Click **"Admin sign-in"**
2. Enter the **email** and **password** you created in Step 1.4
3. Click **"Sign in"**
4. You should be redirected back to the dashboard, now with an **"Admin"** badge and action buttons visible

### 3.3 Add Your First Member

1. Click **"+ Member"** in the filter bar
2. Fill in:
   - **Name:** e.g., "Alice Chen"
   - **Country:** Select their country (this auto-sets their default currency)
   - **Note:** (optional) e.g., "Co-founder, engineering"
3. Click **"Add member"**
4. The member now appears in the table

### 3.4 Record a Payment

1. Click **"+ Record payment"**
2. Select the member you just added
3. Enter:
   - **Amount:** e.g., 100
   - **Currency:** Their currency (or override it)
   - **Date:** When they paid (defaults to today)
   - **Note:** (optional) e.g., "October contribution"
4. Click **"Record payment"**
5. The payment appears in the "Recent payments" panel, and the member's total is updated

### 3.5 Test the Read-Only View

1. Sign out (click **"Sign out"** in the header)
2. The dashboard is still visible, but all action buttons (Add, Edit, Delete) are gone
3. Share this URL with your team — they can view the ledger but not modify it
4. Only you (with the admin credentials) can sign back in and record/edit/delete data

---

## Step 4: Share with Your Team

Your dashboard is now live. Here's what to share:

1. **Dashboard URL:** `https://your-deployment.vercel.app`  
   → Anyone with this link can view contributions (read-only)

2. **Admin sign-in:** Only you have the credentials. Keep them private.

3. **How it works for members:**
   - They visit the URL
   - They see who paid, how much, when, in which currency, and the USD equivalent
   - They can filter by time period (this month, last week, custom range)
   - They can search for specific members
   - They **cannot** add, edit, or delete anything

4. **How it works for you (admin):**
   - Visit the URL and click "Admin sign-in"
   - Enter your credentials
   - You can now:
     - Add members
     - Record payments (pick the member, enter amount + currency, select date)
     - Edit members or payments
     - Delete members or payments (with confirmation)
   - Sign out when done

---

## Architecture Notes

### Database Schema

- **`members`** table: `id`, `name`, `country`, `country_code`, `currency`, `note`, `added_at`
- **`transactions`** table: `id`, `member_id` (FK), `amount`, `currency`, `amount_usd`, `rate_used`, `date`, `note`, `created_at`

### Row-Level Security (RLS)

- **Public read:** Anyone can view members and transactions (no auth required)
- **Authenticated write:** Only signed-in users can insert/update/delete
- **Single account enforcement:** Handled by disabling sign-ups + manually creating one user

### Currency Conversion

- Live FX rates fetched from `open.er-api.com/v6/latest/USD` (free, no API key)
- Rates cached for 1 hour in Next.js (see `src/lib/fx.ts`)
- **USD values are locked at transaction time** — if EUR tanks next month, October's "100 EUR" payment still shows the USD value it was worth in October
- Fallback rates hardcoded in case API is down

### Authentication Flow

- **Public pages:** Dashboard is server-rendered, fetches data on every load (no caching)
- **Login page:** `/login` → calls `signInWithPassword` → redirects to `/`
- **Sign-out:** Calls `/auth/signout` route → clears session → redirects to `/`
- **Middleware:** Refreshes auth session on every request (prevents stale tokens)

### Why Vercel + Supabase?

- **Vercel:** Free tier, instant deploys from GitHub, global CDN, zero config
- **Supabase:** Free Postgres + Auth + RLS, 500MB DB (plenty for a 7-person team), no credit card required
- **No backend code:** Everything is Next.js server actions + Supabase client libraries
- **No complex state management:** Dashboard fetches fresh data on every page load

---

## Troubleshooting

### "Invalid credentials" when signing in

- Double-check the email/password you created in Supabase (Step 1.4)
- Make sure you disabled sign-ups (Step 1.3) — this doesn't affect existing users, only prevents new ones

### Members or payments aren't showing up

- Check the Supabase Table Editor (left sidebar → Table Editor) — do you see rows in `members` and `transactions`?
- If empty, RLS might be blocking inserts. Go to SQL Editor and run:
  ```sql
  SELECT auth.uid(); -- If this returns NULL, you're not authenticated
  ```
- Sign in first, then try adding data

### FX rates showing fallback values

- `open.er-api.com` free tier has no rate limits, but if it's down, the app uses hardcoded fallbacks
- Check the Network tab in browser DevTools — is the FX API call succeeding?

### Deployment failed on Vercel

- Check the build logs in Vercel dashboard
- Common issue: Missing env vars. Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel → Settings → Environment Variables
- Re-deploy after adding env vars

### "Project paused" message in Supabase

- Free tier projects pause after 7 days of inactivity
- Click "Resume" in the Supabase dashboard (takes ~10 seconds)
- As long as your team accesses the dashboard at least once a week, it won't pause

---

## Local Development (Optional)

If you want to run this locally before deploying:

1. Clone the repo:

   ```bash
   git clone https://github.com/YOUR_USERNAME/treasury.git
   cd treasury
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` (copy from `.env.local.example`):

   ```bash
   cp .env.local.example .env.local
   ```

4. Fill in your Supabase credentials in `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000` in your browser

---

## Future Enhancements (Ideas)

- **CSV export** — Download the ledger as a spreadsheet
- **Payment reminders** — Email members who haven't paid in X days
- **Multi-admin** — Support multiple admin accounts (requires Supabase Auth changes)
- **Payment methods** — Track how people paid (bank transfer, PayPal, cash)
- **Goals/targets** — Set a fundraising goal and show progress
- **Charts** — Visualize contributions over time with Chart.js or Recharts
- **Webhooks** — Auto-record payments via Stripe/PayPal webhooks

---

## License

MIT — do whatever you want with this code.

---

## Support

Questions? Open an issue on GitHub or reach out to your team's admin (the person who set this up).

**Built with:** Next.js, Supabase, Vercel, and a lot of TypeScript.  
**Live FX data:** open.er-api.com (free tier, no API key required).
by Jefperry
