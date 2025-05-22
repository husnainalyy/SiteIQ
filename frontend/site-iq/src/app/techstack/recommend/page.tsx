'use client';
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader, Check, X } from "lucide-react";

interface RecommendationResult {
  summary: string;
  frontend: TechRecommendation[];
  backend: TechRecommendation[];
  database: TechRecommendation[];
  hosting: TechRecommendation[];
  additionalTools: TechRecommendation[];
}

interface TechRecommendation {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
}

export default function Recommend() {
  const [formData, setFormData] = useState({
    useCase: "",
    businessType: "",
    seoFocused: true,
    performanceFocused: true,
    scalability: false,
    budget: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleBudgetChange = (budget: string) => {
    setFormData({
      ...formData,
      budget,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.useCase) {
      setError("Please describe your business use case");
      return;
    }

    if (!formData.businessType) {
      setError("Please specify your business type");
      return;
    }

    setLoading(true);
    
    try {
      // In a real application, you would call your backend API here
      // const response = await fetch('http://localhost:4500/api/techstack/recommend', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // const data = await response.json();
      
      // Mock API response for now
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Example response
      const mockRecommendation: RecommendationResult = {
        summary: "Based on your e-commerce business needs with focus on SEO and performance, I recommend a modern stack that balances development speed, performance, and SEO capabilities while fitting within a medium budget constraint.",
        frontend: [
          {
            name: "Next.js",
            description: "A React framework with built-in SSR/SSG capabilities ideal for e-commerce",
            pros: [
              "Excellent SEO through server-side rendering",
              "Fast page loads with automatic code splitting",
              "Large ecosystem of components and libraries"
            ],
            cons: [
              "Steeper learning curve than plain React",
              "Requires more server resources than static sites"
            ]
          },
          {
            name: "Tailwind CSS",
            description: "Utility-first CSS framework for rapid UI development",
            pros: [
              "Highly customizable",
              "Minimal CSS output for performance",
              "Rapid development through utility classes"
            ],
            cons: [
              "HTML can become verbose",
              "Initial learning curve"
            ]
          }
        ],
        backend: [
          {
            name: "Node.js with Express",
            description: "JavaScript runtime with popular web framework",
            pros: [
              "JavaScript throughout the stack",
              "Large ecosystem of packages",
              "Good performance for most e-commerce workloads"
            ],
            cons: [
              "Not as performant as some compiled languages",
              "Callback-heavy code can become complex"
            ]
          }
        ],
        database: [
          {
            name: "PostgreSQL",
            description: "Powerful open-source relational database",
            pros: [
              "Robust feature set",
              "Excellent for complex data relationships",
              "Strong reliability and data integrity"
            ],
            cons: [
              "Requires more configuration than NoSQL options",
              "May need optimization for very high traffic"
            ]
          },
          {
            name: "Redis",
            description: "In-memory data store for caching",
            pros: [
              "Extremely fast response times",
              "Reduces database load",
              "Improves user experience through caching"
            ],
            cons: [
              "Additional infrastructure to manage",
              "Requires memory management strategies"
            ]
          }
        ],
        hosting: [
          {
            name: "Vercel",
            description: "Platform optimized for Next.js deployments",
            pros: [
              "Seamless integration with Next.js",
              "Global CDN for fast content delivery",
              "Automatic HTTPS and edge caching"
            ],
            cons: [
              "Can become costly at higher traffic volumes",
              "Some vendor lock-in"
            ]
          }
        ],
        additionalTools: [
          {
            name: "Stripe",
            description: "Payment processing platform",
            pros: [
              "Easy integration",
              "Comprehensive payment options",
              "Strong security features"
            ],
            cons: [
              "Transaction fees higher than some alternatives",
              "Complex refund processes"
            ]
          },
          {
            name: "Algolia",
            description: "Search-as-a-service platform",
            pros: [
              "Lightning-fast search results",
              "Typo tolerance and filtering",
              "Analytics on user search behavior"
            ],
            cons: [
              "Monthly cost increases with data size",
              "Requires synchronization with your database"
            ]
          }
        ]
      };

      setRecommendation(mockRecommendation);
    } catch (err) {
      console.error("Error getting recommendation:", err);
      setError("Failed to get recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderTechItem = (tech: TechRecommendation, index: number, delay: number = 0) => (
    <motion.div
      key={tech.name}
      className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow-md border border-slate-200 dark:border-slate-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + (index * 0.1) }}
      whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <h4 className="text-lg font-semibold mb-2">{tech.name}</h4>
      <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">{tech.description}</p>
      
      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Pros</h5>
          <ul className="space-y-1">
            {tech.pros.map((pro, i) => (
              <li key={i} className="flex items-start text-sm">
                <Check size={16} className="text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h5 className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Cons</h5>
          <ul className="space-y-1">
            {tech.cons.map((con, i) => (
              <li key={i} className="flex items-start text-sm">
                <X size={16} className="text-red-500 mr-2 mt-0.5 shrink-0" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );

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
                      <Label htmlFor="businessType">Business Type</Label>
                      <Input
                        id="businessType"
                        name="businessType"
                        placeholder="e.g., E-commerce, Blog, SaaS, Portfolio"
                        value={formData.businessType}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="useCase">Describe Your Website/Application Use Case</Label>
                      <Textarea
                        id="useCase"
                        name="useCase"
                        placeholder="e.g., I need an online store to sell handmade crafts with payment processing, inventory management, and a blog section."
                        rows={4}
                        value={formData.useCase}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label className="block mb-2">Project Budget</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          type="button"
                          variant={formData.budget === "low" ? "default" : "outline"}
                          className={formData.budget === "low" ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
                          onClick={() => handleBudgetChange("low")}
                        >
                          Low
                        </Button>
                        <Button
                          type="button"
                          variant={formData.budget === "medium" ? "default" : "outline"}
                          className={formData.budget === "medium" ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
                          onClick={() => handleBudgetChange("medium")}
                        >
                          Medium
                        </Button>
                        <Button
                          type="button"
                          variant={formData.budget === "high" ? "default" : "outline"}
                          className={formData.budget === "high" ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
                          onClick={() => handleBudgetChange("high")}
                        >
                          High
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Project Priorities</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="seoFocused" 
                            checked={formData.seoFocused}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("seoFocused", checked as boolean)
                            }
                          />
                          <Label htmlFor="seoFocused" className="text-sm">Search Engine Optimization</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="performanceFocused" 
                            checked={formData.performanceFocused}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("performanceFocused", checked as boolean)
                            }
                          />
                          <Label htmlFor="performanceFocused" className="text-sm">Performance & Speed</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="scalability" 
                            checked={formData.scalability}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("scalability", checked as boolean)
                            }
                          />
                          <Label htmlFor="scalability" className="text-sm">Scalability for Growth</Label>
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
                    <p className="text-slate-700 dark:text-slate-300">{recommendation.summary}</p>
                  </motion.div>

                  <div className="space-y-8">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recommendation.frontend.map((tech, index) => (
                          renderTechItem(tech, index, 0.4)
                        ))}
                      </div>
                    </motion.section>

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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recommendation.backend.map((tech, index) => (
                          renderTechItem(tech, index, 0.6)
                        ))}
                      </div>
                    </motion.section>

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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recommendation.database.map((tech, index) => (
                          renderTechItem(tech, index, 0.8)
                        ))}
                      </div>
                    </motion.section>

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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recommendation.hosting.map((tech, index) => (
                          renderTechItem(tech, index, 1.0)
                        ))}
                      </div>
                    </motion.section>

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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recommendation.additionalTools.map((tech, index) => (
                          renderTechItem(tech, index, 1.2)
                        ))}
                      </div>
                    </motion.section>
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
