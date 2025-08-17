import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { type ScrapingJob } from "@shared/schema";

interface StatusPanelProps {
  currentJob: ScrapingJob | null;
}

export function StatusPanel({ currentJob }: StatusPanelProps) {
  const { data } = useQuery<{ jobs: ScrapingJob[] }>({\n    queryKey: ["/api/scraping-jobs", 1, 1],\n    queryFn: async () => {\n      const response = await fetch('/api/scraping-jobs?page=1&limit=1');\n      if (!response.ok) throw new Error('Failed to fetch jobs');\n      return response.json();\n    },\n    refetchInterval: currentJob?.status === "running" ? 1000 : false,\n    staleTime: 0, // Ensure we always get fresh data\n    cacheTime: 0, // Don't cache the results\n  });
  
  const jobs = data?.jobs || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "cancelled":
        return <Badge className="bg-orange-100 text-orange-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Ready</Badge>;
    }
  };

  const currentStatus = currentJob?.status || "ready";
  const lastRequest = jobs && jobs.length > 0 && jobs[0]?.createdAt 
    ? new Date(jobs[0].createdAt).toLocaleString() 
    : "Never";

  return (
    <>
      {/* Status Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <i className="fas fa-tachometer-alt text-green-600 text-xl"></i>
          <h3 className="text-lg font-semibold text-gray-900">Status</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Status</span>
            {getStatusBadge(currentStatus)}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Last Request</span>
            <span className="text-xs text-gray-500">{lastRequest}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Rate Limit</span>
            <span className="text-xs text-gray-500">Available</span>
          </div>
        </div>
      </div>

      {/* Quick Help */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center space-x-2 mb-3">
          <i className="fas fa-question-circle text-blue-600"></i>
          <h3 className="text-lg font-semibold text-blue-900">Quick Help</h3>
        </div>
        
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <i className="fas fa-lightbulb text-xs mt-1"></i>
            <p>Use CSS selectors like <code className="bg-blue-100 px-1 rounded">.className</code> or <code className="bg-blue-100 px-1 rounded">#elementId</code></p>
          </div>
          
          <div className="flex items-start space-x-2">
            <i className="fas fa-clock text-xs mt-1"></i>
            <p>Scraping typically takes 2-10 seconds depending on page size</p>
          </div>
          
          <div className="flex items-start space-x-2">
            <i className="fas fa-shield-alt text-xs mt-1"></i>
            <p>Only public websites are supported. Respect robots.txt</p>
          </div>
        </div>
      </div>
    </>
  );
}
