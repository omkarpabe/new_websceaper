import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Configure Express to trust proxy for rate limiting to work correctly
app.set('trust proxy', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize the app for Netlify Functions
let isInitialized = false;

async function initializeApp() {
  if (isInitialized) return app;
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // For local development
  if (process.env.NODE_ENV === "development" && !process.env.NETLIFY) {
    const port = 3000;
    server.listen(port, () => {
      log(`serving on port ${port}`);
    });
  }
  
  isInitialized = true;
  return app;
}

// Export for Netlify Functions
export const handler = async (event: any, context: any) => {
  const app = await initializeApp();
  const serverless = require('serverless-http');
  return serverless(app)(event, context);
};

// For local development
if (process.env.NODE_ENV === "development" && !process.env.NETLIFY) {
  initializeApp();
}

export default app;
