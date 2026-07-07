# BEN SPORTS — Platform (v1 Scaffold)

India's grassroots cricket management platform. This is the initial scaffold + Home page.

## Stack

React + Vite + Tailwind CSS. React Router for navigation. Firebase (Firestore/Auth/Storage) is intentionally **not** wired in yet — all content is served from `src/data/*.json`, shaped exactly like the future Firestore collections (`tournaments`, `teams`, `announcements`, `stats`), so swapping in Firebase later means replacing a data-fetching hook, not rewriting components.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Project structure

```
src/
  data/                 # Mock "Firestore collections" (JSON)
  components/
    layout/              # Navbar, Footer — shared across every page
    ui/                  # Button, Card, SectionEyebrow, SeamDivider — primitives
    home/                # Hero, AnnouncementBanner, FeaturedTournament, PlatformStats, QuickNav
  pages/                 # Route-level components (Home.jsx is fully built;
                         # Tournaments/Teams/Heroes/Gallery/Shop/Contact/Login
                         # are placeholder stubs wired into routing, ready to
                         # be replaced module-by-module)
  App.jsx                # Route table
  main.jsx               # Entry point, Router provider
```

## Design system

- **Colors** — deep near-black background (`bg`), cricket-pitch green primary
  accent (`pitch`), bail-gold secondary accent (`bail`), off-white text (`ink`),
  muted gray for secondary text (`ink-muted`). All defined as Tailwind theme
  tokens in `tailwind.config.js` — never hard-code hex values in components.
- **Type** — Space Grotesk (display/headlines), Inter (body), JetBrains Mono
  (scores and stats — the `.scoreboard-digit` utility in `index.css` applies
  the mono font with a subtle pitch-green glow).
- **Signature element** — the seam-stitch divider (`SeamDivider.jsx`), a
  cricket-ball-seam motif used between homepage sections instead of a plain
  hairline rule.
- **Homepage philosophy** — navigation-first, not scrolling-first: Hero →
  Announcement → Featured Tournament → Platform Stats (scoreboard strip) →
  Quick Navigation grid → Footer. No Featured Teams or Top Players sections —
  those live on their own pages.

## Next modules (recommended build order)

1. Tournament Hub (`/tournaments/:id`) — Overview, Rules, Fixtures, Groups,
   Points Table, Teams, Players, Gallery, Results, Statistics, Announcements.
2. Match Page — Live Score, Batting/Bowling Scorecards, Fall of Wickets,
   Partnerships, Match Summary, Awards, Gallery, Statistics.
3. Teams, Heroes, Gallery, Shop, Contact, Login (role-based dashboards).

## Deployment

Designed for Vercel. `npm run build` outputs a static `dist/` folder — no
server-side requirements for v1.
