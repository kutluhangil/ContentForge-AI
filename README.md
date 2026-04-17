<div align="center">

<br />

<img src="https://img.shields.io/badge/ContentForge-v1.0-E4E4E7?style=for-the-badge&logoColor=white" alt="version" />
<img src="https://img.shields.io/badge/Built_with-TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
<img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="nextjs" />
<img src="https://img.shields.io/badge/GPT--4o-Powered-412991?style=for-the-badge&logo=openai&logoColor=white" alt="openai" />
<img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="supabase" />
<img src="https://img.shields.io/badge/Docker-Deployed-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="docker" />

<br /><br />

```
  ██████╗ ██████╗ ███╗   ██╗████████╗███████╗███╗   ██╗████████╗
 ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝████╗  ██║╚══██╔══╝
 ██║     ██║   ██║██╔██╗ ██║   ██║   █████╗  ██╔██╗ ██║   ██║
 ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║╚██╗██║   ██║
 ╚██████╗╚██████╔╝██║ ╚████║   ██║   ███████╗██║ ╚████║   ██║
  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝   ╚═╝

 ███████╗ ██████╗ ██████╗  ██████╗ ███████╗
 ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
 █████╗  ██║   ██║██████╔╝██║  ███╗█████╗
 ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝
 ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
 ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
```

### **One Content. Every Platform.** — Repurpose blogs, videos & podcasts in seconds.

[Live App](https://contentforge.app) · [Report Bug](https://github.com/kutluhangil/ContentForge-AI/issues) · [Request Feature](https://github.com/kutluhangil/ContentForge-AI/issues)

</div>

---

## ✦ What is ContentForge?

**ContentForge** is a SaaS content repurposing platform that transforms a single piece of content — a blog post, YouTube video, or podcast — into six platform-optimized formats simultaneously, powered by GPT-4o.

No more rewriting the same ideas for LinkedIn, Twitter, newsletters, and Instagram. Paste your content, pick your formats, get results in 30 seconds.

Turkish & English. Dark, premium UI. Self-hosted on your own server.

---

## ⚡ Features

| Feature | Description |
|---------|-------------|
| 🔄 **6 Output Formats** | LinkedIn post, Twitter thread, newsletter, Shorts script, carousel plan, blog summary |
| 🎙️ **5 Input Sources** | Blog URL, raw text, YouTube link, audio/podcast upload, PDF |
| 🎨 **5 Tone Modes** | Professional, casual, humorous, inspirational, educational |
| 🌍 **Bilingual** | Full Turkish + English support — both UI and generated content |
| ✏️ **Inline Editing** | Edit generated content directly in the browser, then copy |
| 📊 **Dashboard** | Usage stats, recent conversions, quick actions |
| 🗂️ **Conversion History** | Browse past conversions, filter by format, re-export |
| 📋 **Templates** | Pre-built prompt templates for common use cases |
| 💳 **Subscription Billing** | Free / Starter / Pro plans via Lemon Squeezy |
| 🔑 **API Access** | Programmatic access for Pro plan users |
| 🐳 **Self-Hosted** | Docker Compose deployment with automatic SSL |

---

## 🖼️ Screenshots

> *(Coming soon — dark-themed "Obsidian Luxury" UI)*

---

## 🛠️ Tech Stack

```
Frontend        →  Next.js 16 · TypeScript · Tailwind CSS 4 · Framer Motion · Zustand
i18n            →  next-intl (URL-based locale routing: /tr, /en)
Fonts           →  Satoshi (display) · DM Sans (body) · JetBrains Mono (mono)
AI              →  OpenAI GPT-4o (content) · Whisper (audio transcription)
Database        →  Supabase (PostgreSQL + Auth + Storage + Realtime)
Queue           →  BullMQ + Redis (async conversion processing)
Payments        →  Lemon Squeezy (Merchant of Record, webhook-driven)
Infrastructure  →  Docker Compose · Caddy (auto SSL) · GitHub Actions CI/CD
Monitoring      →  Uptime Kuma (self-hosted)
```

---

## 💰 Pricing

| Feature | Free | Starter ($19/mo) | Pro ($49/mo) |
|---------|------|-------------------|--------------|
| Monthly conversions | 3 | 50 | Unlimited |
| Output formats | 3 | All 6 | All 6 |
| Audio upload (Whisper) | — | 10 min/file | 60 min/file |
| YouTube transcripts | 5 min | 30 min | 120 min |
| Tone options | Professional only | All 5 | All 5 + Custom prompt |
| History | 7 days | 90 days | Unlimited |
| Priority queue | — | — | Yes |
| API access | — | — | Yes |
| Annual discount | — | $15.20/mo (−20%) | $39.20/mo (−20%) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      UBUNTU SERVER                           │
│                                                              │
│   ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│   │  Next.js   │  │   Redis    │  │       Caddy          │  │
│   │  App :3000 │  │   :6379    │  │  Reverse Proxy :443  │  │
│   └────────────┘  └────────────┘  └──────────────────────┘  │
│   ┌────────────┐  ┌──────────────────────────────────────┐  │
│   │  BullMQ    │  │         Uptime Kuma :3001            │  │
│   │  Worker    │  │         (monitoring)                  │  │
│   └────────────┘  └──────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
             ┌──────────────┼──────────────┐
             │              │              │
        Supabase       OpenAI API    Lemon Squeezy
        (Cloud)        (GPT + Whisper)  (Payments)
```

---

## 📐 Project Structure

```
contentforge/
├── .github/workflows/deploy.yml       # CI/CD pipeline
├── docker/
│   ├── Dockerfile                     # Next.js production image
│   ├── Dockerfile.worker              # BullMQ worker image
│   ├── docker-compose.yml             # All services orchestration
│   └── Caddyfile                      # Reverse proxy + auto SSL
├── public/
│   ├── locales/tr/common.json         # Turkish translations
│   ├── locales/en/common.json         # English translations
│   └── fonts/                         # Satoshi, DM Sans, JetBrains Mono
├── src/
│   ├── app/
│   │   ├── [locale]/                  # i18n route group
│   │   │   ├── page.tsx               # Landing page
│   │   │   ├── pricing/               # Public pricing page
│   │   │   ├── (auth)/                # Login, Register, OAuth callback
│   │   │   └── (dashboard)/           # Protected app routes
│   │   │       ├── dashboard/         # Stats + recent conversions
│   │   │       ├── repurpose/         # New conversion flow
│   │   │       ├── repurpose/[id]/    # Conversion detail + results
│   │   │       ├── history/           # Conversion history
│   │   │       ├── templates/         # Prompt templates
│   │   │       └── settings/          # Profile, billing, API keys
│   │   └── api/
│   │       ├── repurpose/             # Start + poll conversions
│   │       ├── transcribe/            # Whisper audio → text
│   │       ├── youtube/               # YouTube → transcript
│   │       ├── usage/                 # Usage limit check
│   │       ├── checkout/              # Lemon Squeezy checkout
│   │       └── webhooks/lemonsqueezy/ # Payment webhook handler
│   ├── components/
│   │   ├── ui/                        # Button, Card, Input, Modal, Tooltip, etc.
│   │   ├── layout/                    # Navbar, Sidebar, Footer, ThemeProvider
│   │   ├── landing/                   # Hero, Features, Pricing, Testimonials, FAQ
│   │   ├── dashboard/                 # StatsCards, RecentConversions, UsageBar
│   │   ├── repurpose/                 # SourceSelector, FormatPicker, ResultCard
│   │   └── billing/                   # PlanCard, CheckoutButton, UsageAlert
│   ├── lib/
│   │   ├── supabase/                  # Browser, server, admin clients + middleware
│   │   ├── ai/                        # OpenAI client + 6 prompt templates
│   │   ├── queue.ts                   # BullMQ queue configuration
│   │   ├── youtube.ts                 # YouTube transcript extraction
│   │   ├── blog.ts                    # Blog URL → text (Readability + Cheerio)
│   │   ├── transcribe.ts             # Whisper audio → text
│   │   ├── pdf.ts                     # PDF → text extraction
│   │   ├── lemonsqueezy.ts           # Lemon Squeezy API client
│   │   ├── rate-limit.ts             # Redis sliding-window rate limiting
│   │   └── usage.ts                   # Usage limit check + increment
│   ├── hooks/                         # useUser, useSubscription, useUsage, etc.
│   ├── stores/                        # Zustand stores (repurpose, UI)
│   └── types/                         # Database, API, plan type definitions
├── supabase/migrations/               # 7 SQL migration files
├── workers/repurpose-worker.ts        # Standalone BullMQ worker
├── scripts/
│   ├── setup-env.sh                   # Interactive env setup
│   ├── deploy.sh                      # Server provisioning + deploy
│   └── generate-types.sh             # Supabase type generation
└── .env.example                       # All required environment variables
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 20`
- Docker + Docker Compose
- Supabase account (free tier works)
- OpenAI API key (with billing enabled)
- Lemon Squeezy account (for payments)

### Local Development

```bash
# Clone the repository
git clone https://github.com/kutluhangil/ContentForge-AI.git
cd ContentForge-AI

# Install dependencies
npm install

# Configure environment (interactive)
bash scripts/setup-env.sh

# Or manually
cp .env.example .env.local
# Fill in your credentials

# Start Redis (required for BullMQ)
docker run -d -p 6379:6379 redis:7-alpine

# Start the dev server
npm run dev

# (Optional) Start the worker in a separate terminal
npm run worker
```

App runs at `http://localhost:3000` (redirects to `/tr` by default).

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | Yes |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4o + Whisper | Yes |
| `LEMONSQUEEZY_API_KEY` | Lemon Squeezy API key | Yes |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook HMAC signing secret | Yes |
| `LEMONSQUEEZY_STORE_ID` | Lemon Squeezy store ID | Yes |
| `LEMON_STARTER_MONTHLY_VARIANT_ID` | Starter plan monthly variant | Yes |
| `LEMON_STARTER_YEARLY_VARIANT_ID` | Starter plan yearly variant | Yes |
| `LEMON_PRO_MONTHLY_VARIANT_ID` | Pro plan monthly variant | Yes |
| `LEMON_PRO_YEARLY_VARIANT_ID` | Pro plan yearly variant | Yes |
| `REDIS_URL` | Redis connection URL | Yes |
| `NEXT_PUBLIC_APP_URL` | Public app URL | Yes |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default locale (`tr` or `en`) | No |

### Database Setup

Run the 7 SQL migration files **in order** via Supabase SQL Editor:

```
supabase/migrations/001_create_profiles.sql
supabase/migrations/002_create_subscriptions.sql
supabase/migrations/003_create_conversions.sql
supabase/migrations/004_create_outputs.sql
supabase/migrations/005_create_usage.sql
supabase/migrations/006_rls_policies.sql
supabase/migrations/007_increment_usage_rpc.sql
```

---

## ☁️ Deployment

ContentForge runs on a self-hosted Ubuntu server with Docker Compose. Caddy handles SSL automatically.

### Quick Deploy

```bash
# On your Ubuntu server
git clone https://github.com/kutluhangil/ContentForge-AI.git /opt/contentforge
cd /opt/contentforge

# Run the setup script (installs Docker, configures firewall, starts services)
sudo bash scripts/deploy.sh
```

The script will:
1. Install Docker + dependencies
2. Configure UFW firewall (80, 443, SSH)
3. Clone the repository
4. Prompt you to fill `.env.production`
5. Build and start all containers
6. Run a health check

### CI/CD Pipeline

Push to `main` triggers GitHub Actions:

1. **Type check** — `tsc --noEmit`
2. **Build** — Docker images pushed to GitHub Container Registry
3. **Deploy** — SSH into server, pull images, rolling restart

Configure these GitHub Secrets:

| Secret | Value |
|--------|-------|
| `SERVER_HOST` | Server IP address |
| `SERVER_USER` | SSH username |
| `SERVER_SSH_KEY` | SSH private key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

---

## 🔒 Security

| Layer | Implementation |
|-------|---------------|
| Database | Row Level Security on all tables — full user isolation |
| Webhooks | Lemon Squeezy HMAC signature verification |
| Rate Limiting | Redis sliding-window limiter (per IP + per user) |
| File Uploads | MIME type validation, size limits, magic bytes check |
| API | Auth proxy on all protected routes, Zod schema validation |
| Transport | Caddy auto-TLS, HSTS, CSP, X-Frame-Options headers |
| Secrets | All sensitive keys server-side only, never exposed to client |

---

## 📊 Scoring & Limits

### Conversion Pipeline

```
Source Input → Extract Text → BullMQ Queue → GPT-4o (per format) → Save to DB → Realtime Notify
```

- **Blog URL** — Fetched + parsed with Mozilla Readability + Cheerio
- **YouTube** — Transcript via `youtube-transcript` package
- **Audio** — Transcribed via OpenAI Whisper API
- **PDF** — Extracted via `pdf-parse`
- **Processing** — Each format runs as a parallel GPT-4o call via `Promise.allSettled`
- **Priority** — Pro plan users get `priority: 1` in the BullMQ queue

---

## 🎨 Design System

**"Obsidian Luxury"** — Premium dark minimalism where every element serves a purpose.

| Element | Value |
|---------|-------|
| Background | `#0A0A0B` (near-black) |
| Surface | `#111113` with `backdrop-filter: blur(20px)` |
| Accent | `#E4E4E7` (white-gray) |
| Display Font | Satoshi (self-hosted) |
| Body Font | DM Sans (self-hosted) |
| Mono Font | JetBrains Mono (self-hosted) |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Grid | 4px spacing system |
| Radius | 6px / 10px / 16px / 24px |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

Built with precision by [kutluhangil](https://github.com/kutluhangil)

<br />

**[contentforge.app](https://contentforge.app)**

<br />

*If you find this useful, consider giving it a ⭐*

</div>
