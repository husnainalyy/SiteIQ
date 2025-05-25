'use client';
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader, Check, X } from "lucide-react";
import { recommendTechStack } from "@/lib/api";

interface TechStack {
  stack: string[];
  reason: string;
}

interface RecommendationResult {
  frontend: TechStack;
  backend: TechStack;
  database: TechStack;
  hosting: TechStack;
  other: TechStack;
}

export default function Recommend() {
  const [formData, setFormData] = useState({
    useCase: "",
    seoFocused: false,
    performanceFocused: false,
  });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.useCase) {
      setError("Please describe your business use case");
      return;
    }

    setLoading(true);
    
    try {
      // Log the form data before sending
      console.log("Form data before sending:", formData);
      
      const requestData = {
        useCase: formData.useCase,
        seoFocused: formData.seoFocused,
        performanceFocused: formData.performanceFocused
      };
      
      console.log("Request data being sent:", requestData);
      
      const response = await recommendTechStack(requestData);
      const data = response.recommendation;
      setRecommendation(data);
    } catch (err) {
      console.error("Error getting recommendation:", err);
      setError("Failed to get recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderTechItem = (tech: TechStack, title: string, index: number, delay: number = 0) => {
    if (!tech || !tech.reason) {
      return null;
    }

    return (
      <motion.div
        key={title}
        className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow-md border border-slate-200 dark:border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + (index * 0.1) }}
        whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
      >
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">{tech.reason}</p>
        
        {tech.stack && tech.stack.length > 0 && (
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Technologies</h5>
              <ul className="space-y-1">
                {tech.stack.map((item, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check size={16} className="text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <motion.div 
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Tech Stack Recommendations
          </motion.h1>
          <motion.p 
            className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Get personalized technology recommendations based on your business needs and priorities.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {!recommendation ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Tell Us About Your Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="useCase">Business Type and Use Case in detail</Label>
                      <Input
                        id="useCase"
                        name="useCase"
                        placeholder="e.g., E-commerce, Blog, SaaS, Portfolio"
                        value={formData.useCase}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Project Priorities</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="seoFocused" 
                            name="seoFocused"
                            checked={formData.seoFocused}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("seoFocused", checked === true)
                            }
                          />
                          <Label htmlFor="seoFocused" className="text-sm">Search Engine Optimization</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="performanceFocused" 
                            name="performanceFocused"
                            checked={formData.performanceFocused}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("performanceFocused", checked === true)
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
                          Generating Recommendations...
                        </>
                      ) : (
                        <>Get Recommendations</>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <Card>
                <CardHeader className="pb-0">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center"
                  >
                    <CardTitle className="text-2xl">Your Personalized Tech Stack</CardTitle>
                    <Button 
                      variant="outline"
                      onClick={() => setRecommendation(null)}
                    >
                      Start Over
                    </Button>
                  </motion.div>
                </CardHeader>
                <CardContent className="pt-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-8"
                  >
                    <h3 className="font-medium text-lg mb-2 text-blue-700 dark:text-blue-400">Summary</h3>
                    <p className="text-slate-700 dark:text-slate-300">
                      Based on your requirements for {formData.useCase}, we've analyzed and recommended the following technology stack.
                      {formData.seoFocused && " SEO optimization has been prioritized."}
                      {formData.performanceFocused && " Performance optimization has been prioritized."}
                    </p>
                  </motion.div>

                  <div className="space-y-8">
                    {/* Frontend Section */}
                    {recommendation.frontend && (
                      <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                            F
                          </div>
                          <h2 className="text-xl font-semibold">Frontend Technologies</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                          {renderTechItem(recommendation.frontend, "Frontend Stack", 0, 0.4)}
                        </div>
                      </motion.section>
                    )}

                    {/* Backend Section */}
                    {recommendation.backend && (
                      <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold mr-3">
                            B
                          </div>
                          <h2 className="text-xl font-semibold">Backend Technologies</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                          {renderTechItem(recommendation.backend, "Backend Stack", 1, 0.6)}
                        </div>
                      </motion.section>
                    )}

                    {/* Database Section */}
                    {recommendation.database && (
                      <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold mr-3">
                            D
                          </div>
                          <h2 className="text-xl font-semibold">Database Solutions</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                          {renderTechItem(recommendation.database, "Database Stack", 2, 0.8)}
                        </div>
                      </motion.section>
                    )}

                    {/* Hosting Section */}
                    {recommendation.hosting && (
                      <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mr-3">
                            H
                          </div>
                          <h2 className="text-xl font-semibold">Hosting & Infrastructure</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                          {renderTechItem(recommendation.hosting, "Hosting Stack", 3, 1.0)}
                        </div>
                      </motion.section>
                    )}

                    {/* Additional Tools Section */}
                    {recommendation.other && (
                      <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 flex items-center justify-center text-white font-bold mr-3">
                            T
                          </div>
                          <h2 className="text-xl font-semibold">Additional Tools</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                          {renderTechItem(recommendation.other, "Additional Tools", 4, 1.2)}
                        </div>
                      </motion.section>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
