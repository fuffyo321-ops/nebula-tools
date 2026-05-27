# NebulaTools — AI Tools Marketplace

Premium AI tools marketplace SaaS platform. Access 100+ AI tools with one subscription.

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ (or use Docker)
- Stripe account
- Google OAuth credentials

### 1. Clone & Install

```bash
git clone <your-repo>
cd nebula-tools
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`.

### 3. Database

**Option A — Docker (recommended):**
```bash
docker-compose up postgres -d
```

**Option B — Local PostgreSQL:**
Create a database named `nebula_tools`.

### 4. Run Migrations & Seed

```bash
npm run db:push
npm run db:seed
```

Default accounts after seeding:
- **Admin:** `admin@nebula-tools.com` / `admin123456`
- **Demo:** `demo@nebula-tools.com` / `demo123456`

### 5. Start Dev Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create 4 products/prices in your Stripe dashboard:
   - **Pro Monthly** — $19/month → copy price ID to `STRIPE_PRO_MONTHLY_PRICE_ID`
   - **Pro Yearly** — $152/year → `STRIPE_PRO_YEARLY_PRICE_ID`
   - **Elite Monthly** — $49/month → `STRIPE_ELITE_MONTHLY_PRICE_ID`
   - **Elite Yearly** — $392/year → `STRIPE_ELITE_YEARLY_PRICE_ID`
3. Enable Customer Portal in Stripe dashboard
4. Set up webhook for local testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
5. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### Stripe Webhook Events to Enable:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## Deploy to Vercel (Share with others)

This is the easiest way to make the site accessible to anyone with a link.

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/nebula-tools.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click **"New Project"** → Import your GitHub repo
3. Add all environment variables from `.env.example`
4. For `DATABASE_URL`, use a hosted PostgreSQL:
   - **Vercel Postgres** (built-in, free tier)
   - **Supabase** (free tier)
   - **Railway** (free tier)
5. Click **Deploy**

### Step 3 — Post-Deploy
```bash
# Run migrations on production
npx prisma migrate deploy
npm run db:seed
```

### Step 4 — Update Environment Variables
- Set `NEXTAUTH_URL` to your Vercel URL (e.g. `https://nebula-tools.vercel.app`)
- Set `NEXT_PUBLIC_APP_URL` to same URL
- Update Stripe webhook URL in Stripe dashboard

---

## Docker Deployment (Self-hosted)

```bash
# Copy and fill env
cp .env.example .env

# Start everything
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npm run db:seed
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | TailwindCSS, Framer Motion |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth v5 (Google + Credentials) |
| Payments | Stripe (subscriptions + webhooks) |
| Deployment | Vercel / Docker |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/pricing` | Pricing plans |
| `/tools` | AI tools directory |
| `/tools/[slug]` | Tool detail page |
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard` | User dashboard |
| `/dashboard/tools` | My tools |
| `/dashboard/billing` | Subscription & payments |
| `/dashboard/settings` | Account settings |
| `/admin` | Admin panel (admin only) |

---

## License

MIT
