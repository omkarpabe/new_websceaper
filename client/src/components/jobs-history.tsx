import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ScrapingJob } from "@shared/schema";

interface JobsHistoryProps {
  onJobSelect: (job: ScrapingJob) => void;
  currentJob: ScrapingJob | null;
}

interface PaginatedJobsResponse {
  jobs: ScrapingJob[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function JobsHistory({ onJobSelect, currentJob }: JobsHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = useQuery<PaginatedJobsResponse>({
    queryKey: ["/api/scraping-jobs", currentPage, limit],
    queryFn: async () => {
      const response = await fetch(`/api/scraping-jobs?page=${currentPage}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return response.json();
    },
    refetchInterval: currentJob?.status === "running" ? 2000 : 10000,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending</Badge>;
      case "running":
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Running</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 text-xs">Failed</Badge>;
      case "cancelled":
        return <Badge className="bg-orange-100 text-orange-800 text-xs">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pagination = data?.pagination;
  const jobs = data?.jobs || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <i className="fas fa-history text-gray-600"></i>
              <span>Jobs History</span>
            </CardTitle>
            <CardDescription>
              {pagination ? `${pagination.total} total jobs` : "Recent scraping jobs"}
            </CardDescription>
          </div>
          {pagination && pagination.total > 0 && (
            <Badge variant="outline" className="text-xs">
              Page {pagination.page} of {pagination.totalPages}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-inbox text-gray-400 text-xl"></i>
            </div>
            <p className="text-gray-500 text-sm">No scraping jobs yet</p>
            <p className="text-gray-400 text-xs">Start your first scraping job above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div 
                key={job.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  currentJob?.id === job.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => onJobSelect(job)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {new URL(job.url).hostname}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{job.url}</p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    {getStatusBadge(job.status)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <i className="fas fa-clock"></i>
                      <span>{formatDate(job.createdAt)}</span>
                    </span>
                    {job.results && (
                      <span className="flex items-center space-x-1">
                        <i className="fas fa-database"></i>
                        <span>{((job.results as any)?.totalElements || 0)} items</span>
                      </span>
                    )}
                  </div>
                  
                  {currentJob?.id === job.id && (
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>
                
                {job.error && (
                  <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700 border border-red-200">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {job.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-xs text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} jobs
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                <i className="fas fa-chevron-left mr-1"></i>
                Prev
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
                <i className="fas fa-chevron-right ml-1"></i>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}