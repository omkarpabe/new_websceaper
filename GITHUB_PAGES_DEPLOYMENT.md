# GitHub Pages Deployment Guide

## Overview

Your web scraper application is a **full-stack application** with both frontend (React) and backend (Node.js/Express) components. GitHub Pages only supports **static websites**, which means we need to separate the deployment:

- **Frontend**: Deploy to GitHub Pages (free)
- **Backend**: Deploy to a different service that supports Node.js

## Current Deployment Issues

### Why Netlify and Vercel Failed
1. **Routing Configuration**: The build output structure didn't match the routing configuration
2. **Environment Variables**: Missing or incorrect environment setup
3. **Build Process**: Complex monorepo structure with both frontend and backend

## Solution Options

### Option 1: GitHub Pages + Free Backend Hosting (Recommended)

#### Frontend (GitHub Pages)
1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "GitHub Actions" as source

2. **Automatic Deployment**:
   - The workflow `.github/workflows/github-pages.yml` is already created
   - It will automatically deploy when you push to main branch

#### Backend Options (Choose One):

**A. Railway (Recommended - Free Tier)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

**B. Render.com (Free Tier)**
- Connect your GitHub repository
- Set build command: `npm run build`
- Set start command: `npm start`
- Add environment variables

**C. Heroku (Free tier discontinued, but still popular)**
- Use the existing `Procfile`
- Connect GitHub repository
- Enable automatic deploys

### Option 2: Split Repository Approach

Create two separate repositories:
1. `webscraper-frontend` → Deploy to GitHub Pages
2. `webscraper-backend` → Deploy to Railway/Render

### Option 3: Serverless Functions

Convert the backend to serverless functions:
- **Vercel Functions** (if you want to retry Vercel)
- **Netlify Functions** (if you want to retry Netlify)
- **GitHub Actions + AWS Lambda**

## Quick Start: GitHub Pages + Railway

### Step 1: Deploy Frontend to GitHub Pages

1. **Enable GitHub Pages**:
   ```
   Repository → Settings → Pages → Source: GitHub Actions
   ```

2. **Push changes** (workflow is already committed):
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

3. **Access your site**:
   - URL will be: `https://omkarpabe.github.io/new_websceaper/`
   - Check the Actions tab for deployment status

### Step 2: Deploy Backend to Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**:
   ```bash
   railway login
   railway link
   railway up
   ```

3. **Set Environment Variables** in Railway dashboard:
   - `NODE_ENV=production`
   - `DATABASE_URL` (if using database)
   - Any other required environment variables

### Step 3: Update Frontend API Calls

Update the frontend to use the Railway backend URL:

```typescript
// In your API calls, replace localhost with Railway URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.railway.app'
  : 'http://localhost:3000';
```

## Environment Configuration

### Frontend Environment Variables
Create `.env.production` for GitHub Pages:
```
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

### Backend Environment Variables
Set these in your hosting service:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=your_database_url
```

## Cost Comparison

| Service | Frontend | Backend | Total/Month |
|---------|----------|---------|-------------|
| GitHub Pages + Railway | Free | Free (500h) | $0 |
| GitHub Pages + Render | Free | Free (750h) | $0 |
| GitHub Pages + Heroku | Free | $7+ | $7+ |
| Vercel (retry) | Free | Free (100GB-hrs) | $0 |
| Netlify (retry) | Free | Free (125k requests) | $0 |

## Troubleshooting

### Common Issues
1. **CORS Errors**: Configure CORS in your backend for the GitHub Pages domain
2. **API Calls Failing**: Update API base URL in frontend
3. **Build Failures**: Check Node.js version compatibility

### Debug Steps
1. Check GitHub Actions logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors

## Next Steps

1. **Choose your preferred backend hosting**
2. **Enable GitHub Pages** in repository settings
3. **Deploy backend** to chosen service
4. **Update frontend** API configuration
5. **Test the complete application**

The GitHub Pages workflow is ready to deploy your frontend automatically on every push to the main branch!