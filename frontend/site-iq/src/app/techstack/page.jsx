"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ArrowRight, Code2, Globe, Rocket, Server, Zap, Database } from "lucide-react"

export default function TechStackPage() {
  return (
    <div className="container mx-auto py-14 px-4 max-w-6xl scroll-smooth font-sans bg-gradient-to-br from-purple-50 via-purple-100 to-white min-h-screen">
      <div className="space-y-24">

        {/* Heading */}
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="inline-block p-3 bg-purple-100 rounded-xl shadow-md">
            <Code2 className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
            Tech Stack Analyzer
          </h1>
          <p className="text-purple-700 text-xl max-w-3xl mx-auto select-none">
            Analyze your website's tech stack or get recommendations for your next project
          </p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up">
          {/* Recommend */}
          <Link href="/techstack/recommend" className="cursor-pointer">
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out border border-purple-200 bg-purple-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-200 text-purple-600 shadow-sm">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-purple-700">Recommend Tech Stack</CardTitle>
                </div>
                <CardDescription className="text-purple-600">
                  Get personalized tech stack recommendations for your new project.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-purple-700 select-none">
                  Tell us about your project requirements, and we'll suggest the best technologies.
                </p>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-400 hover:brightness-110 shadow-md text-white">
                  Get Recommendations <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Improve */}
          <Link href="/techstack/improve" className="cursor-pointer">
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out border border-purple-200 bg-purple-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-200 text-purple-600 shadow-sm">
                    <Zap className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-purple-700">Improve Tech Stack</CardTitle>
                </div>
                <CardDescription className="text-purple-600">
                  Analyze your existing website and get improvement suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-purple-700 select-none">
                  Submit your website URL and get AI-generated suggestions to enhance your tech stack.
                </p>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-400 hover:brightness-110 shadow-md text-white">
                  Analyze Website <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* How it Works */}
        <div className="mt-20 bg-purple-50 p-12 rounded-3xl shadow-lg border border-purple-200 animate-fade-in-up text-purple-900">
          <div className="border-2 border-purple-400 rounded-xl p-4 mb-14 bg-purple-50 shadow">
            <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-700 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-5 group border border-purple-400 rounded-xl p-6 bg-purple-100 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default">
              <div className="bg-purple-600 p-5 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-purple-700">Step 1: Submit</h3>
              <p className="text-purple-600 max-w-sm select-none">Tell us about your business or share your website URL to begin analysis.</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-5 group border border-purple-400 rounded-xl p-6 bg-purple-100 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default">
              <div className="bg-purple-600 p-5 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Server className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-purple-700">Step 2: AI Analysis</h3>
              <p className="text-purple-600 max-w-sm select-none">Our intelligent engine breaks down your stack or needs and runs a deep scan.</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-5 group border border-purple-400 rounded-xl p-6 bg-purple-100 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default">
              <div className="bg-purple-600 p-5 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-purple-700">Step 3: Get Results</h3>
              <p className="text-purple-600 max-w-sm select-none">Receive AI-powered suggestions instantly and continue chatting for more insights.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center animate-fade-in-up space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-purple-800">Ready to optimize your tech journey?</h2>
          <p className="text-purple-600 text-lg max-w-xl mx-auto select-none">
            Whether you're starting something new or improving an existing project, our AI tools are here to help.
          </p>
          <div className="flex justify-center gap-4 flex-col sm:flex-row">
            <Link href="/techstack/recommend">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 shadow-md">
                Start New Project <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/techstack/improve">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 shadow-md">
                Improve Existing Site <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

      </div>

      {/* Tailwind Animations as global styles inside component for self-containment */}
      <style jsx global>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease forwards;
        }
        .animate-fade-in {
          animation: fade-in-up 1s ease forwards;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s linear infinite alternate;
        }
      `}</style>
    </div>
  )
}
