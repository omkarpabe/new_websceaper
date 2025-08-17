# Local Deployment Testing Guide

This guide helps you test the deployment configurations locally before deploying to cloud platforms.

## Testing Docker Deployment

1. **Build the Docker image**:
   ```bash
   docker build -t webscraper-pro .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:3000 webscraper-pro
   ```

3. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

## Testing with Docker Compose

1. **Start the services**:
   ```bash
   docker-compose up
   ```

2. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

## Testing Production Build Locally

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm run start
   # or on Windows
   npm run start:win
   ```

3. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

## Verifying Deployment Files

Before pushing to a cloud platform, verify these files:

- **Vercel**: Check `vercel.json` configuration
- **Netlify**: Check `netlify.toml` configuration
- **Heroku**: Check `Procfile` configuration
- **Docker**: Check `Dockerfile` and `docker-compose.yml`
- **CI/CD**: Check `.github/workflows/ci-cd.yml`

## Pre-Deployment Checklist

- [ ] Application builds successfully
- [ ] Application runs in production mode
- [ ] Environment variables are properly configured
- [ ] Rate limiting is appropriate for production
- [ ] All deployment configuration files are committed to the repository

## Troubleshooting

### Docker Issues

- **Port conflicts**: Change the port mapping in `docker run` or `docker-compose.yml`
- **Build errors**: Check the Dockerfile and ensure all dependencies are included

### Production Build Issues

- **Build failures**: Check for TypeScript errors with `npm run check`
- **Runtime errors**: Check server logs for error messages

### Environment Variable Issues

- Create a `.env` file based on `.env.example` for local testing
- Ensure all required environment variables are set in your deployment platform