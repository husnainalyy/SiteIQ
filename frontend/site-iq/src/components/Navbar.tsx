'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center transform transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold">
              Site<span className="text-accent">IQ</span>
            </h1>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li className="relative group">
                <Link
                  href="/features"
                  className="font-medium hover:text-accent transition-colors"
                >
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li className="relative group">
                <Link
                  href="/analyze"
                  className="font-medium hover:text-accent transition-colors"
                >
                  Analyze
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li className="relative group">
                <Link
                  href="/pricing"
                  className="font-medium hover:text-accent transition-colors"
                >
                  Pricing
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="hidden sm:flex hover:border-accent hover:text-accent transition-all"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button className="gradient-bg relative overflow-hidden group" asChild>
              <Link href="/signup">
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              </Link>
            </Button>
            
            <button 
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 shadow-lg">
            <nav className="flex flex-col space-y-4 py-3">
              <Link 
                href="/features" 
                className="font-medium hover:text-accent transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/analyze" 
                className="font-medium hover:text-accent transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Analyze
              </Link>
              <Link 
                href="/pricing" 
                className="font-medium hover:text-accent transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/login" 
                className="font-medium hover:text-accent transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
