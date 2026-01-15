# web

Public portfolio frontend.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- React Router
- TanStack Query
- `ky` for API requests

## Development

```bash
npm install
npm run dev
```

The web app expects the API to be running (default: `http://localhost:3001`).

## Configuration

This app uses an API base URL (see `src/lib/api.ts`). If you change the API port or host, update the environment/config that file reads.

The API must allow this origin via CORS. By default the API allows:

- `http://localhost:5173` (web)
- `http://localhost:5174` (admin)

## Scripts

- `npm run dev` — start Vite
- `npm run build` — typecheck + production build
- `npm run preview` — run built app locally

## Pages

- `/` — home
- `/projects` — projects list (grouped into Work / Personal)
- `/projects/:slug` — single project view
- `/contact` — contact form
  - `/projects/:slug` — single project view
  - `/contact` — contact form
