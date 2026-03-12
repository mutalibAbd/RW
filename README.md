# Zero-Cost Gallery

A **WebAR 3D product gallery** built with Next.js 14 and Supabase — designed to run indefinitely on **free tiers** with zero infrastructure cost.

Browse a curated collection of Draco-compressed 3D models and view them in **Augmented Reality** directly in your browser — no app install required.

---

## What This Project Does

Zero-Cost Gallery is a public-facing web application that lets visitors:

- **Browse** a grid of interactive 3D models displayed in the browser
- **View in AR** — point a phone camera at a real surface and see the 3D model appear in the room (Google's `<model-viewer>` bridges the GLB file to the platform's native AR runtime: AR Quick Look on iOS and Scene Viewer / WebXR on Android)
- **Enjoy a fast, lightweight experience** — every model is compressed with Draco so files stay under 5 MB

Product data (model URLs, names, descriptions, tags) is stored in a Supabase PostgreSQL database and fetched on the client. If the database is unavailable, the app gracefully falls back to locally bundled demo models.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router, static export) |
| Language | TypeScript |
| Styling | Tailwind CSS (Apple Retail aesthetic) |
| 3D / AR | [Google `<model-viewer>`](https://modelviewer.dev/) web component |
| Model compression | Draco via `@gltf-transform` |
| Database | [Supabase](https://supabase.com/) (PostgreSQL, free tier) |
| Hosting | GitHub Pages (static export via `next build`) |

---

## Key Features

- **Zero-cost architecture** — runs entirely on Supabase Free and GitHub Pages; no paid services required
- **WebAR without an app** — AR Quick Look (iOS Safari), Scene Viewer (Android), and WebXR fallback
- **Draco-compressed GLB models** — models optimized to ≤ 5 MB for fast load times within the 5 GB/month bandwidth limit
- **Supabase keep-alive** — a GitHub Actions cron job pings `/api/system/pulse` every 48 hours to prevent the free-tier database from pausing
- **Graceful fallback** — locally bundled demo models are shown if Supabase is unavailable
- **Apple Retail design** — clean, whitespace-heavy UI with smooth cubic-bezier animations

---

## Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (loads model-viewer script globally)
│   ├── page.tsx            # Home page: hero, product grid, footer
│   └── globals.css         # Tailwind base styles + custom Apple tokens
├── components/
│   └── ModelViewer.tsx     # 3D model viewer with AR button
├── types/
│   └── database.types.ts   # TypeScript types mirroring the Supabase schema
├── utils/
│   └── supabase/           # Supabase client helpers
├── supabase/
│   └── schema.sql          # Database schema (tables, RLS policies, triggers)
├── scripts/
│   └── optimize.js         # Draco compression script for GLB files
├── public/
│   └── models/             # Optimized GLB files served statically
├── docs/
│   └── SUPABASE_SETUP.md   # Step-by-step Supabase setup guide
├── .env.example            # Environment variable template
└── next.config.mjs         # Next.js config (static export, GitHub Pages)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A [Supabase](https://supabase.com/) account (free)

### 1. Clone the repository

```bash
git clone https://github.com/mutalibAbd/RW.git
cd RW
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-only, never expose to client
CRON_SECRET=your-random-secret                    # used to protect the keep-alive endpoint
```

> Find your URL and keys at **Supabase Dashboard → Settings → API**.

### 3. Set up the database

Follow the step-by-step guide in [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) to:
- Create the `products` and `system_health` tables
- Apply Row Level Security (RLS) policies
- Test with a sample product

### 4. (Optional) Optimize 3D models

Place raw `.glb` files into `raw-assets/` and run:

```bash
npm run optimize
```

This compresses them with Draco and writes the optimized files to `public/models/`.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The gallery loads products from Supabase; if none are found, a built-in demo model is shown instead.

---

## Deployment (GitHub Pages)

The app is configured for a fully static export compatible with GitHub Pages:

```bash
npm run build   # outputs to /out
```

Push to the `main` branch and enable **GitHub Pages** in your repository settings (source: `gh-pages` branch or the `/out` folder via a GitHub Actions workflow).

---

## Database Schema Overview

Two tables are used:

| Table | Purpose |
|---|---|
| `products` | Stores 3D model metadata (name, description, GLB URL, poster URL, file size, tags) |
| `system_health` | Single-row keep-alive record updated every 48 h to prevent database pausing |

RLS is enabled on both tables. Anonymous visitors can **read** products; writes require authentication or the service role key.

---

## AR Support

Google's `<model-viewer>` web component automatically bridges the `.glb` file to each platform's native AR runtime:

| Platform | AR Technology | How it works |
|---|---|---|
| iOS (Safari / Chrome) | AR Quick Look | `model-viewer` converts the GLB to a format AR Quick Look can render |
| Android | Scene Viewer | Native Android AR viewer launched directly from the browser |
| Desktop / other | WebXR | In-browser WebXR session where supported |

No app download is needed — AR launches directly from the browser.

---

## License

This project is open source. 3D models in the gallery are distributed under the [CC0 (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/) license unless otherwise noted in their metadata.