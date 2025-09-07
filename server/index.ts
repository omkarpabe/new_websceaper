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

// Initialize app for production/Netlify without async
let appInitialized = false;
let serverlessHandler: any = null;

// Synchronous initialization for basic Express setup
function setupBasicApp() {
  if (appInitialized) return;
  
  // Add error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });
  
  // Setup static serving for production
  if (process.env.NODE_ENV === "production" || process.env.NETLIFY) {
    serveStatic(app);
  }
  
  appInitialized = true;
}

// Export for Netlify Functions
export const handler = async (event: any, context: any) => {
  if (!serverlessHandler) {
    setupBasicApp();
    
    // Initialize routes asynchronously
    await registerRoutes(app);
    
    const serverless = require('serverless-http');
    serverlessHandler = serverless(app);
  }
  return serverlessHandler(event, context);
};

// For local development - initialize without top-level await
if (process.env.NODE_ENV === "development" && !process.env.NETLIFY) {
  const initDev = async () => {
    const server = await registerRoutes(app);
    
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
    
    await setupVite(app, server);
    
    const port = 3000;
    server.listen(port, () => {
      log(`serving on port ${port}`);
    });
  };
  
  initDev().catch(console.error);
}

export default app;
