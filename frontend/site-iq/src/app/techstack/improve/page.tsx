'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader, Check, X, ChevronLeft, ChevronRight, Trash2, MessageSquare } from "lucide-react";
import { improveTechStack, sendChatMessage, getChatHistory, deleteChat, getChatMessages } from "@/lib/api";

interface TechStack {
  stack: string[];
  reason: string;
}

interface WebsiteMeta {
  title: string;
  description: string;
  keywords: string[];
  scripts: string[];
  metaTags: { [key: string]: string };
}

interface RecommendationResult {
  frontend: TechStack;
  backend: TechStack;
  database: TechStack;
  hosting: TechStack;
  other: TechStack;
  meta: WebsiteMeta;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

export default function Improve() {
  const [formData, setFormData] = useState({
    websiteUrl: "",
    useCase: "",
    seoFocused: false,
    performanceFocused: false,
  });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showMetaInfo, setShowMetaInfo] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.websiteUrl || !formData.useCase) {
      setError("Please provide both website URL and use case");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Form data before sending:", formData);
      
      const response = await improveTechStack({
        websiteUrl: formData.websiteUrl,
        useCase: formData.useCase,
        seoFocused: formData.seoFocused,
        performanceFocused: formData.performanceFocused
      });
      
      console.log("API Response:", response);
      
      setRecommendation(response.recommendation);
      setConversationId(response.conversationId);
      setShowChat(false);
      setChatMessages([]);
    } catch (err) {
      console.error("Error getting recommendation:", err);
      setError("Failed to get recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Load chat history immediately when component mounts
  useEffect(() => {
    const initializeChatHistory = async () => {
      try {
        console.log("Initializing chat history...");
        const history = await getChatHistory();
        console.log("Chat history loaded:", history);
        if (Array.isArray(history)) {
          setChatHistory(history);
        } else {
          console.log("No chat history found or invalid format");
          setChatHistory([]);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
        setChatHistory([]);
      }
    };

    initializeChatHistory();
  }, []); // Empty dependency array means this runs once on mount

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      if (Array.isArray(history)) {
        setChatHistory(history);
      } else {
        setChatHistory([]);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
      setError("Failed to load chat history");
      setChatHistory([]);
    }
  };

  const handleChatSelect = async (chatId: string) => {
    try {
      setShowChat(true);
      const messages = await getChatMessages(chatId);
      setChatMessages(messages);
      setSelectedChatId(chatId);
      setConversationId(chatId);
    } catch (err) {
      console.error("Error loading chat messages:", err);
      setError("Failed to load chat messages");
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
      if (selectedChatId === chatId) {
        setChatMessages([]);
        setSelectedChatId(null);
        setConversationId(null);
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
      setError("Failed to delete chat");
    }
  };

  const handleStartChat = () => {
    if (!conversationId || !recommendation) return;

    setShowChat(true);
    setSelectedChatId(null);
    // Initialize chat with a welcome message
    const initialMessages = [
      { 
        role: "assistant", 
        content: "I've analyzed your website and here are my recommendations. Feel free to ask me any questions about them!" 
      }
    ];
    
    setChatMessages(initialMessages);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !conversationId) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatLoading(true);

    // Add user message immediately
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await sendChatMessage({
        message: userMessage,
        conversationId
      });

      // Add AI response
      setChatMessages(prev => [...prev, { role: "assistant", content: response.reply }]);
      
      // Refresh chat history to update last message
      loadChatHistory();
    } catch (err) {
      console.error("Chat error:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setChatLoading(false);
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

  const renderChatHistory = () => (
    <AnimatePresence mode="wait">
      {showSidebar && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-24 bottom-24 left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h3 className="font-medium text-lg">Chat History</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {!Array.isArray(chatHistory) || chatHistory.length === 0 ? (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  No previous chats
                </div>
              ) : (
                <div className="space-y-2">
                  {chatHistory.map(chat => (
                    <div 
                      key={chat.id} 
                      className="group flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      onClick={() => handleChatSelect(chat.id)}
                    >
                      <div className="flex items-center min-w-0">
                        <MessageSquare className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                        <div className="truncate">
                          <span className="text-sm font-medium block truncate">{chat.title}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                            {new Date(chat.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderChatInterface = () => (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowChat(false)}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle>AI Assistant - Ask About Your Analysis</CardTitle>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setRecommendation(null)}
          >
            New Analysis
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, i) => (
              <motion.div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-white'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <form onSubmit={handleChatSubmit} className="flex space-x-2">
              <Input
                placeholder="Ask a question about your tech stack analysis..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit"
                disabled={chatLoading || !chatInput.trim()} 
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {chatLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  'Send'
                )}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderMetaInfo = (meta: WebsiteMeta) => {
    if (!meta) return null;
    
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 dark:text-white">
            Website Meta Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meta.title && (
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Title</h3>
                <p className="text-gray-600 dark:text-gray-400 break-words">{meta.title}</p>
              </div>
            )}
            {meta.description && (
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 break-words">{meta.description}</p>
              </div>
            )}
            {meta.keywords && meta.keywords.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {meta.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {meta.scripts && meta.scripts.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Scripts</h3>
                <div className="space-y-2">
                  {meta.scripts.map((script, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-sm font-mono overflow-x-auto"
                    >
                      {script}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {meta.metaTags && Object.keys(meta.metaTags).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Meta Tags</h3>
                <div className="space-y-2">
                  {Object.entries(meta.metaTags).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-sm"
                    >
                      <span className="font-semibold">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 relative min-h-screen">
      <div className="flex">
        {renderChatHistory()}
        
        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'ml-[280px]' : 'ml-0'}`}>
          {/* Toggle sidebar button */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-slate-800 z-30 p-2 rounded-r-md shadow-md border border-l-0 border-slate-200 dark:border-slate-700"
          >
            {showSidebar ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          <motion.div 
            className="max-w-5xl mx-auto pb-24"
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
                Improve Your Tech Stack
              </motion.h1>
              <motion.p 
                className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Get personalized recommendations to optimize your website's technology stack and improve performance.
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
                      <CardTitle>Enter Your Website Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="websiteUrl">Website URL</Label>
                          <Input
                            id="websiteUrl"
                            name="websiteUrl"
                            placeholder="https://example.com"
                            value={formData.websiteUrl}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="useCase">Describe Your Website/Business</Label>
                          <Input
                            id="useCase"
                            name="useCase"
                            placeholder="e.g., E-commerce site selling handmade crafts, focusing on international customers"
                            value={formData.useCase}
                            onChange={handleInputChange}
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
                  {showChat ? renderChatInterface() : (
                    <Card>
                      <CardHeader className="pb-0">
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-between items-center"
                        >
                          <CardTitle className="text-2xl">Tech Stack Analysis</CardTitle>
                          <Button 
                            variant="outline"
                            onClick={() => setRecommendation(null)}
                          >
                            New Analysis
                          </Button>
                        </motion.div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {showMetaInfo && renderMetaInfo(recommendation.meta)}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {renderTechItem(recommendation.frontend, "Frontend", 0)}
                          {renderTechItem(recommendation.backend, "Backend", 1)}
                          {renderTechItem(recommendation.database, "Database", 2)}
                          {renderTechItem(recommendation.hosting, "Hosting", 3)}
                          {renderTechItem(recommendation.other, "Other", 4)}
                        </div>

                        <motion.div
                          className="mt-8 flex justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          <Button 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            size="lg"
                            onClick={handleStartChat}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Ask Questions About This Analysis
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
