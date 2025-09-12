# Real Estate Visualizer

A full-stack AI-powered real estate visualization platform with React frontend and FastAPI backend.

## 🚀 Features

- **AI-Powered 3D Visualization**: Transform properties into stunning 3D visualizations
- **Smart ROI Analysis**: Comprehensive investment analysis with market insights
- **Real-Time Market Data**: Access live market trends and property comparisons
- **Interactive Dashboard**: User-friendly interface for property management
- **Mobile Responsive**: Optimized for all devices and screen sizes

## 🏗️ Architecture

```
real-estate-visualizer/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
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
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Three.js** - 3D graphics and visualization
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.9+** - Core backend language
- **PostgreSQL** - Primary database
- **Supabase** - Database and auth services
- **OpenAI API** - AI-powered features

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

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=Real Estate Visualizer
```

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/realestate
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_secret_key
```

## 📱 Usage

### Property Visualization
1. Upload property images or floor plans
2. Select visualization style and preferences
3. Generate 3D visualization with AI
4. Download or share results

### ROI Analysis
1. Enter property details and financial data
2. Configure market parameters
3. Run comprehensive ROI analysis
4. Review recommendations and projections

### Market Analytics
1. Select location and property type
2. View market trends and comparisons
3. Access investment insights
4. Export reports and data

## 🔧 Development

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend deployment
cd backend
gunicorn app.main:app
```

## 🚀 Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
3. Deploy automatically on push

### Backend Deployment
- **Railway**: Easy Python deployment
- **Heroku**: Traditional PaaS option
- **AWS/GCP**: Enterprise cloud solutions
- **Docker**: Containerized deployment

## 📊 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints
- `POST /api/render/2d` - Generate 2D visualization
- `POST /api/render/3d` - Generate 3D visualization
- `POST /api/roi/calculate` - Calculate ROI analysis
- `GET /api/market/analyze` - Get market analysis
- `POST /api/auth/login` - User authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.vistasparkforge.com](https://docs.vistasparkforge.com)
- **Community**: [Discord Server](https://discord.gg/vistasparkforge)
- **Email**: support@vistasparkforge.com

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Three.js community for 3D graphics
- React and FastAPI communities
- All contributors and users

---

Built with ❤️ by the Vista Spark Forge team
