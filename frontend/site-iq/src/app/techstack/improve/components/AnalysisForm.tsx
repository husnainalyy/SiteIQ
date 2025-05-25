import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader } from 'lucide-react';
import { FormData } from '../types';

interface AnalysisFormProps {
  formData: FormData;
  loading: boolean;
  error: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({
  formData,
  loading,
  error,
  onInputChange,
  onCheckboxChange,
  onSubmit,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Your Website Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input
              id="websiteUrl"
              name="websiteUrl"
              placeholder="https://example.com"
              value={formData.websiteUrl}
              onChange={onInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="useCase">Describe Your Website/Business</Label>
            <Input
              id="useCase"
              name="useCase"
              placeholder="e.g., E-commerce site selling handmade crafts, focusing on international customers"
              value={formData.useCase}
              onChange={onInputChange}
            />
          </div>

          <div className="space-y-4">
            <Label>Improvement Priorities</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="seoFocused" 
                  checked={formData.seoFocused}
                  onCheckedChange={(checked) => 
                    onCheckboxChange("seoFocused", checked as boolean)
                  }
                />
                <Label htmlFor="seoFocused" className="text-sm">Search Engine Optimization</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="performanceFocused" 
                  checked={formData.performanceFocused}
                  onCheckedChange={(checked) => 
                    onCheckboxChange("performanceFocused", checked as boolean)
                  }
                />
                <Label htmlFor="performanceFocused" className="text-sm">Performance & Speed</Label>
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <Button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" />
                Analyzing Website...
              </>
            ) : (
              <>Analyze & Improve</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 