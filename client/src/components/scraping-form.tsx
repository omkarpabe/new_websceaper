import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { type ScrapingFormData, type ScrapingJob } from "@/lib/types";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  extractTitle: z.boolean().default(false),
  extractLinks: z.boolean().default(false),
  extractImages: z.boolean().default(false),
  extractHeadings: z.boolean().default(false),
  useCustomSelector: z.boolean().default(false),
  customSelector: z.string().optional(),
}).refine((data) => {
  if (data.useCustomSelector && !data.customSelector?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Custom selector is required when custom selector option is enabled",
  path: ["customSelector"],
});

interface ScrapingFormProps {
  onJobCreated: (job: ScrapingJob) => void;
}

export function ScrapingForm({ onJobCreated }: ScrapingFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ScrapingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      extractTitle: true,
      extractLinks: true,
      extractImages: false,
      extractHeadings: false,
      useCustomSelector: false,
      customSelector: "",
    },
  });

  const scrapeMutation = useMutation({
    mutationFn: async (data: ScrapingFormData) => {
      const response = await apiRequest("POST", "/api/scrape", {
        url: data.url,
        options: data,
      });
      return response.json();
    },
    onSuccess: (job: ScrapingJob) => {
      toast({
        title: "Scraping Started",
        description: "Your scraping job has been queued and will begin shortly.",
      });
      onJobCreated(job);
    },
    onError: (error: any) => {
      toast({
        title: "Scraping Failed",
        description: error.message || "Failed to start scraping job",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ScrapingFormData) => {
    scrapeMutation.mutate(data);
  };

  const handleClearForm = () => {
    form.reset();
  };

  const watchUseCustomSelector = form.watch("useCustomSelector");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <i className="fas fa-link text-blue-600 text-xl"></i>
        <h2 className="text-xl font-semibold text-gray-900">Configure Scraping</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* URL Input */}
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Website URL <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://example.com"
                      className="pl-12"
                    />
                    <i className="fas fa-globe absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </FormControl>
                <p className="text-xs text-gray-500">Enter the complete URL including http:// or https://</p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Scraping Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Scraping Options</h3>
            <div className="space-y-4">
              
              {/* Basic Content Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="extractTitle"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="w-4 h-4"
                          />
                        </FormControl>
                        <div className="ml-3">
                          <FormLabel className="text-sm font-medium text-gray-900 cursor-pointer">
                            Page Title & Meta
                          </FormLabel>
                          <div className="text-xs text-gray-500">Extract title and meta description</div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extractLinks"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="w-4 h-4"
                          />
                        </FormControl>
                        <div className="ml-3">
                          <FormLabel className="text-sm font-medium text-gray-900 cursor-pointer">
                            All Links
                          </FormLabel>
                          <div className="text-xs text-gray-500">Extract all anchor tags and URLs</div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extractImages"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="w-4 h-4"
                          />
                        </FormControl>
                        <div className="ml-3">
                          <FormLabel className="text-sm font-medium text-gray-900 cursor-pointer">
                            Images
                          </FormLabel>
                          <div className="text-xs text-gray-500">Extract all image URLs and alt text</div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extractHeadings"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="w-4 h-4"
                          />
                        </FormControl>
                        <div className="ml-3">
                          <FormLabel className="text-sm font-medium text-gray-900 cursor-pointer">
                            Headings
                          </FormLabel>
                          <div className="text-xs text-gray-500">Extract H1, H2, H3 tags</div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Custom Selector */}
              <div className="border border-gray-200 rounded-lg p-4">
                <FormField
                  control={form.control}
                  name="useCustomSelector"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center mb-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="w-4 h-4"
                          />
                        </FormControl>
                        <FormLabel className="ml-2 text-sm font-medium text-gray-900 cursor-pointer">
                          Custom CSS Selector
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customSelector"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder=".product-title, #main-content, div.article"
                          className="font-mono text-sm"
                          disabled={!watchUseCustomSelector}
                        />
                      </FormControl>
                      <p className="mt-2 text-xs text-gray-500">
                        <i className="fas fa-info-circle mr-1"></i>
                        Enter CSS selectors separated by commas. Examples: .class-name, #id, tag[attribute]
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              disabled={scrapeMutation.isPending}
            >
              {scrapeMutation.isPending ? (
                <>
                  <i className="fas fa-spinner animate-spin mr-2"></i>
                  Starting...
                </>
              ) : (
                <>
                  <i className="fas fa-play mr-2"></i>
                  Start Scraping
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={handleClearForm}
              disabled={scrapeMutation.isPending}
            >
              <i className="fas fa-undo mr-2"></i>
              Clear Form
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
