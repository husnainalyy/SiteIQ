'use client';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import DemoSection from "@/components/DemoSection";
import PricingPlans from "@/components/PricingPlans";
import FaqAccordion from "@/components/FaqAccordion";
import HeroAnimation from "@/components/HeroAnimation";
import CtaSection from "@/components/CtaSection";
import AnimatedFeature from "@/components/AnimatedFeature";
import { motion } from "framer-motion";

// Optional SEO metadata

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
      <Navbar />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
       {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background gradient effects */}
          <div className="absolute top-0 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute top-40 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl lg:max-w-none lg:w-1/2 space-y-6">
                <motion.div 
                  className="inline-flex items-center px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-sm font-medium text-accent"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <span className="w-2 h-2 rounded-full bg-accent mr-2"></span>
                  Next-gen SEO analysis powered by AI
                </motion.div>
                
                <motion.h1 
                  className="text-4xl md:text-6xl font-extrabold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Supercharge Your Website's <span className="gradient-text">SEO Performance</span>
                </motion.h1>
                
                <motion.p 
                  className="text-lg text-gray-600 md:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  SiteIQ analyzes your website, generates comprehensive SEO reports, and provides AI-powered recommendations to boost your online visibility.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <motion.button
                    className="gradient-bg text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition-all"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Try It Free
                  </motion.button>
                  
                  <motion.button
                    className="border border-gray-300 px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Watch Demo
                  </motion.button>
                </motion.div>
              </div>
              
              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <HeroAnimation />
              </motion.div>
            </div>
            
            <motion.div 
              className="pt-16 flex flex-wrap justify-center gap-8 opacity-70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <div className="text-lg font-bold text-gray-400">TechCrunch</div>
              <div className="text-lg font-bold text-gray-400">Forbes</div>
              <div className="text-lg font-bold text-gray-400">Wired</div>
              <div className="text-lg font-bold text-gray-400">ProductHunt</div>
            </motion.div>
          </div>
        </section>

        {/* All-in-one Solution Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl" />
          <div className="absolute bottom-40 left-20 w-72 h-72 bg-secondary/5 rounded-full filter blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                All-in-One <span className="gradient-text">SEO Solution</span>
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Everything you need to optimize your website and boost your search engine rankings
              </motion.p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatedFeature 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>}
                title="Comprehensive SEO Analysis"
                description="Get detailed insights into your website's search engine optimization status with actionable recommendations."
                delay={0.1}
              />
              
              <AnimatedFeature 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>}
                title="Performance Optimization"
                description="Improve your website's loading speed and overall performance with our AI-powered suggestions."
                delay={0.2}
              />
              
              <AnimatedFeature 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>}
                title="Keyword Analysis"
                description="Discover the most effective keywords for your business and learn how to implement them strategically."
                delay={0.3}
              />
              
              <AnimatedFeature 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>}
                title="Content Suggestions"
                description="Get AI-powered content recommendations to improve your website's relevance and engagement."
                delay={0.4}
              />
              
              <AnimatedFeature 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path>
                </svg>}
                title="Tech Stack Recommendations"
                description="Receive customized technology recommendations based on your business needs and website goals."
                delay={0.5}
              />
              
              <AnimatedFeature 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>}
                title="AI-Powered Chatbot"
                description="Get instant answers and recommendations for your website through our intelligent SEO assistant."
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* Features Section (Existing component) */}
        <Features />
        
        {/* Demo Section */}
        <DemoSection />
        
        {/* Pricing Section */}
        <PricingPlans />
        
        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          
          <div className="container px-4 mx-auto relative z-10">
            <motion.div 
              className="text-center mb-16 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Find answers to common questions about SiteIQ and how it can help improve your SEO
              </p>
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <FaqAccordion />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CtaSection />
        
        {/* Footer */}
        <Footer />
      </motion.div>
    </div>
  );
}
