# Real Estate App - Monorepo

A full-stack real estate application with React frontend and FastAPI backend.

## Project Structure

```
real-estate-app/
├── frontend/          # React + Vite frontend
├── backend/           # FastAPI backend
├── package.json       # Root package.json with scripts
└── README.md         # This file
```

## Quick Start

### Install Dependencies
```bash
npm run install:all
```

### Development

#### Run Both Frontend and Backend
```bash
npm run dev:all
```

#### Run Frontend Only
```bash
npm run dev:frontend
```

#### Run Backend Only
```bash
npm run dev:backend
```

### Production

#### Build Frontend
```bash
npm run build:frontend
```

#### Start Backend
```bash
npm run start:backend
```

## Available Scripts

- `npm run dev:all` - Run both frontend and backend concurrently
- `npm run dev:frontend` - Run frontend development server
- `npm run dev:backend` - Run backend development server
- `npm run install:all` - Install dependencies for all packages
- `npm run build:frontend` - Build frontend for production
- `npm run start:backend` - Start backend server
- `npm run start:frontend` - Start frontend preview server

## URLs

- **Frontend**: http://localhost:8081 (or 5173)
- **Backend**: http://localhost:3001
- **Backend Health**: http://localhost:3001/health

## Features

### Frontend (React + Vite)
- Modern React with TypeScript
- Tailwind CSS for styling
- Shadcn/ui components
- Real-time AI chat
- ROI Calculator
- Design Generator
- Market Analytics

### Backend (FastAPI)
- RESTful API
- AI-powered responses
- ROI calculations
- Image generation
- CORS enabled for frontend

## Environment Variables

### Frontend
Create `frontend/.env`:
```bash
VITE_API_URL=http://localhost:3001
VITE_APP_TITLE=Vista Forge Real Estate App
```

### Backend
Backend runs on port 3001 by default.

## Development Workflow

1. Clone the repository
2. Run `npm run install:all` to install all dependencies
3. Run `npm run dev:all` to start both frontend and backend
4. Open http://localhost:8081 in your browser
5. Start developing!

## API Endpoints

- `POST /guide/guide` - Real estate guidance
- `POST /finance/roi` - ROI calculations
- `POST /design/text` - AI image generation
- `POST /preview/` - Property preview generation
- `GET /health` - Health check
