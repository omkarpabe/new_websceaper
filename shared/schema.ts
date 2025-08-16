import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const scrapingJobs = pgTable("scraping_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  status: text("status").notNull().default("pending"), // pending, running, completed, failed, cancelled
  options: json("options").notNull(),
  results: json("results"),
  error: text("error"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertScrapingJobSchema = createInsertSchema(scrapingJobs).pick({
  url: true,
  options: true,
});

export const scrapingOptionsSchema = z.object({
  extractTitle: z.boolean().default(false),
  extractLinks: z.boolean().default(false),
  extractImages: z.boolean().default(false),
  extractHeadings: z.boolean().default(false),
  useCustomSelector: z.boolean().default(false),
  customSelector: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertScrapingJob = z.infer<typeof insertScrapingJobSchema>;
export type ScrapingJob = typeof scrapingJobs.$inferSelect;
export type ScrapingOptions = z.infer<typeof scrapingOptionsSchema>;
