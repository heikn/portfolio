# portfolio

Monorepo for a personal portfolio site.

## Structure

- `apps/api` — Express + TypeScript API (Prisma/Postgres)
- `apps/web` — Public portfolio website (Vite + React)
- `apps/admin` — Admin UI (Vite + React)
- `infra` — Local infrastructure (docker-compose)

## Prerequisites

- Node.js
- npm
- Postgres

## Quick start

1) Start Postgres (docker):

```bash
cd infra
docker compose up -d
```

2) Configure the API:

- Create `apps/api/.env` (or copy from `.env.example` if present)
- Set at least:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD_HASH`

3) Start the API:

```bash
cd apps/api
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

API runs at `http://localhost:3001`.

4) Start the web frontend:

```bash
cd apps/web
npm install
npm run dev
```

Web runs at `http://localhost:5173`.

5) Start the admin frontend:

```bash
cd apps/admin
npm install
npm run dev
```

Admin runs at `http://localhost:5174`.

## Notes

- The API serves uploaded files from `GET /uploads/<filename>`.
- The API has CORS defaults for web/admin local dev origins (5173/5174). For additional origins set `CORS_ORIGIN` as a comma-separated list.

## Scripts

Each app has its own scripts in its `package.json`:

- API: `dev`, `build`, `start`, Prisma helpers
- Web/Admin: `dev`, `build`, `preview`, `lint`
