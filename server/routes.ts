import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScrapingJobSchema, scrapingOptionsSchema } from "@shared/schema";
import * as cheerio from "cheerio";
import rateLimit from "express-rate-limit";

// Store active scraping jobs and their abort controllers
const activeJobs = new Map<string, AbortController>();

// Rate limiting middleware
const scrapeRateLimit = rateLimit({
  windowMs: 5000, // 5 seconds
  max: 1, // limit each IP to 1 request per windowMs
  message: { message: "Rate limit exceeded. Please wait 5 seconds between requests." },
  standardHeaders: true,
  legacyHeaders: false,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all scraping jobs
  app.get("/api/scraping-jobs", async (req, res) => {
    try {
      const jobs = await storage.getRecentScrapingJobs(20);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scraping jobs" });
    }
  });

  // Get specific scraping job
  app.get("/api/scraping-jobs/:id", async (req, res) => {
    try {
      const job = await storage.getScrapingJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scraping job" });
    }
  });

  // Create new scraping job
  app.post("/api/scrape", scrapeRateLimit, async (req, res) => {
    try {
      // Validate request body
      const parsed = insertScrapingJobSchema.parse(req.body);
      const options = scrapingOptionsSchema.parse(parsed.options);

      // Validate URL
      let url: URL;
      try {
        url = new URL(parsed.url);
        if (!['http:', 'https:'].includes(url.protocol)) {
          return res.status(400).json({ message: "URL must use HTTP or HTTPS protocol" });
        }
      } catch {
        return res.status(400).json({ message: "Invalid URL format" });
      }

      // Create scraping job
      const job = await storage.createScrapingJob(parsed);

      // Start scraping process
      scrapeWebsite(job.id, parsed.url, options);

      res.json(job);
    } catch (error: any) {
      if (error?.name === "ZodError") {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create scraping job" });
    }
  });

  // Cancel scraping job
  app.post("/api/scraping-jobs/:id/cancel", async (req, res) => {
    try {
      const jobId = req.params.id;
      const job = await storage.getScrapingJob(jobId);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.status !== "running" && job.status !== "pending") {
        return res.status(400).json({ message: "Job cannot be cancelled" });
      }

      // Cancel the active job if it exists
      const controller = activeJobs.get(jobId);
      if (controller) {
        controller.abort();
        activeJobs.delete(jobId);
      }

      // Update job status to cancelled
      const updatedJob = await storage.updateScrapingJob(jobId, {
        status: "cancelled",
        error: "Cancelled by user",
        completedAt: new Date()
      });

      res.json(updatedJob);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to cancel scraping job" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function scrapeWebsite(jobId: string, url: string, options: any) {
  const controller = new AbortController();
  activeJobs.set(jobId, controller);
  
  try {
    // Update job status to running
    await storage.updateScrapingJob(jobId, { status: "running" });

    // Fetch the webpage with timeout using AbortController
    const timeoutId = setTimeout(() => controller.abort(), 30000); // Increased to 30 seconds
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebScraper/1.0)',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const results: any = {
      url,
      scrapedAt: new Date().toISOString(),
      totalElements: 0,
    };

    // Extract page title and meta description
    if (options.extractTitle) {
      results.title = $('title').text().trim() || null;
      results.metaDescription = $('meta[name="description"]').attr('content') || null;
    }

    // Extract links
    if (options.extractLinks) {
      const links: Array<{text: string, url: string}> = [];
      $('a[href]').each((_, element) => {
        const $el = $(element);
        const href = $el.attr('href');
        const text = $el.text().trim();
        
        if (href && text) {
          try {
            const linkUrl = new URL(href, url);
            links.push({
              text: text.substring(0, 200), // Limit text length
              url: linkUrl.toString()
            });
          } catch {
            // Skip invalid URLs
          }
        }
      });
      results.links = links;
      results.totalElements += links.length;
    }

    // Extract images
    if (options.extractImages) {
      const images: Array<{src: string, alt: string, title?: string}> = [];
      $('img[src]').each((_, element) => {
        const $el = $(element);
        const src = $el.attr('src');
        const alt = $el.attr('alt') || '';
        const title = $el.attr('title');
        
        if (src) {
          try {
            const imgUrl = new URL(src, url);
            images.push({
              src: imgUrl.toString(),
              alt: alt.substring(0, 200),
              ...(title && { title: title.substring(0, 200) })
            });
          } catch {
            // Skip invalid URLs
          }
        }
      });
      results.images = images;
      results.totalElements += images.length;
    }

    // Extract headings
    if (options.extractHeadings) {
      const headings: Array<{level: number, text: string}> = [];
      $('h1, h2, h3, h4, h5, h6').each((_, element) => {
        const $el = $(element);
        const text = $el.text().trim();
        const level = parseInt(element.tagName.charAt(1));
        
        if (text) {
          headings.push({
            level,
            text: text.substring(0, 300)
          });
        }
      });
      results.headings = headings;
      results.totalElements += headings.length;
    }

    // Extract custom selector elements
    if (options.useCustomSelector && options.customSelector) {
      try {
        const customElements: Array<{selector: string, text: string, html: string}> = [];
        const selectors = options.customSelector.split(',').map((s: string) => s.trim());
        
        selectors.forEach((selector: string) => {
          if (selector) {
            $(selector).each((_, element) => {
              const $el = $(element);
              const text = $el.text().trim();
              const html = $el.html();
              
              if (text || html) {
                customElements.push({
                  selector,
                  text: text.substring(0, 500),
                  html: html ? html.substring(0, 1000) : ''
                });
              }
            });
          }
        });
        
        results.customElements = customElements;
        results.totalElements += customElements.length;
      } catch (error: any) {
        results.customSelectorError = `Invalid CSS selector: ${error?.message || 'Unknown error'}`;
      }
    }

    // Update job with results
    await storage.updateScrapingJob(jobId, {
      status: "completed",
      results,
      completedAt: new Date()
    });

  } catch (error: any) {
    // Check if the error is due to abort (cancellation)
    if (error?.name === 'AbortError') {
      await storage.updateScrapingJob(jobId, {
        status: "cancelled",
        error: "Cancelled by user",
        completedAt: new Date()
      });
    } else {
      // Update job with error
      await storage.updateScrapingJob(jobId, {
        status: "failed",
        error: error?.message || 'Unknown error occurred',
        completedAt: new Date()
      });
    }
  } finally {
    // Clean up the active job
    activeJobs.delete(jobId);
  }
}
