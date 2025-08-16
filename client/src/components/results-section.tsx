import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type ScrapingJob } from "@shared/schema";

interface ResultsSectionProps {
  currentJob: ScrapingJob | null;
}

export function ResultsSection({ currentJob }: ResultsSectionProps) {
  const { toast } = useToast();

  const cancelMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await apiRequest("POST", `/api/scraping-jobs/${jobId}/cancel`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Job Cancelled",
        description: "The scraping job has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/scraping-jobs"] });
    },
    onError: () => {
      toast({
        title: "Cancel Failed",
        description: "Failed to cancel the scraping job.",
        variant: "destructive",
      });
    },
  });

  const { data: job, isLoading } = useQuery<ScrapingJob>({
    queryKey: ["/api/scraping-jobs", currentJob?.id],
    enabled: !!currentJob?.id,
    refetchInterval: currentJob?.status === "running" ? 1000 : false,
  });

  const results = job?.results;
  const hasResults = results && job?.status === "completed";
  const isRunning = job?.status === "running";
  const hasError = job?.status === "failed";
  const isCancelled = job?.status === "cancelled";
  const canCancel = job?.status === "running" || job?.status === "pending";

  const handleDownloadJSON = () => {
    if (!results) return;

    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `scraping-results-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Download Started",
      description: "Your results have been downloaded as a JSON file.",
    });
  };

  const handleClearResults = () => {
    window.location.reload();
  };

  const handleCancelJob = () => {
    if (currentJob?.id) {
      cancelMutation.mutate(currentJob.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <i className="fas fa-database text-gray-600 text-xl"></i>
            <h2 className="text-xl font-semibold text-gray-900">Scraped Results</h2>
            {results && (
              <Badge variant="secondary">
                {results.totalElements || 0} items
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {canCancel && (
              <Button 
                onClick={handleCancelJob}
                variant="destructive"
                size="sm"
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner animate-spin mr-2"></i>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <i className="fas fa-times mr-2"></i>
                    Cancel
                  </>
                )}
              </Button>
            )}
            
            <Button 
              onClick={handleDownloadJSON}
              variant="outline"
              size="sm"
              disabled={!hasResults}
            >
              <i className="fas fa-download mr-2"></i>
              Download JSON
            </Button>
            
            <Button 
              onClick={handleClearResults}
              variant="ghost"
              size="sm"
              disabled={!currentJob}
            >
              <i className="fas fa-trash-alt mr-2"></i>
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isRunning && (
        <div className="p-8 text-center">
          <div className="inline-flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-gray-600 font-medium">Scraping website...</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments depending on the page size</p>
        </div>
      )}

      {/* Empty State */}
      {!currentJob && (
        <div className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-search text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data scraped yet</h3>
          <p className="text-gray-500 mb-6">Enter a URL and select your scraping options to get started</p>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Scraping Failed</h3>
          <p className="text-gray-500 mb-4">{job?.error || "An error occurred while scraping the website."}</p>
        </div>
      )}

      {/* Cancelled State */}
      {isCancelled && (
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-ban text-orange-500 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Scraping Cancelled</h3>
          <p className="text-gray-500 mb-4">The scraping job was cancelled by the user.</p>
        </div>
      )}

      {/* Results Display */}
      {hasResults && (
        <div className="p-6">
          {/* Page Title & Meta */}
          {(results.title || results.metaDescription) && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <i className="fas fa-heading text-blue-600 mr-2"></i>
                Page Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {results.title && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Title:</span>
                    <p className="text-gray-900 mt-1">{results.title}</p>
                  </div>
                )}
                {results.metaDescription && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Meta Description:</span>
                    <p className="text-gray-700 mt-1">{results.metaDescription}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Links Section */}
          {results.links && results.links.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <i className="fas fa-link text-blue-600 mr-2"></i>
                Extracted Links
                <Badge variant="secondary" className="ml-2">
                  {results.links.length} found
                </Badge>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {results.links.slice(0, 10).map((link: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{link.text}</p>
                        <p className="text-xs text-gray-500 truncate">{link.url}</p>
                      </div>
                      <i className="fas fa-external-link-alt text-gray-400 text-xs ml-2"></i>
                    </div>
                  ))}
                  {results.links.length > 10 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      ... and {results.links.length - 10} more links
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Images Section */}
          {results.images && results.images.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <i className="fas fa-image text-blue-600 mr-2"></i>
                Extracted Images
                <Badge variant="secondary" className="ml-2">
                  {results.images.length} found
                </Badge>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {results.images.slice(0, 10).map((image: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{image.alt || 'No alt text'}</p>
                        <p className="text-xs text-gray-500 truncate">{image.src}</p>
                      </div>
                    </div>
                  ))}
                  {results.images.length > 10 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      ... and {results.images.length - 10} more images
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Headings Section */}
          {results.headings && results.headings.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <i className="fas fa-list text-blue-600 mr-2"></i>
                Extracted Headings
                <Badge variant="secondary" className="ml-2">
                  {results.headings.length} found
                </Badge>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {results.headings.map((heading: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-2 bg-white rounded border">
                      <Badge variant="outline" className="text-xs">
                        H{heading.level}
                      </Badge>
                      <p className="text-sm text-gray-900 flex-1">{heading.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Custom Elements Section */}
          {results.customElements && results.customElements.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <i className="fas fa-code text-blue-600 mr-2"></i>
                Custom Selector Results
                <Badge variant="secondary" className="ml-2">
                  {results.customElements.length} found
                </Badge>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {results.customElements.map((element: any, index: number) => (
                    <div key={index} className="p-2 bg-white rounded border">
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{element.selector}</code>
                      </div>
                      <p className="text-sm text-gray-900">{element.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Custom Selector Error */}
          {results.customSelectorError && (
            <div className="mb-8">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-exclamation-triangle text-red-500"></i>
                  <h4 className="text-sm font-medium text-red-900">Custom Selector Error</h4>
                </div>
                <p className="text-sm text-red-700 mt-1">{results.customSelectorError}</p>
              </div>
            </div>
          )}

          {/* Raw Data Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="fas fa-code text-blue-600 mr-2"></i>
              Raw JSON Data
            </h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
