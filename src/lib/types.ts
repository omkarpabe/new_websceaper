export interface ScrapingFormData {
  url: string;
  extractTitle: boolean;
  extractLinks: boolean;
  extractImages: boolean;
  extractHeadings: boolean;
  useCustomSelector: boolean;
  customSelector?: string;
}

export interface ScrapingResults {
  url: string;
  scrapedAt: string;
  totalElements: number;
  title?: string;
  metaDescription?: string;
  links?: Array<{text: string, url: string}>;
  images?: Array<{src: string, alt: string, title?: string}>;
  headings?: Array<{level: number, text: string}>;
  customElements?: Array<{selector: string, text: string, html: string}>;
  customSelectorError?: string;
}

export interface ScrapingJob {
  id: string;
  url: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  options: ScrapingFormData;
  results?: ScrapingResults;
  error?: string;
  createdAt: string;
  completedAt?: string;
}
