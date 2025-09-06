# Environment Configuration

## API Configuration

Your frontend now uses environment variables for API configuration, making it easy to switch between different environments.

### Current Setup

The API configuration is located in `src/config/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
```

### Environment Variables

Create a `.env` file in the `client` directory with the following content:

```bash
# API Configuration
VITE_API_URL=http://localhost:3001

# Development settings
VITE_APP_TITLE=Vista Forge Real Estate App
```

### Environment-Specific Configurations

#### Development
```bash
VITE_API_URL=http://localhost:3001
```

#### Production
```bash
VITE_API_URL=https://your-production-api.com
```

#### Staging
```bash
VITE_API_URL=https://staging-api.your-domain.com
```

### How to Use

1. **Create `.env` file** in the `client` directory
2. **Set your API URL** using the `VITE_API_URL` variable
3. **Restart your development server** after changing environment variables

### Benefits

- ✅ Easy switching between environments
- ✅ No hardcoded URLs in your code
- ✅ Secure configuration management
- ✅ Different settings for development, staging, and production

### Current Backend Endpoints

Your FastAPI backend is running on `http://localhost:3001` with these endpoints:

- `POST /guide/guide` - Real estate guidance
- `POST /finance/roi` - ROI calculations
- `POST /design/text` - AI image generation
- `POST /preview/` - Property preview generation
- `GET /health` - Health check
