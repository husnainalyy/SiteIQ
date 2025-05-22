'use client';
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/Button";
import { ArrowRight } from "lucide-react";

export default function TechStackLanding() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        className="max-w-4xl mx-auto text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Tech Stack Services
        </motion.h1>
        <motion.p 
          className="text-xl text-slate-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Optimize your website's technology stack with our AI-powered tech analysis 
          and recommendation tools. Choose the service that best fits your needs.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full overflow-hidden border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 pb-6">
              <CardTitle className="text-2xl">Tech Stack Improvement</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6 text-slate-600">
                <p className="mb-4">
                  Already have a website? Let our AI analyze your current tech stack and suggest 
                  specific improvements to enhance performance, SEO, and user experience.
                </p>
                <ul className="space-y-2 mb-6">
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Analyze your existing website</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Identify performance bottlenecks</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Receive tailored improvement suggestions</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Chat with our AI for detailed advice</span>
                  </motion.li>
                </ul>
              </div>
              <Link to="/techstack/improve">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Improve Existing Stack <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="h-full overflow-hidden border-2 hover:border-purple-500 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 pb-6">
              <CardTitle className="text-2xl">Tech Stack Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6 text-slate-600">
                <p className="mb-4">
                  Planning a new website or application? Get personalized technology stack recommendations 
                  based on your specific business needs, priorities, and budget.
                </p>
                <ul className="space-y-2 mb-6">
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Describe your project requirements</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Set your priorities (SEO, performance, etc.)</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Get comprehensive stack recommendations</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.0 }}
                  >
                    <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Receive detailed pros and cons analysis</span>
                  </motion.li>
                </ul>
              </div>
              <Link to="/techstack/recommend">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                >
                  Get Recommendations <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          Not sure which service is right for you? Our tech experts can help guide you 
          to the most suitable solution for your specific needs.
        </p>
        <Button variant="outline" size="lg" className="border-blue-500 text-blue-600 hover:bg-blue-50">
          Contact Our Tech Experts
        </Button>
      </motion.div>
    </div>
  );
}
