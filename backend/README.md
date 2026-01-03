# GlobeTrotter Backend (Step 1: Auth)

## Setup

1. Create a database (example): `globetrotter`
2. Create `.env` in `backend/` (copy from `.env.example`) and set `DATABASE_URL`
3. Verify DB connectivity:
   - `npm run db:test`
4. Create schema:
   - `npm run db:init`

## Run

```bash
cd backend
npm install
npm run db:init
npm run dev
```

## Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (requires `Authorization: Bearer <token>`)
- `GET /api/health`

## Notes

- Passwords are stored as `password_hash` using `bcrypt`.
- JWT is returned in responses and should be sent as `Authorization: Bearer <token>`.
