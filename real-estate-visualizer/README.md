# Real Estate Visualizer

A full-stack AI-powered real estate visualization platform with React frontend and FastAPI backend.

## 🚀 Features

- **AI-Powered Visualization**: Transform properties into stunning 2D and 3D visualizations
- **Smart ROI Analysis**: Comprehensive investment analysis with market predictions
- **Real-time Market Data**: Access to current market trends and insights
- **Interactive 3D Rendering**: Built with Three.js for immersive property experiences
- **Responsive Design**: Optimized for all devices with smooth animations

## 🏗️ Architecture

```
real-estate-visualizer/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Helper functions
│   └── package.json
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── services/       # Business logic
│   │   ├── models/         # Data models
│   │   └── utils/          # Utilities
│   └── requirements.txt
├── ai_models/              # AI/ML models
├── database/               # Database schemas
└── docker/                 # Docker configuration
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Three.js** for 3D rendering
- **Framer Motion** for smooth animations
- **Tailwind CSS** for styling
- **React Router** for navigation

### Backend
- **FastAPI** for high-performance API
- **Python 3.9+** with async/await
- **PostgreSQL** with Supabase
- **Pydantic** for data validation
- **OpenCV** for image processing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL (or Supabase account)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 📱 Features Overview

### 1. AI Property Visualization
- Upload property images for AI enhancement
- Generate 2D floor plans from descriptions
- Create immersive 3D property tours
- Style transfer and material recognition

### 2. ROI Calculator
- Comprehensive cash flow analysis
- Market comparison tools
- Risk assessment algorithms
- Investment projections

### 3. Market Analysis
- Real-time market data integration
- Trend analysis and predictions
- Comparable property analysis
- Location scoring algorithms

### 4. User Experience
- Smooth animations and transitions
- Responsive design for all devices
- Interactive 3D property viewer
- Real-time collaboration features

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
uvicorn app.main:app --reload    # Start development server
pytest                           # Run tests
black .                          # Format code
flake8 .                         # Lint code
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

### Backend (Railway/Heroku)
1. Create new project
2. Connect GitHub repository
3. Set environment variables
4. Deploy automatically

## 📊 API Endpoints

### Rendering
- `POST /api/render/2d` - Generate 2D visualization
- `POST /api/render/3d` - Generate 3D visualization
- `POST /api/render/upload` - Upload property image

### ROI Analysis
- `POST /api/roi/calculate` - Calculate ROI
- `GET /api/roi/market-data/{location}` - Get market data

### Market Analysis
- `POST /api/market/analyze` - Analyze market
- `GET /api/market/trends/{location}` - Get market trends
- `GET /api/market/comparables/{location}` - Get comparable properties

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Three.js community for 3D rendering capabilities
- FastAPI team for the excellent Python framework
- React team for the amazing frontend library
- All contributors and users of this project
