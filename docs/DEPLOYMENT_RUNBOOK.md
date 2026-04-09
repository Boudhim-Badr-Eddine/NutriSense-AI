# NutriSense AI Deployment Runbook

## Targets
- Backend: Render (Web Service)
- Frontend: Vercel (Next.js)

## 1) Backend Deploy (Render)

### Build and start
- Build command: npm run build
- Start command: npm start
- Root directory: backend

### Required environment variables
- PORT=10000
- NODE_ENV=production
- MONGODB_URI=<your mongodb atlas uri>
- JWT_SECRET=<strong random secret>
- JWT_EXPIRES_IN=7d
- GEMINI_API_KEY=<your key>
- GEMINI_MODEL=models/gemini-2.5-flash
- GEMINI_API_VERSION=v1
- CORS_ORIGIN=<your vercel app url>

### Health check
- Path: /api/health
- Expected: HTTP 200 with success true

## 2) Frontend Deploy (Vercel)

### Build and output
- Framework preset: Next.js
- Root directory: frontend

### Required environment variables
- NEXT_PUBLIC_API_URL=<your backend url>/api

### Post-deploy checks
- Open home page and verify no console errors
- Open supplements, complements, nutrition pages
- Login/register works
- Chat widget sends and receives messages

## 3) Production Verification Checklist

- Backend /api/health returns 200
- CORS allows frontend origin
- Auth register/login/profile works
- Supplements/complements/foods list endpoints return 200
- Chat endpoint returns 200 for authenticated user
- No secrets are committed in repository files

## 4) Rollback Plan

- Keep previous stable deployment active until checks pass
- If critical error appears, redeploy previous version
- Validate /api/health and login flow after rollback

## 5) Local Pre-deploy Commands

Run from backend:
- npm run build
- npm run test:smoke

Run from frontend:
- npm run build
