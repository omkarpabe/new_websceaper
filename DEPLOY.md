# Deployment Guide (Free Tier)

This guide will help you deploy your application for free using **Render** (for hosting) and **Neon** (for the database).

## Prerequisites
- A [GitHub](https://github.com) account.
- A [Render](https://render.com) account.
- A [Neon](https://neon.tech) account.

## Step 1: Set up the Database (Neon)
1. Log in to **Neon Console**.
2. Create a new project.
3. Once created, copy the **Connection String** (it looks like `postgres://user:password@...`).
   - Make sure to select the "Pooled" connection option if available, or just the standard one.
4. Keep this string safe; you will need it later.

## Step 2: Push Code to GitHub
1. Create a new repository on GitHub.
2. Push your project code to this repository.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

## Step 3: Deploy to Render
1. Log in to **Render Dashboard**.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select the repository you just pushed.
4. Configure the service:
   - **Name**: Choose a name (e.g., `web-scraper-app`).
   - **Region**: Choose the one closest to you.
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build && npm run db:push`
     - *Note: We include `db:push` to automatically update your database schema on deployment.*
   - **Start Command**: `npm start`
   - **Instance Type**: Select **Free**.

## Step 4: Configure Environment Variables
Scroll down to the **Environment Variables** section on Render and add the following:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste your Neon connection string from Step 1. |
| `SESSION_SECRET` | Enter a long random string (e.g., `super_secret_random_key_123`). |

## Step 5: Finish and Deploy
1. Click **Create Web Service**.
2. Render will start building your app. You can watch the logs.
3. Once the build finishes and the service is live, you will see a URL (e.g., `https://web-scraper-app.onrender.com`).
4. Click the URL to view your live application!

## Troubleshooting
- **Database Errors**: If you see database errors, ensure your `DATABASE_URL` is correct and that the `npm run db:push` command ran successfully in the build logs.
- **Build Failures**: Check the logs for any TypeScript errors.
- **App Sleeping**: On the free tier, Render spins down the app after 15 minutes of inactivity. The first request after sleep might take 30-60 seconds to load.
