# NutriSense AI

A full-stack supplements and nutrition platform with an AI assistant powered by RAG (Retrieval-Augmented Generation).

NutriSense AI helps users explore supplements, dietary complements, and nutrition data, then ask context-aware questions through a chatbot that uses your MongoDB content.

## Project Highlights

- Full-stack TypeScript architecture (Express + Next.js)
- JWT authentication and favorites support
- Search, filters, sorting, and detail pages
- AI assistant with contextual retrieval from your database
- Seed scripts for supplements and complements
- Local run script that starts both backend and frontend

## Tech Stack

### Backend

- Node.js 20+
- Express + TypeScript
- MongoDB + Mongoose
- JWT authentication
- Google Gemini API

### Frontend

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- React Query

## Repository Structure

- backend: Express API, models, controllers, seed scripts
- frontend: Next.js application
- docs: API contract, schema, standards, deployment notes
- scripts: local stack helper scripts

## Prerequisites

Install these on your PC before setup:

- Node.js 20 or newer
- npm 10 or newer
- MongoDB Atlas database (or local MongoDB)
- Gemini API key

## Quick Start (Recommended)

### 1) Clone and open project

```bash
git clone https://github.com/Boudhim-Badr-Eddine/NutriSense-Ai.git
cd NutriSense-Ai
```

### 2) Create environment files

Backend:

```bash
cp backend/.env.example backend/.env
```

Frontend:

```bash
cp frontend/.env.example frontend/.env.local
```

### 3) Fill environment values

Update backend/.env with real values:

- MONGODB_URI
- JWT_SECRET
- GEMINI_API_KEY
- CORS_ORIGIN (usually http://localhost:3000)

Update frontend/.env.local:

- NEXT_PUBLIC_API_URL=http://localhost:5000/api

### 4) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 5) Run full stack with one command

```bash
chmod +x scripts/run-local-stack.sh scripts/stop-local-stack.sh
./scripts/run-local-stack.sh
```

If healthy, app is available at:

- Frontend: http://localhost:3000
- Backend health: http://localhost:5000/api/health

Stop services:

```bash
./scripts/stop-local-stack.sh
```

## Manual Run (Alternative)

Backend terminal:

```bash
cd backend
npm run dev
```

Frontend terminal:

```bash
cd frontend
npm run dev
```

## Seed and Data Commands

Run from backend folder:

```bash
npm run seed:supplements
npm run seed:complements
npm run seed:enrich
```

Other useful backend scripts:

```bash
npm run test:smoke
npm run images:apply
npm run images:cloudinary
```

## Build for Production

Backend:

```bash
cd backend
npm run build
npm start
```

Frontend:

```bash
cd frontend
npm run build
npm run start
```

## Troubleshooting

### Port already in use

- Free ports 3000 and 5000, then rerun.

### MongoDB connection fails

- Check MONGODB_URI in backend/.env
- Ensure your IP is allowed in MongoDB Atlas network access

### Gemini errors

- Verify GEMINI_API_KEY and model values in backend/.env

### CORS issues

- Ensure CORS_ORIGIN in backend/.env matches frontend URL

## Documentation

- docs/API_CONTRACT.md
- docs/DATABASE_SCHEMA.md
- docs/CODING_STANDARDS.md
- docs/TESTING_CHECKLIST.md
- docs/DEPLOYMENT_RUNBOOK.md

## Team

- Backend and AI integration: Badr Boudhim
- Frontend and UI/UX: Taha

## License

Educational project for OFPPT ISTA NTIC.
