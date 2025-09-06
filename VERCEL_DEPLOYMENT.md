# 🚀 Vercel Deployment Guide

## Deploy Your Real Estate App Frontend to Vercel

### Prerequisites
- Vercel account (free at vercel.com)
- Your frontend code ready

### Step 1: Deploy Frontend to Vercel

```bash
cd frontend
npx vercel
```

### Step 2: Configure Environment Variables

In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - `VITE_API_URL` = `https://your-backend-url.vercel.app` (or your backend URL)

### Step 3: Backend Options

#### Option A: Deploy Backend to Vercel (Recommended)
- Create a new Vercel project for your FastAPI backend
- Use Vercel's Python runtime
- Update frontend environment variable to point to backend URL

#### Option B: Use Local Backend (Development)
- Keep backend running locally
- Use ngrok or similar to expose local backend
- Update `VITE_API_URL` to your ngrok URL

#### Option C: Use Railway/Render for Backend
- Deploy FastAPI backend to Railway or Render
- Update frontend environment variable

### Step 4: Update CORS in Backend

Update your backend's CORS configuration to include your Vercel domain:

```python
origins = [
    "http://localhost:3000",
    "http://localhost:8081",
    "https://your-app-name.vercel.app",  # Add your Vercel URL
    "https://your-app-name-git-main.vercel.app"  # Add preview URLs
]
```

### Step 5: Test Deployment

1. Visit your Vercel URL
2. Test all features:
   - AI Guide
   - ROI Calculator
   - Design Generator
3. Check browser console for any CORS errors

### Benefits of Vercel

✅ **Free Hosting** - Perfect for development and small projects  
✅ **Automatic Deployments** - Deploy on every git push  
✅ **Global CDN** - Fast loading worldwide  
✅ **HTTPS** - Secure by default  
✅ **Custom Domains** - Add your own domain later  

### Next Steps

1. Deploy frontend to Vercel
2. Set up backend hosting (Vercel/Railway/Render)
3. Configure environment variables
4. Test full functionality
5. Add custom domain (optional)
