# BEN SPORTS — Project Summary & Go-Live Guide

Paste this whole file to Gemini (or any AI) as context before asking it to make further
changes. It explains the stack, the data model, what's built, what's still a placeholder,
and exactly how to take the site live.

## 1. What this website is

A cricket club / tournament site called **BEN SPORTS**, built as a React single-page app.
It has a public storefront (sports goods shop), tournament announcements, and a
self-service team/player registration form — all backed by **Supabase** (Postgres +
Auth + file Storage). There is a **super admin** role that can upload products,
announcements, and approve/reject team registrations, directly from the live site.

## 2. Tech stack

- **Frontend:** React 18 + Vite, React Router v6, Tailwind CSS
- **Backend:** Supabase (hosted Postgres database, Supabase Auth, Supabase Storage) —
  there is no separate custom backend server; the React app talks to Supabase directly
  using the public "anon" key, and Postgres **Row Level Security (RLS)** policies
  enforce who can read/write what.
- **Hosting:** Vercel (a `vercel.json` is already in the repo for SPA routing)

## 3. Folder structure (what matters)

```
src/
  context/AuthContext.jsx      # Real Supabase session + role (source of truth for auth)
  pages/
    ProtectedRoute.jsx         # Route guard, checks session + role from AuthContext
    Login.jsx                  # Sign up / sign in (everyone signs up as "member")
    Shop.jsx                   # Public storefront: products + comments
    Admin.jsx                  # Super-admin only: Products / Announcements / Registrations tabs
    RegisterTeam.jsx           # Any logged-in user: register a team + players list
    LiveScoring.jsx            # NOT yet rebuilt on Supabase — still placeholder logic
    TeamFinance.jsx            # NOT yet rebuilt on Supabase — still placeholder logic
    Heroes.jsx, TournamentHub.jsx, Contact.jsx, Home.jsx  # mostly static content
  components/
    layout/Navbar.jsx, Footer.jsx
    ui/FileUpload.jsx          # File picker used by Admin for image uploads
    home/AnnouncementBanner.jsx # Homepage banner, pulls latest announcement from Supabase
  utils/supabaseClient.js      # Creates the Supabase client from env vars
supabase/schema.sql            # Run this in Supabase SQL Editor — creates everything
.env.example                   # Copy to .env, fill in your Supabase URL + anon key
```

## 4. Database schema (see `supabase/schema.sql` for the exact SQL)

| Table | Purpose | Who can write |
|---|---|---|
| `profiles` | One row per user, holds `role` (`member` / `team_admin` / `super_admin`) | Auto-created on signup; role only changed manually by project owner |
| `products` | Shop items: name, price, description, image_url | Insert/update/delete: `super_admin` only. Read: everyone |
| `product_comments` | Comments on a product | Insert: any logged-in user (own comments). Read: everyone |
| `announcements` | Tournament announcements with optional image | Insert/delete: `super_admin` only. Read: everyone |
| `team_registrations` | Self-service team + player sign-up | Insert: any logged-in user (their own). Approve/reject/delete: `super_admin` only |

**Storage buckets** (public, images only):
- `product-images` — shop product photos
- `announcement-images` — tournament announcement photos

Both buckets are public for *reading* (so `<img>` tags work with no auth), but
**uploads/deletes are restricted to `super_admin`** by storage RLS policies —
this is the piece that makes "upload from the site itself" both possible and secure.

## 5. Roles & how admin rights work

- Anyone can sign up → they become `role = 'member'` automatically (a Postgres
  trigger creates their `profiles` row).
- There is **no signup field** for choosing your own role — that was a security
  hole in the original code and has been removed.
- To make yourself `super_admin`, you run one SQL command yourself in the Supabase
  dashboard (see Step 5 below). After that, logging in shows an **Admin** link in
  the navbar.
- `team_admin` is a role reserved for `/teams` (Team Finance) and `/score` (Live
  Scoring) pages — also granted manually the same way.

## 6. What's fully working today

- Public shop with real product images, prices, and comments (Supabase-backed)
- Super-admin product upload/delete (with image upload to Storage)
- Super-admin tournament announcement upload/delete (with image), shown on homepage
- Team + player self-registration form, with a super-admin approve/reject queue
- Real authentication — no more `localStorage`-spoofable admin access

## 7. What's NOT done yet (still old placeholder/static logic)

- `LiveScoring.jsx` and `TeamFinance.jsx` — not yet connected to Supabase
- `Heroes.jsx`, `TournamentHub.jsx` — static content, not database-driven
- No payment gateway for the shop (currently a catalog + comments, not checkout)
- No email notifications when a registration is approved/rejected

If you ask Gemini (or me) to build any of the above, point it at this file first so
it reuses the same `profiles.role` / RLS pattern instead of inventing a new,
possibly less secure auth approach.

---

## 8. Step-by-step: go live

### Step 1 — Install dependencies
```
cd ben-sports
npm install
```

### Step 2 — Create the database & storage (Supabase)
1. Go to your Supabase project → **SQL Editor** → New query.
2. Paste the entire contents of `supabase/schema.sql` and run it.
   This creates all tables, security policies, and the two storage buckets in one go.

### Step 3 — Connect the app to Supabase
1. Copy `.env.example` to `.env`.
2. In Supabase: **Settings → API** → copy the **Project URL** and **anon public key**.
3. Paste them into `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxxx
   ```

### Step 4 — Test locally
```
npm run dev
```
Open the site, click **Login Portal → Sign up**, create your own account.

### Step 5 — Make yourself super admin
Back in Supabase → SQL Editor:
```sql
update public.profiles set role = 'super_admin' where email = 'you@example.com';
```
Log out and back in on the site — you'll now see the **Admin** link.

### Step 6 — Push to GitHub
```
git init
git add .
git commit -m "BEN SPORTS live build"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 7 — Deploy on Vercel
1. vercel.com → **Add New Project** → import your GitHub repo.
2. In **Environment Variables**, add the same two keys from `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy. Vercel will build with `npm run build` and serve `dist/` automatically
   (the routing rewrite for React Router is already in `vercel.json`).

### Step 8 — Verify on the live URL
- Sign up, confirm your email (Supabase sends a confirmation email by default).
- Log in as your super admin account → Admin → upload a test product image and a
  test announcement → confirm they appear on `/shop` and the homepage.
- Register a test team on `/register-team` → approve it from Admin → Registrations.

### Troubleshooting storage upload errors
- "new row violates row-level security policy" on upload → you're not logged in
  as `super_admin` yet (redo Step 5), or `schema.sql` wasn't fully run.
- Images upload but don't display → check the bucket is public: Supabase →
  Storage → bucket → **Settings** → "Public bucket" toggled on (schema.sql sets
  this automatically, but worth checking if you edited buckets manually).
- "Failed to fetch" on any Supabase call → double check `.env` values have no
  extra spaces/quotes and that you restarted `npm run dev` after editing `.env`.
