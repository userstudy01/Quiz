# Personal Developer Portfolio

MERN portfolio: public site, REST API and an admin panel for managing all content.

```
Backend/    Node.js + Express + Mongoose REST API (MongoDB Atlas)
Frontend/   React (Vite) public portfolio site
admin/      React (Vite) portfolio admin panel
```

## Stack

- React 19 + Vite + Tailwind CSS v4 + React Router 7
- Node.js + Express 5
- MongoDB Atlas + Mongoose 9
- JWT authentication + bcrypt password hashing

## Setup

```bash
# 1. API
cd Backend
cp .env.example .env      # fill in MONGODB_URI and JWT_SECRET
npm install
npm run seed:portfolio    # creates the 16 project records, drops legacy collections
npm run seed:admin        # creates the admin user from SEED_ADMIN_* in .env
npm run dev               # http://localhost:5000

# 2. Public site
cd ../Frontend
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev               # http://localhost:5173

# 3. Admin panel
cd ../admin
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev               # http://localhost:5174
```

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Backend | MongoDB Atlas connection string |
| `JWT_SECRET` | Backend | Signs admin JWTs |
| `JWT_EXPIRES_IN` | Backend | Token lifetime (default `7d`) |
| `PORT`, `NODE_ENV` | Backend | Server config |
| `CLIENT_URL`, `ADMIN_URL` | Backend | Comma-separated CORS allow-list |
| `SEED_ADMIN_*` | Backend | Used only by `npm run seed:admin` |
| `VITE_API_URL` | Frontend, admin | API base URL |
| `VITE_SITE_URL` | Frontend | Canonical/Open Graph base URL |

Real secrets live in `.env`, which is git-ignored. Only `.env.example` is committed.

## API

Public:

```
GET  /api/projects              ?search=&category=&technology=&featured=&page=&limit=
GET  /api/projects/meta         categories + technologies for the filter UI
GET  /api/projects/featured
GET  /api/projects/:slug
GET  /api/skills
GET  /api/experience
GET  /api/profile
POST /api/contact
```

Admin (JWT + `role: admin`):

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/auth/password
POST   /api/auth/register        (creating further admin users)

GET    /api/projects/admin/all
GET    /api/projects/admin/:id
POST   /api/projects
PUT    /api/projects/:id
PATCH  /api/projects/:id/flags   publish / feature / sort order
DELETE /api/projects/:id

GET/POST/PUT/DELETE /api/skills      + PUT /api/skills/reorder
GET/POST/PUT/DELETE /api/experience  + PUT /api/experience/reorder
PUT    /api/profile
GET/PATCH/DELETE /api/contact
```

## Content

Project records are seeded from `Backend/seed/projects.data.js` (16 entries). Only
project names that were explicitly supplied are filled in; every other field is
intentionally empty and is meant to be completed with real data through the admin
panel, or by editing that file and running `npm run seed:portfolio -- --force`.

## Production build

```bash
cd Frontend && npm run build
cd ../admin && npm run build
```

Both apps output to `dist/` and ship a `vercel.json` SPA rewrite. The API deploys
from `Backend/api/index.js`.
