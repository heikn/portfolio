# admin

Admin UI for managing portfolio content.

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

Default URL is typically `http://localhost:5174`.

## Auth

Login issues a JWT via the API:

- `POST /api/auth/login`

The admin app stores the token locally and sends it as:

`Authorization: Bearer <token>`

On the API side, configure:

- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`

## Features

- Projects
  - list/create/delete
  - edit fields
  - attach/detach tags
  - attach existing image assets and reorder project images
- Images
  - upload new assets
  - add-by-URL
  - delete assets
- Tags
  - list/create/delete

## Scripts

- `npm run dev` — start Vite
- `npm run build` — typecheck + production build
- `npm run preview` — run built app locally

