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

### Common Vercel Error Codes

When deploying to Vercel, you might encounter these common error codes:

1. **NOT_FOUND (404)**: The requested resource or deployment was not found
2. **DEPLOYMENT_NOT_FOUND (404)**: The specific deployment you're trying to access doesn't exist
3. **FUNCTION_INVOCATION_FAILED (500)**: Server-side function execution failed
4. **FUNCTION_INVOCATION_TIMEOUT (504)**: Server-side function took too long to execute
5. **FUNCTION_PAYLOAD_TOO_LARGE (413)**: Request body sent to a serverless function is too large
6. **MIDDLEWARE_INVOCATION_FAILED (500)**: Middleware execution failed
7. **MIDDLEWARE_INVOCATION_TIMEOUT (504)**: Middleware took too long to execute
8. **DEPLOYMENT_PAUSED (503)**: The deployment is currently paused

### Resolving Common Vercel Errors

- **404 Errors**: Check your routing configuration in `vercel.json` and ensure all paths are correctly defined
- **500 Errors**: Review your server-side code for bugs or issues handling requests
- **Timeout Errors**: Optimize your serverless functions to execute within the time limits
- **Payload Errors**: Reduce the size of request/response data or use streaming for large data transfers

### Common Netlify Error Codes

When deploying to Netlify, you might encounter these common issues:

1. **Build Command Failed**: The build command specified in your Netlify configuration failed to execute
2. **Function Bundling Failed**: Issues with packaging serverless functions
3. **Deploy Failed**: General deployment failure, often due to build issues
4. **Function Execution Error (500)**: Server-side function execution failed
5. **Function Timeout (504)**: Function took too long to execute (default timeout is 10 seconds)

### Resolving Common Netlify Errors

- **Build Failures**: Check the build logs for specific errors and ensure all dependencies are installed
- **Function Errors**: Review your function code and test locally using Netlify CLI
- **Routing Issues**: Verify your `netlify.toml` redirects and rewrite rules
- **Timeout Errors**: Optimize function code or increase timeout limits in your Netlify configuration

### Common Docker Deployment Issues

1. **Image Build Failures**: Issues with Dockerfile instructions or dependencies
2. **Container Exit**: Container stops unexpectedly after starting
3. **Port Binding Issues**: Container ports not properly mapped to host
4. **Volume Mount Problems**: Issues with persistent storage configuration
5. **Network Connectivity**: Container cannot connect to required services

### Resolving Docker Deployment Issues

- **Build Failures**: Check Dockerfile syntax and ensure base images are available
- **Container Exits**: Review container logs for error messages and ensure environment variables are set correctly
- **Port Issues**: Verify port mappings in `docker-compose.yml` or docker run commands
- **Network Issues**: Check network configuration and ensure services can communicate

### Common Heroku Deployment Errors

1. **H10 - App Crashed**: Application crashed after startup
2. **H12 - Request Timeout**: Request took too long to complete
3. **H14 - No Web Dynos Running**: Web process type not scaled up
4. **H20 - App Boot Timeout**: Application failed to boot within 60 seconds
5. **R14 - Memory Quota Exceeded**: Application using too much memory

### Resolving Heroku Deployment Issues

- **App Crashes**: Check application logs using `heroku logs --tail`
- **Timeout Errors**: Optimize slow operations or move them to background workers
- **Boot Issues**: Ensure your application starts within the time limit
- **Memory Issues**: Optimize memory usage or upgrade to a larger dyno

## Deployment Best Practices

### Pre-Deployment Checklist

1. **Local Testing**: Ensure the application runs correctly in a production-like environment locally
2. **Environment Variables**: Verify all required environment variables are configured
3. **Dependencies**: Make sure all dependencies are properly listed in package.json
4. **Build Process**: Test the build process locally before deploying
5. **Security**: Remove any sensitive information from the codebase

### Post-Deployment Verification

1. **Functionality Testing**: Verify all features work as expected in the deployed environment
2. **Performance Testing**: Check load times and responsiveness
3. **Error Monitoring**: Set up error tracking and monitoring
4. **Backup Strategy**: Implement regular backups if using a database

### Maintenance

1. **Regular Updates**: Keep dependencies updated to patch security vulnerabilities
2. **Monitoring**: Regularly check application logs and performance metrics
3. **Scaling**: Adjust resources based on usage patterns
4. **Documentation**: Keep deployment documentation updated with any changes