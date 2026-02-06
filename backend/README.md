# NutriSense AI Backend

Backend API for the NutriSense AI platform.

## Setup

```bash
npm install
cp .env.example .env
```

## Available Scripts

- `npm run dev` — Start development server with hot reload
- `npm run build` — Build the project
- `npm start` — Start production server
- `npm run lint` — Lint TypeScript files

## Environment Variables

- `PORT` — Server port
- `NODE_ENV` — `development` | `production` | `test`
- `MONGODB_URI` — MongoDB connection URI
- `JWT_SECRET` — JWT signing secret
- `JWT_EXPIRES_IN` — JWT expiry duration (e.g., `7d`)
- `GEMINI_API_KEY` — Google Gemini API key
- `GEMINI_MODEL` — Gemini model name
- `CORS_ORIGIN` — Allowed frontend origin
