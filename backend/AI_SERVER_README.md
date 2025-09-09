# AI Explanation Server

A dedicated Express.js server for generating AI-powered real estate investment analysis explanations using OpenAI's GPT models.

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Create .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
echo "PORT=3001" >> .env
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Server
```bash
# Option 1: Use the startup script
./start_ai_server.sh

# Option 2: Direct start
node express_ai_server.js

# Option 3: With npm
npm start
```

## 📡 API Endpoints

### POST `/api/explain-roi`
Generates AI-powered investment analysis explanations.

**Request Body:**
```json
{
  "capRate": 0.06,           // or "cap_rate"
  "cashOnCash": 0.08,        // or "cash_on_cash"
  "noi": 120000,
  "dscr": 1.25,
  "terminalValue": 850000,   // or "terminal_value" (optional)
  "npv": 45000,              // optional
  "irr": 0.12                // optional
}
```

**Response:**
```json
{
  "explanation": "Professional investment analysis...",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "AI Explanation Service",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET `/`
Service information endpoint.

## 🔧 Features

- ✅ **Flexible Input Format**: Supports both camelCase and snake_case field names
- ✅ **CORS Enabled**: Ready for frontend integration
- ✅ **Error Handling**: Graceful fallback explanations
- ✅ **Input Validation**: Validates required fields
- ✅ **Professional Prompts**: Optimized for real estate investment analysis
- ✅ **Health Monitoring**: Built-in health check endpoint

## 🧪 Testing

Run the test suite to verify functionality:

```bash
node test_ai_server.js
```

The test script will:
1. Check server health
2. Test AI explanation with your format
3. Test AI explanation with existing format
4. Verify error handling

## 🔗 Frontend Integration

The server is designed to work seamlessly with the frontend components:

### Using the Hook (Recommended)
```typescript
import { useAIExplanation } from '@/hooks/useAIExplanation';

const { explanation, loading, fetchExplanation } = useAIExplanation();
await fetchExplanation(metrics);
```

### Direct API Call
```typescript
import { aiApi } from '@/lib/api';
const response = await aiApi.explainROI(metrics);
```

### Your Original Function
```javascript
async function fetchAIExplanation(metrics) {
  const response = await fetch("http://localhost:3001/api/explain-roi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metrics),
  });
  return await response.json();
}
```

## 🛠️ Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `PORT`: Server port (default: 3001)

### OpenAI Model Settings
- **Model**: `gpt-4o-mini`
- **Max Tokens**: 500
- **Temperature**: 0.7
- **System Prompt**: Professional real estate investment advisor

## 📊 Supported Metrics

| Metric | Description | Required |
|--------|-------------|----------|
| `capRate` / `cap_rate` | Capitalization rate (decimal) | ✅ |
| `cashOnCash` / `cash_on_cash` | Cash-on-cash return (decimal) | ✅ |
| `noi` | Net Operating Income (number) | ✅ |
| `dscr` | Debt Service Coverage Ratio | ✅ |
| `terminalValue` / `terminal_value` | Terminal value (number) | ❌ |
| `npv` | Net Present Value (number) | ❌ |
| `irr` | Internal Rate of Return (decimal) | ❌ |

## 🚨 Error Handling

The server provides graceful error handling:

1. **Missing Fields**: Returns 400 with specific error message
2. **OpenAI API Errors**: Returns 500 with fallback explanation
3. **Network Issues**: Returns 500 with fallback explanation

Fallback explanations include basic analysis and recommendations based on available data.

## 🔄 Integration with Existing Backend

This server can run alongside your existing FastAPI backend:

- **FastAPI**: `http://localhost:8000` (main application)
- **Express AI**: `http://localhost:3001` (AI explanations)

The frontend automatically routes AI explanation requests to the appropriate server based on configuration.

## 📝 Example Usage

```bash
# Test with curl
curl -X POST http://localhost:3001/api/explain-roi \
  -H "Content-Type: application/json" \
  -d '{
    "capRate": 0.06,
    "cashOnCash": 0.08,
    "noi": 120000,
    "dscr": 1.25,
    "terminalValue": 850000
  }'
```

## 🎯 Production Considerations

- Set up proper logging
- Implement rate limiting
- Add authentication if needed
- Use environment-specific configurations
- Set up monitoring and alerts
- Consider caching for repeated requests
