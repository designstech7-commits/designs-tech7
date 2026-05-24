# Designs.Tech7

> Premium graphic design & motion poster studio portfolio and client commission platform.

A full-stack Next.js 15 application featuring an immersive portfolio experience, motion-driven editorial UI, and a fully operational client commission portal with Supabase backend.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion + GSAP |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── page.tsx             # Home — hero, featured work, CTA
│   ├── portfolio/           # Portfolio grid + case study pages
│   ├── motion-explorations/ # Experimental motion archive
│   ├── about/               # Studio philosophy + methodology
│   ├── testimonials/        # Client testimonials
│   ├── commission/          # Multi-step commission portal
│   ├── dashboard/           # Protected client dashboard
│   │   ├── page.tsx         # Overview
│   │   ├── projects/        # Commission history + status tracker
│   │   ├── drafts/          # Saved commission drafts
│   │   ├── messages/        # Real-time project messages
│   │   └── downloads/       # Deliverable files
│   ├── auth/                # Login, register, forgot password
│   └── api/                 # API routes
│       ├── portfolio/       # Portfolio CRUD
│       ├── commissions/     # Commission CRUD
│       ├── messages/        # Message API
│       └── uploads/         # File upload API
│
├── components/
│   ├── home/                # Homepage sections
│   ├── portfolio/           # Portfolio grid, case study
│   ├── commission/          # Multi-step commission form
│   ├── dashboard/           # Dashboard sidebar, topbar, cards
│   ├── auth/                # Login, register components
│   ├── layout/              # Nav, footer, about, testimonials
│   ├── motion/              # Cursor, grain, page transitions, kinetic text
│   └── ui/                  # Button, Input, Badge, Card
│
├── lib/
│   ├── supabase/            # Client + server Supabase instances
│   └── utils.ts             # Helpers, formatters, constants
│
├── hooks/
│   ├── useAnimations.ts     # GSAP split text, scroll reveal, magnetic
│   └── useAuth.ts           # Auth state hook
│
├── types/
│   └── index.ts             # All TypeScript interfaces
│
└── styles/
    └── globals.css          # Design tokens, typography, utilities

supabase/
└── schema.sql               # Complete database schema + seed data
```

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd designs-tech7
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of `supabase/schema.sql`
3. In **Storage**, create these buckets:
   - `portfolio` — Public
   - `commission-uploads` — Private
   - `deliverables` — Private
   - `agreements` — Private
   - `avatars` — Public

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Key Features

### Portfolio
- Filterable portfolio grid with masonry layout
- Hover reveal animations with smooth transitions
- Full case study pages with:
  - Parallax hero images
  - Gallery with lightbox
  - Before/after comparison slider
  - Deliverables, tools, color palette sidebar

### Commission Portal
- 6-step animated multi-step form
- File uploads (moodboard, references, brand assets)
- Save draft / resume later
- Package selection (Essentials, Studio, Atelier)
- Agreement acceptance flow
- Proposal summary on submit

### Client Dashboard
- Commission history with status timeline tracker
- Real-time project messaging (Supabase Realtime)
- Saved drafts management
- Deliverable file downloads
- Protected with Supabase Auth middleware

### Design System
- Custom grain texture overlay
- Magnetic cursor with ring follower
- Acid (#c8ff00) / Ember (#ff4400) accent palette
- DM Serif Display + DM Sans + DM Mono typography
- Glass panels (glassmorphism)
- Editorial grid overlays
- Framer Motion page transitions
- GSAP scroll reveals + split text animations

---

## Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard or:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

Set `NEXT_PUBLIC_APP_URL` to your production Vercel URL.

In Supabase **Authentication > URL Configuration**:
- Site URL: `https://your-domain.vercel.app`
- Redirect URLs: `https://your-domain.vercel.app/auth/callback`

---

## Adding Portfolio Items

Currently, portfolio items are managed directly in Supabase. To add items:

```sql
INSERT INTO portfolio_items (
  title, slug, category_id, description,
  cover_image_url, client, year, tags,
  is_published, is_featured, sort_order
) VALUES (
  'Project Title', 'project-slug',
  (SELECT id FROM portfolio_categories WHERE slug = 'poster-design'),
  'Project description',
  'https://your-storage.supabase.co/...',
  'Client Name', 2024, '{"poster","print"}',
  true, true, 1
);
```

---

## Admin Access

To grant admin access to a user:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@youremail.com';
```

---

## License

All design and code © Designs.Tech7. Not for redistribution.
