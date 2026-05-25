# NextGen SaaS

Production-ready full-stack website for NextGen SaaS, built with React, Lenis smooth scroll, GSAP ScrollTrigger animations, Express, Prisma, and PostgreSQL.

## Stack

- React + Vite + TypeScript
- Lenis for smooth scrolling
- GSAP + ScrollTrigger for reveal, pinned, and horizontal project animations
- Express API with Zod validation
- Prisma ORM with PostgreSQL
- Docker Compose for local Postgres

## Local Setup

```bash
npm install
cp .env.example apps/backend/.env
docker compose up -d postgres
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Frontend: http://localhost:5173

Backend: http://localhost:4000/api/health

The frontend includes safe fallback content, so it still renders if the API or database is not running.
