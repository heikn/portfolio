# api

TypeScript + Express backend for the portfolio.

## Requirements

- Node.js (uses modern Node features)
- Postgres (via Prisma)

## Development

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Run migrations:

```bash
npm run prisma:migrate
```

Start dev server:

```bash
npm run dev
```

Default API URL: `http://localhost:3001`

## Endpoints

Public:

- `GET /api/projects`
- `GET /api/projects/:slug`
- `GET /api/tags`
- `POST /api/contact`
- `GET /health`
- `GET /uploads/<filename>`

Admin (JWT, Bearer token):

- `POST /api/auth/login`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/images` (multipart upload)
- `POST /api/images/url`
- `DELETE /api/images/:imageId`
- Project images (attach/upload/url/reorder/detach) under `POST/PUT/DELETE /api/projects/:projectId/images...`

### Admin auth

Write endpoints (POST/PUT/PATCH/DELETE) are protected with a Bearer token.

Configure the following in `apps/api/.env`:

- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`

Generate a bcrypt hash (prints the hash to stdout):

```bash
node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 12))" 'your-password-here'
```

Obtain a token:

```bash
curl -s -X POST http://localhost:3001/api/auth/login \
	-H 'Content-Type: application/json' \
	-d '{"email":"you@example.com","password":"your-password"}'
```

Use it on protected endpoints:

```bash
curl -s http://localhost:3001/api/projects \
	-H "Authorization: Bearer <TOKEN>"
```
Static uploads:
- `GET /uploads/<filename>`

## Environment

Copy `.env.example` to `.env` and fill values.

Common variables:

- `PORT` (default: `3001`)
- `DATABASE_URL`

Auth variables:

- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`

CORS:

- `CORS_ORIGIN` — optional comma-separated allowlist in addition to defaults.
	Defaults include `http://localhost:5173` (web) and `http://localhost:5174` (admin).

### DATABASE_URL

If you run the API on your host machine, you need Postgres reachable from the host.
This repo's `/infra/docker-compose.yml` keeps Postgres internal-only by design.

Typical options:
- run the API in Docker on the same network as Postgres, or
- temporarily publish a host port for Postgres while developing locally.

(Keeping it internal-only satisfies the requirement. We can add an optional dev override later.)
