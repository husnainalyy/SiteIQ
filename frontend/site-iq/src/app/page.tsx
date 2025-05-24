'use client'

import { useState } from 'react'

export default function TestPage() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">CSS Test Suite</h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg button-hover transition-all duration-300"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'} Mode
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Typography & Colors Test */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6">Typography & Color System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-card text-card-foreground rounded-lg border">
              <h3 className="text-xl font-semibold mb-2">Color Palette</h3>
              <div className="space-y-2">
                <p className="text-foreground">Foreground text</p>
                <p className="text-muted-foreground">Muted text</p>
                <p className="text-primary">Primary color</p>
                <p className="text-secondary">Secondary color</p>
                <p className="text-accent">Accent color</p>
                <p className="text-destructive">Destructive color</p>
              </div>
            </div>
            
            <div className="p-6 bg-card text-card-foreground rounded-lg border">
              <h3 className="text-xl font-semibold mb-2 gradient-text">Gradient Text</h3>
              <p className="text-sm text-muted-foreground">This demonstrates the gradient text utility</p>
            </div>

            <div className="p-6 gradient-bg text-white rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Gradient Background</h3>
              <p className="text-sm opacity-90">Background with gradient colors</p>
            </div>
          </div>
        </section>

        {/* Glass & Cards Effects */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6">Glass Effects & Cards</h2>
          <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-8 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card glass-card-dark p-6">
                <h3 className="text-xl font-semibold mb-2">Glass Card</h3>
                <p className="text-sm opacity-90">Glassmorphism effect with backdrop blur</p>
              </div>
              
              <div className="glow-card bg-card/90 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Glow Card</h3>
                <p className="text-sm text-muted-foreground">Card with rotating glow border effect</p>
              </div>
            </div>
          </div>
        </section>

        {/* Animation Tests */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6">Animation Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-card rounded-lg border floating-animation">
              <div className="w-12 h-12 bg-primary rounded-full mx-auto mb-4"></div>
              <h3 className="text-center font-semibold">Floating Animation</h3>
            </div>
            
            <div className="p-6 bg-card rounded-lg border">
              <div className="w-12 h-12 bg-secondary rounded-full mx-auto mb-4 pulse-animation"></div>
              <h3 className="text-center font-semibold">Pulse Animation</h3>
            </div>
            
            <div className="p-6 bg-card rounded-lg border animate-pulse-slow">
              <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-4"></div>
              <h3 className="text-center font-semibold">Pulse Slow</h3>
            </div>
            
            <div className="p-6 bg-card rounded-lg border animate-float">
              <div className="w-12 h-12 bg-destructive rounded-full mx-auto mb-4"></div>
              <h3 className="text-center font-semibold">Float Animation</h3>
            </div>
          </div>
        </section>

        {/* Hover Effects */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6">Hover Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-lg border card-hover">
              <h3 className="text-xl font-semibold mb-2">Card Hover</h3>
              <p className="text-sm text-muted-foreground">Hover to see lift effect</p>
            </div>
            
            <button className="p-6 bg-primary text-primary-foreground rounded-lg button-hover">
              <h3 className="text-xl font-semibold mb-2">Button Hover</h3>
              <p className="text-sm opacity-90">Hover for overlay effect</p>
            </button>
            
            <div className="p-6 bg-card rounded-lg border">
              <h3 className="text-xl font-semibold mb-2 text-underline-hover cursor-pointer">
                Text Underline Hover
              </h3>
              <p className="text-sm text-muted-foreground">Hover the title above</p>
            </div>
          </div>
        </section>

        {/* Special Effects */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6">Special Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-lg border">
              <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 pulse-blue"></div>
              <h3 className="text-center font-semibold">Pulse Blue Effect</h3>
            </div>
            
            <button className="p-6 bg-accent text-accent-foreground rounded-lg btn-glow relative">
              <h3 className="text-xl font-semibold mb-2">Glow Button</h3>
              <p className="text-sm opacity-90">Button with rotating glow</p>
            </button>
          </div>
        </section>

        {/* Background Patterns */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6">Background Patterns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-grid-white/5 bg-gray-900 rounded-lg flex items-center justify-center">
              <p className="text-white font-semibold">Grid Pattern (White)</p>
            </div>
            
            <div className="h-48 bg-grid-black/5 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-900 font-semibold">Grid Pattern (Black)</p>
            </div>
          </div>
        </section>

        {/* Scrollable Content Test */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6">Scrollbar Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Hidden Scrollbar</h3>
              <div className="h-32 overflow-y-auto scrollbar-hide bg-muted/50 p-4 rounded">
                {Array.from({length: 20}, (_, i) => (
                  <p key={i} className="py-1">Line {i + 1} - Hidden scrollbar content</p>
                ))}
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Thin Scrollbar</h3>
              <div className="h-32 overflow-y-auto scrollbar-thin bg-muted/50 p-4 rounded">
                {Array.from({length: 20}, (_, i) => (
                  <p key={i} className="py-1">Line {i + 1} - Thin scrollbar content</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Form Elements Test */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6">Form Elements</h2>
          <div className="bg-card rounded-lg border p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Input with Focus Ring</label>
              <input 
                type="text" 
                placeholder="Focus me to see ring effect"
                className="w-full px-3 py-2 bg-input border border-border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Button Focus Test</label>
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
                Focus me with Tab key
              </button>
            </div>
          </div>
        </section>

        {/* Fade Animations */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6">Fade Animations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-lg border animate-fade-in">
              <h3 className="font-semibold">Fade In</h3>
              <p className="text-sm text-muted-foreground">Animates on page load</p>
            </div>
            
            <div className="p-6 bg-card rounded-lg border animate-scale-in">
              <h3 className="font-semibold">Scale In</h3>
              <p className="text-sm text-muted-foreground">Scales from 95% to 100%</p>
            </div>
            
            <div className="p-6 bg-card rounded-lg border animate-accordion-down">
              <h3 className="font-semibold">Accordion Down</h3>
              <p className="text-sm text-muted-foreground">Height animation</p>
            </div>
          </div>
        </section>

        {/* Font Test */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6">Font Family Test</h2>
          <div className="bg-card rounded-lg border p-6">
            <p className="font-inter text-lg mb-2">Inter Font Family (default)</p>
            <p className="font-sans text-lg mb-2">Sans Font Family</p>
            <p className="text-sm text-muted-foreground">
              Both should render with Inter font from Google Fonts
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-muted/50 mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            CSS Test Suite Complete ✅ | All styles and animations should be working properly
          </p>
        </div>
      </footer>
    </div>
  )
}