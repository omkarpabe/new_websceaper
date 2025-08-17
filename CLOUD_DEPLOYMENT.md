# Cloud Deployment Guide for Web Scraper Pro

This guide provides instructions for deploying the Web Scraper Pro application to various cloud platforms.

## Prerequisites

- Git repository with your code (already set up at https://github.com/omkarpabe/webscraper.git)
- Node.js 18+ installed locally
- Account on your preferred cloud platform

## Deployment Options

### 1. Vercel Deployment

Vercel is ideal for React applications and provides a seamless deployment experience.

1. **Sign up/Login to Vercel**:
   - Go to [vercel.com](https://vercel.com) and create an account or log in

2. **Import your GitHub repository**:
   - Click "Add New" → "Project"
   - Connect to GitHub and select your repository
   - Select the `webscraper` repository

3. **Configure project**:
   - Framework Preset: Select "Other"
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables**:
   - Add the following environment variables:
     - `NODE_ENV`: `production`
     - `PORT`: `3000` (Vercel will override this)

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application

### 2. Netlify Deployment

1. **Sign up/Login to Netlify**:
   - Go to [netlify.com](https://netlify.com) and create an account or log in

2. **Import your GitHub repository**:
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure build settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

4. **Environment Variables**:
   - Go to Site settings → Environment variables
   - Add the same environment variables as listed for Vercel

5. **Deploy**:
   - Click "Deploy site"

### 3. Render.com Deployment

Render is well-suited for full-stack applications with both frontend and backend components.

1. **Sign up/Login to Render**:
   - Go to [render.com](https://render.com) and create an account or log in

2. **Create a new Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository

3. **Configure service**:
   - Name: `webscraper-pro`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`

4. **Environment Variables**:
   - Add the environment variables from `.env.example`
   - Set `NODE_ENV` to `production`

5. **Deploy**:
   - Click "Create Web Service"

### 4. Railway Deployment

1. **Sign up/Login to Railway**:
   - Go to [railway.app](https://railway.app) and create an account or log in

2. **Create a new project**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure project**:
   - Build Command: `npm run build`
   - Start Command: `npm run start`

4. **Environment Variables**:
   - Add the environment variables from `.env.example`
   - Set `NODE_ENV` to `production`

5. **Deploy**:
   - Railway will automatically deploy your application

### 5. Heroku Deployment

1. **Create a Procfile**:
   - Create a file named `Procfile` (no extension) in the project root with the content:
     ```
     web: npm run start
     ```

2. **Sign up/Login to Heroku**:
   - Go to [heroku.com](https://heroku.com) and create an account or log in

3. **Create a new app**:
   - From the dashboard, click "New" → "Create new app"
   - Enter an app name and select a region

4. **Connect to GitHub**:
   - In the Deploy tab, select "GitHub" as the deployment method
   - Connect to your GitHub account and select your repository

5. **Configure environment variables**:
   - Go to Settings → Config Vars
   - Add the environment variables from `.env.example`
   - Set `NODE_ENV` to `production`

6. **Deploy**:
   - Go back to the Deploy tab
   - Enable automatic deploys or manually deploy from the main branch

## Database Integration (Optional)

The application currently uses in-memory storage, but it's prepared for PostgreSQL integration:

1. **Create a PostgreSQL database** on your preferred provider (e.g., Neon, Supabase, Railway)

2. **Add the database URL** to your environment variables:
   ```
   DATABASE_URL=postgresql://username:password@hostname:port/database
   ```

3. **Run database migrations** before deployment:
   ```bash
   npm run db:push
   ```

## Monitoring and Scaling

### Basic Monitoring

- Use the built-in logging system that outputs to the console
- Most cloud platforms provide basic logging and monitoring dashboards

### Advanced Monitoring

- Consider integrating services like Sentry, LogRocket, or New Relic
- Set up custom health check endpoints

### Scaling Considerations

- The application uses in-memory storage by default, which doesn't scale across multiple instances
- Implement the PostgreSQL database option for multi-instance deployments
- Consider adding a Redis cache for rate limiting across instances

## Security Considerations

- Enable HTTPS on your deployment (most platforms do this automatically)
- Review rate limiting settings for production use
- Consider adding authentication for public deployments
- Keep dependencies updated regularly

## Continuous Deployment

All the platforms mentioned above support continuous deployment from GitHub:

1. Push changes to your main branch
2. The platform will automatically build and deploy the new version
3. Monitor the deployment logs for any issues

## Troubleshooting

- **Build Failures**: Check that all dependencies are correctly listed in package.json
- **Runtime Errors**: Review the platform's logs for error messages
- **Performance Issues**: Consider upgrading your service plan or optimizing the application