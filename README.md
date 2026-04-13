<div align="center">

# ContentForge

**One Content. Every Platform.**

Transform your blog posts, YouTube videos, and podcasts into platform-ready content in seconds — powered by GPT-4o.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat-square&logo=openai)](https://openai.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-white?style=flat-square)](LICENSE)

</div>

---

## What is ContentForge?

ContentForge is a **SaaS content repurposing platform** designed for content creators who want to maximize the reach of their work. Feed it a single piece of content — a blog post, a YouTube video, or a podcast episode — and it transforms it into six platform-optimized formats simultaneously, in Turkish or English.

No more spending hours rewriting the same ideas for different audiences. ContentForge does it in under 30 seconds.

---

## Features

### Input Sources
| Source | Description |
|--------|-------------|
| Blog URL | Paste any blog link — ContentForge fetches and parses the content automatically |
| Blog Text | Paste raw text directly for instant conversion |
| YouTube Link | Extracts transcripts from YouTube videos (auto-captions or manual subtitles) |
| Audio / Podcast | Upload MP3/WAV/M4A files — transcribed via OpenAI Whisper |
| PDF / Document | Upload PDF files for text extraction and conversion |

### Output Formats
| Format | Platform | Description |
|--------|----------|-------------|
| LinkedIn Post | LinkedIn | Professional, hook-driven posts with hashtags (150–300 words) |
| Twitter Thread | X / Twitter | Engaging thread structure with numbered tweets |
| Newsletter | Email | Scannable newsletter with subject line, intro, and CTA |
| Shorts Script | YouTube / Reels | 60-second hook-based video scripts |
| Carousel Plan | Instagram | Slide-by-slide content plan for carousel posts |
| Blog Summary | Any | Concise summary + SEO meta description |

### Platform Capabilities

- **5 Tone Modes** — Professional, Casual, Humorous, Inspirational, Educational
- **Bilingual** — Full Turkish and English support (content generation + UI)
- **Real-time Processing** — BullMQ queue with Supabase Realtime notifications
- **Inline Editing** — Edit generated content directly in the browser
- **Conversion History** — Browse, copy, and re-export past conversions
- **Ready Templates** — Pre-built prompt templates for common use cases

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        UBUNTU SERVER                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     Docker Compose                        │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │   Next.js   │  │    Redis    │  │      Caddy      │  │   │
│  │  │   App :3000 │  │  Queue:6379 │  │  Proxy :80/443  │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌──────────────────────────────────┐  │   │
│  │  │   BullMQ    │  │        Uptime Kuma               │  │   │
│  │  │   Worker    │  │        Monitoring :3001           │  │   │
│  │  └─────────────┘  └──────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ Caddy Reverse Proxy (auto SSL)
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         Supabase       OpenAI API    Lemon Squeezy
         (Cloud)        (Whisper+GPT) (Payments)
```

### Tech Stack

**Frontend**
- **Next.js 14** (App Router) — Framework with server components and streaming
- **TypeScript** — Full type safety across the codebase
- **Tailwind CSS 4** — Utility-first styling with CSS Variables design system
- **Framer Motion** — Physics-based animations and page transitions
- **Zustand** — Lightweight global state management
- **next-intl** — Internationalization with URL-based locale routing
- **React Hook Form + Zod** — Type-safe form validation

**Backend**
- **Next.js API Routes** — Server-side logic co-located with the frontend
- **OpenAI GPT-4o** — AI content transformation engine
- **OpenAI Whisper** — Audio transcription for podcast/audio uploads
- **BullMQ + Redis** — Durable job queue for async conversion processing
- **Upstash Redis** — Distributed rate limiting per user/IP

**Database & Services**
- **Supabase** — PostgreSQL database with Row Level Security
- **Supabase Auth** — Email + Google OAuth authentication
- **Supabase Storage** — Audio and PDF file storage
- **Supabase Realtime** — Live conversion status updates

**Payments**
- **Lemon Squeezy** — Merchant of Record, handles VAT/tax globally
- Checkout overlay (no redirect), subscription webhooks

**Infrastructure**
- **Docker + Docker Compose** — Containerized deployment
- **Caddy** — Reverse proxy with automatic TLS (Let's Encrypt)
- **GitHub Actions** — CI/CD pipeline with SSH deployment
- **Uptime Kuma** — Self-hosted monitoring and uptime alerts

---

## Pricing

| Feature | Free | Starter ($19/mo) | Pro ($49/mo) |
|---------|------|-------------------|--------------|
| Monthly conversions | 3 | 50 | Unlimited |
| Output formats | 3 | All 6 | All 6 |
| Audio upload (Whisper) | No | 10 min/file | 60 min/file |
| YouTube transcripts | 5 min | 30 min | 120 min |
| Tone options | Professional only | All 5 | All 5 + Custom |
| Conversion history | 7 days | 90 days | Unlimited |
| Templates | Basic | All | All + Create custom |
| Priority processing | No | No | Yes |
| API access | No | No | Yes |
| Annual discount | — | $15.20/mo (-20%) | $39.20/mo (-20%) |

---

## Database Schema

ContentForge uses a Supabase PostgreSQL database with the following core tables:

```
profiles          — User profiles linked to Supabase Auth
subscriptions     — Lemon Squeezy subscription state per user
conversions       — Each repurposing job (source + metadata)
outputs           — Generated content per format per conversion
usage             — Monthly conversion counter per user
templates         — Reusable prompt templates (admin-managed)
```

All tables have Row Level Security enabled — users can only access their own data. A database trigger automatically provisions `profiles`, `subscriptions`, and `usage` records when a new user registers.

---

## Project Structure

```
contentforge/
├── .github/workflows/deploy.yml    # CI/CD: build → test → SSH deploy
├── docker/
│   ├── Dockerfile                  # Next.js production image
│   ├── Dockerfile.worker           # BullMQ worker image
│   ├── docker-compose.yml          # All services
│   └── Caddyfile                   # Reverse proxy config
├── public/
│   ├── locales/tr/common.json      # Turkish translations
│   ├── locales/en/common.json      # English translations
│   └── fonts/                      # Self-hosted Satoshi, DM Sans, JetBrains Mono
├── src/
│   ├── app/
│   │   ├── [locale]/               # i18n route group
│   │   │   ├── page.tsx            # Landing page
│   │   │   ├── (auth)/             # Login, Register, OAuth callback
│   │   │   ├── (dashboard)/        # Protected app routes
│   │   │   │   ├── dashboard/      # Stats + recent conversions
│   │   │   │   ├── repurpose/      # New conversion + results
│   │   │   │   ├── history/        # Conversion history
│   │   │   │   ├── templates/      # Prompt templates
│   │   │   │   └── settings/       # Profile, billing, API keys
│   │   │   └── pricing/            # Public pricing page
│   │   └── api/
│   │       ├── repurpose/          # Start conversion + status polling
│   │       ├── transcribe/         # Whisper audio → text
│   │       ├── youtube/            # YouTube → transcript
│   │       ├── usage/              # Usage limit check
│   │       └── webhooks/lemonsqueezy/  # Payment events
│   ├── components/
│   │   ├── ui/                     # Button, Card, Input, Modal, Badge, etc.
│   │   ├── layout/                 # Navbar, Sidebar, Footer, ThemeProvider
│   │   ├── landing/                # Hero, Features, Pricing, FAQ, CTA
│   │   ├── dashboard/              # StatsCards, RecentConversions, UsageBar
│   │   ├── repurpose/              # InputSelector, FormatPicker, ResultCard
│   │   └── billing/                # PlanCard, CheckoutButton, UsageAlert
│   ├── lib/
│   │   ├── supabase/               # Browser, server, admin clients
│   │   ├── ai/                     # OpenAI client + prompt templates (6 formats)
│   │   ├── payments/               # Lemon Squeezy client + webhook handler
│   │   ├── queue/                  # BullMQ connection + queue + worker
│   │   ├── youtube.ts              # YouTube transcript extraction
│   │   ├── rate-limit.ts           # Upstash rate limiting
│   │   └── usage.ts                # Usage limit check + increment
│   ├── hooks/                      # useUser, useSubscription, useUsage, etc.
│   ├── stores/                     # Zustand stores
│   └── types/                      # Database types, API types
├── supabase/migrations/            # SQL migrations (run in Supabase dashboard)
├── workers/repurpose-worker.ts     # Standalone BullMQ worker process
└── scripts/                        # Setup, type gen, deploy scripts
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- Supabase account (free tier works for development)
- OpenAI API key
- Lemon Squeezy account (for payments)

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/your-username/contentforge.git
cd contentforge
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

**4. Set up the database**

Run the SQL migrations in your Supabase dashboard (SQL Editor):
```
supabase/migrations/001_create_profiles.sql
supabase/migrations/002_create_subscriptions.sql
supabase/migrations/003_create_conversions.sql
supabase/migrations/004_create_outputs.sql
supabase/migrations/005_create_usage.sql
supabase/migrations/006_rls_policies.sql
```

**5. Start Redis (for BullMQ)**
```bash
docker run -d -p 6379:6379 redis:7-alpine
```

**6. Start the development server**
```bash
npm run dev
```

**7. (Optional) Start the worker process**
```bash
npm run worker
```

The app will be available at `http://localhost:3000` (redirects to `/tr` by default).

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4o and Whisper |
| `LEMONSQUEEZY_API_KEY` | Lemon Squeezy API key |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook signing secret |
| `LEMONSQUEEZY_STORE_ID` | Your Lemon Squeezy store ID |
| `REDIS_URL` | Redis connection URL |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL |

---

## Deployment

ContentForge is designed to run on a self-hosted Ubuntu server with Docker Compose.

### Quick Deploy

```bash
# On your Ubuntu server:
git clone https://github.com/your-username/contentforge.git
cd contentforge
cp .env.example .env
# Configure .env with production values

docker compose up -d
```

Caddy automatically provisions SSL certificates via Let's Encrypt. No manual certificate management required.

### CI/CD Pipeline

Push to `main` triggers the GitHub Actions workflow:
1. Lint + type check
2. Build Docker images
3. SSH into the production server
4. Pull latest changes + restart containers

See `.github/workflows/deploy.yml` for configuration.

---

## Implementation Phases

The project is built in 8 sequential phases:

| Phase | Name | Description |
|-------|------|-------------|
| 1 | Foundation | Next.js 14, Tailwind CSS 4, fonts, i18n, Supabase client |
| 2 | Database & Auth | Migrations, RLS policies, auth pages, middleware |
| 3 | UI Components | Design system, landing page, dashboard layout |
| 4 | Conversion Engine | OpenAI, Whisper, YouTube, BullMQ, API routes |
| 5 | Payments | Lemon Squeezy, webhooks, usage limits, billing UI |
| 6 | Dashboard & UI | Full dashboard, conversion flow, history, settings |
| 7 | Docker & Deploy | Dockerfiles, Compose, Caddy, GitHub Actions, SSL |
| 8 | Test & Polish | Edge cases, error handling, SEO, performance audit |

---

## Design System

ContentForge uses an **"Obsidian Luxury"** design philosophy — premium dark minimalism where every element serves a purpose.

- **Color palette** — Near-black backgrounds (`#0A0A0B`) with white-gray accents (`#E4E4E7`)
- **Glassmorphism** — Frosted glass cards with `backdrop-filter: blur(20px)`
- **Typography** — Satoshi (display) + DM Sans (body) + JetBrains Mono (code)
- **Animations** — Framer Motion with custom easing (`cubic-bezier(0.16, 1, 0.3, 1)`)
- **Spacing** — Strict 4px grid system

---

## Security

- Row Level Security on all Supabase tables
- Lemon Squeezy webhook HMAC signature verification
- Upstash Redis rate limiting (per IP + per user)
- File upload validation (MIME type, size, magic bytes)
- All environment secrets server-side only
- CSP headers via Caddy
- Zod schema validation on all API inputs

---

## Contributing

This project is currently in active development. Issues and pull requests are welcome once the initial implementation phases are complete.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with care for content creators.

**[contentforge.app](https://contentforge.app)**

</div>
