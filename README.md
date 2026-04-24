# See You Soon

A production-ready PropTech vacation booking platform for North Coast Egypt with a modern Next.js frontend, Express backend, PostgreSQL database, S3 image storage, and Stripe + Paymob payment support.

## Features

- Property listings with search, filters, and booking flow
- Admin panel for property, availability, lead, booking, and ads management
- Sales dashboard for leads, notes, and conversion tracking
- Ads impressions and click analytics
- Role-based access control: admin, sales, user
- Multi-tenant-ready architecture

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

3. Start development servers:

```bash
npm run dev
```

4. Run database migrations and seed data:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

## Deploy

- Use the `backend` build output for production API deployments
- Deploy `frontend` as a Next.js app on Vercel or any Node host
- Use PostgreSQL and AWS S3 for storage

## Structure

- `frontend/` - Next.js UI with Tailwind
- `backend/` - Express API with Prisma and auth
- `backend/prisma/` - database schema and seed data
