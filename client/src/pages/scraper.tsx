import { useState } from "react";
import { ScrapingForm } from "@/components/scraping-form";
import { StatusPanel } from "@/components/status-panel";
import { ResultsSection } from "@/components/results-section";
import { type ScrapingJob } from "@shared/schema";

export default function ScraperPage() {
  const [currentJob, setCurrentJob] = useState<ScrapingJob | null>(null);

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-spider text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WebScraper Pro</h1>
                <p className="text-xs text-gray-500">Extract data from any website</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Rate Limited: 1 request per 5 seconds</span>
              <div className="w-2 h-2 bg-green-400 rounded-full" title="Service Online"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ScrapingForm onJobCreated={setCurrentJob} />
          </div>
          <div className="space-y-6">
            <StatusPanel currentJob={currentJob} />
          </div>
        </div>

        <div className="mt-8">
          <ResultsSection currentJob={currentJob} />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-spider text-white text-sm"></i>
              </div>
              <span className="text-gray-600">WebScraper Pro</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>Rate Limited Service</span>
              <span>•</span>
              <span>Respect robots.txt</span>
              <span>•</span>
              <span>Public websites only</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
