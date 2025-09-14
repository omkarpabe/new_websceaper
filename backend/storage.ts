import { type User, type InsertUser, type ScrapingJob, type InsertScrapingJob } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createScrapingJob(job: InsertScrapingJob): Promise<ScrapingJob>;
  getScrapingJob(id: string): Promise<ScrapingJob | undefined>;
  updateScrapingJob(id: string, updates: Partial<ScrapingJob>): Promise<ScrapingJob | undefined>;
  getRecentScrapingJobs(limit?: number, offset?: number): Promise<{ jobs: ScrapingJob[], total: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private scrapingJobs: Map<string, ScrapingJob>;

  constructor() {
    this.users = new Map();
    this.scrapingJobs = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createScrapingJob(insertJob: InsertScrapingJob): Promise<ScrapingJob> {
    const id = randomUUID();
    const job: ScrapingJob = {
      ...insertJob,
      id,
      status: "pending",
      results: null,
      error: null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.scrapingJobs.set(id, job);
    return job;
  }

  async getScrapingJob(id: string): Promise<ScrapingJob | undefined> {
    return this.scrapingJobs.get(id);
  }

  async updateScrapingJob(id: string, updates: Partial<ScrapingJob>): Promise<ScrapingJob | undefined> {
    const job = this.scrapingJobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...updates };
    this.scrapingJobs.set(id, updatedJob);
    return updatedJob;
  }

  async getRecentScrapingJobs(limit = 10, offset = 0): Promise<{ jobs: ScrapingJob[], total: number }> {
    const allJobs = Array.from(this.scrapingJobs.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const jobs = allJobs.slice(offset, offset + limit);
    const total = allJobs.length;
    
    return { jobs, total };
  }
}

export const storage = new MemStorage();
