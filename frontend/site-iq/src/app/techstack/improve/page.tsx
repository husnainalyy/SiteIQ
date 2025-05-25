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
  _id?: string;
  title: string;
  lastMessage: string;
  timestamp?: string;
  lastUpdated?: string;
  createdAt?: string;
  history?: Array<{
    role?: string;
    content?: string;
    message?: string;
    isUser?: boolean;
  }>;
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
      
      console.log("Raw API Response:", response);
      
      if (response && response.recommendation) {
        console.log("Raw recommendation:", response.recommendation);
        
        // Ensure all tech stack sections are present
        const recommendation = {
          ...response.recommendation,
          meta: {
            title: response.websiteTitle || response.recommendation.meta?.title || response.recommendation.meta?.metaTags?.['og:title'] || '',
            description: response.websiteDescription || response.recommendation.meta?.description || response.recommendation.meta?.metaTags?.['og:description'] || '',
           // keywords: response.recommendation.meta?.keywords || [],
            scripts: response.scripts || response.recommendation.meta?.scripts || [],
           // metaTags: response.recommendation.meta?.metaTags || {}
          }
        };
        
        console.log("Processed recommendation:", recommendation);
        
        setRecommendation(recommendation);
        setConversationId(response.conversationId);
        setShowChat(false);
        setChatMessages([]);
        setShowMetaInfo(true);
        
        // Refresh chat history after creating new chat
        await loadChatHistory();
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error getting recommendation:", err);
      setError("Failed to get recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadChatHistory = async () => {
    try {
      console.log("Loading chat history...");
      const response = await getChatHistory();
      if (response && response.chats && Array.isArray(response.chats)) {
        // Format the timestamps and normalize IDs
        const formattedChats = response.chats.map(chat => ({
          ...chat,
          id: chat.id || chat._id,
          timestamp: chat.timestamp || chat.lastUpdated || chat.createdAt || new Date().toISOString()
        }));
        console.log("Formatted chats:", formattedChats);
        setChatHistory(formattedChats);
      } else {
        console.warn("Invalid chat history response:", response);
        setChatHistory([]);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
      setError("Failed to load chat history");
      setChatHistory([]);
    }
  };

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []); // Empty dependency array for initial load

  // Update chat history when conversation changes
  useEffect(() => {
    if (conversationId) {
      loadChatHistory();
    }
  }, [conversationId]);

  // Handle chat selection from history
  const handleChatSelect = async (chatId: string) => {
    try {
      console.log("Starting chat selection for ID:", chatId);
      
      // First set all necessary states to show chat interface
      setShowChat(true);
      setChatLoading(true);
      setSelectedChatId(chatId);
      setConversationId(chatId);
      
      // Fetch chat messages from API
      const response = await getChatMessages(chatId);
      console.log("Chat response received:", response);
      
      if (!response || !response.chat) {
        console.warn("Invalid chat response received:", response);
        setChatMessages([]);
        setError("Failed to load chat messages: Invalid response format");
        return;
      }

      // Extract and format messages from the response
      const messages = response.chat.history || [];
      console.log("Extracted messages:", messages);
      
      // Format messages to ensure consistent structure
      const formattedMessages = messages.map(msg => ({
        role: msg.role || (msg.isUser ? 'user' : 'assistant'),
        content: msg.content || msg.message || ''
      }));
      
      console.log("Formatted messages:", formattedMessages);
      
      // Update chat messages and ensure chat interface is shown
      setChatMessages(formattedMessages);
      setShowChat(true); // Force show chat interface
      
      // Force a re-render after a short delay to ensure state updates are processed
      // setTimeout(() => {
      //   setShowChat(true);
      //   setChatLoading(false);
      // }, 100);
    } catch (err) {
      console.error("Error loading chat messages:", err);
      setError(err instanceof Error ? err.message : "Failed to load chat messages");
      setChatMessages([]);
    } finally {
      setChatLoading(false); // Set loading to false after everything is done
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChatHistory(prev => prev.filter(chat => chatId));
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
      await loadChatHistory();
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
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + (index * 0.1) }}
        whileHover={{ y: -5 }}
      >
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center mr-4 shadow-md">
            <span className="text-white font-semibold text-lg">{title[0]}</span>
          </div>
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h4>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">{tech.reason}</p>
        
        {tech.stack && tech.stack.length > 0 && (
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">Recommended Technologies</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tech.stack.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                  >
                    <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // Render chat history sidebar
  const renderChatHistory = () => (
    <AnimatePresence mode="wait">
      {showSidebar && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-0 top-16 h-[calc(100vh-4rem)] w-[320px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto flex flex-col shadow-xl z-50"
        >
          {/* Chat history header */}
          <div className="flex-none p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Chat History</h3>
          </div>
          
          {/* Chat history list */}
          <div className="flex-1 p-3 space-y-2">
            {!Array.isArray(chatHistory) || chatHistory.length === 0 ? (
              <div key="no-chats" className="text-center text-slate-500 dark:text-slate-400 py-8">
                No previous chats
              </div>
            ) : (
              chatHistory.map((chat) => {
                if (!chat || ( !chat._id)) {
                  console.warn("Attempting to render chat with invalid ID:", chat);
                  return null;
                }
                
                const chatId = chat._id;
                const timestamp = chat.timestamp || chat.lastUpdated || chat.createdAt;
                const formattedDate = timestamp ? new Date(timestamp).toLocaleString() : 'No date';
                
                // Extract website name from title or use default
                const fullTitle = chat.title || 'Untitled Chat';
                const websiteName = fullTitle.split(' - ')[0] || fullTitle;
                
                return (
                  <div 
                    key={`chat-${chatId}`}
                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    onClick={() => {
                      console.log("Chat clicked:", chatId);
                      handleChatSelect(chatId);
                    }}
                  >
                    {/* Chat icon and title */}
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </div>
                      <div className="truncate">
                        {/* Title with tooltip */}
                        <div className="relative group/title">
                          <span className="text-sm font-medium block truncate text-slate-900 dark:text-slate-100" title={fullTitle}>
                            {websiteName}
                          </span>
                          <div className="absolute left-0 bottom-full mb-2 px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover/title:opacity-100 group-hover/title:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                            {fullTitle}
                            <div className="absolute left-4 bottom-0 w-2 h-2 bg-slate-900 transform rotate-45 translate-y-1/2"></div>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                    
                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chatId, e);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 flex-shrink-0 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render chat interface
  const renderChatInterface = () => (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Back button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setShowChat(false);
                setChatMessages([]);
                setSelectedChatId(null);
                setConversationId(null);
              }}
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
          {/* Chat messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages && chatMessages.length > 0 ? (
              chatMessages.map((msg, i) => (
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
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No messages yet. Start the conversation!
              </div>
            )}
            {/* Loading indicator */}
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
          
          {/* Chat input area */}
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
    console.log("Rendering meta info with data:", meta);
    
    if (!meta) {
      console.warn("No meta data provided to renderMetaInfo");
      return (
        <Card className="bg-white dark:bg-gray-800 shadow-lg mb-6 rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 dark:text-white">
              Website Meta Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-500 dark:text-gray-400">
              No metadata available for this website.
            </div>
          </CardContent>
        </Card>
      );
    }

    // Check if we have any data to display
    const hasData = meta.title || meta.description || 
                   (meta.keywords && meta.keywords.length > 0) || 
                   (meta.scripts && meta.scripts.length > 0) || 
                   (meta.metaTags && Object.keys(meta.metaTags).length > 0);

    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg mb-6 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 dark:text-white">
            Website Meta Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <div className="text-gray-500 dark:text-gray-400">
              No metadata available for this website.
            </div>
          ) : (
            <div className="space-y-6">
              {meta.title && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Title</h3>
                  <p className="text-slate-700 dark:text-slate-300 break-words">{meta.title}</p>
                </div>
              )}
              {meta.description && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Description</h3>
                  <p className="text-slate-700 dark:text-slate-300 break-words">{meta.description}</p>
                </div>
              )}
              {meta.keywords && meta.keywords.length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {meta.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {meta.scripts && meta.scripts.length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">Scripts</h3>
                  <div className="space-y-2">
                    {meta.scripts.map((script, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white dark:bg-slate-800 rounded-lg text-sm font-mono overflow-x-auto border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
                      >
                        {script}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {meta.metaTags && Object.keys(meta.metaTags).length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">Meta Tags</h3>
                  <div className="space-y-2">
                    {Object.entries(meta.metaTags).map(([key, value]) => (
                      <div
                        key={key}
                        className="p-3 bg-white dark:bg-slate-800 rounded-lg text-sm border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
                      >
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{key}:</span>
                        <span className="text-slate-700 dark:text-slate-300 ml-2">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 relative min-h-screen">
      <div className="flex">
        {renderChatHistory()}
        
        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'ml-[320px]' : 'ml-0'}`}>
          {/* Toggle sidebar button */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-slate-800 z-50 p-2 rounded-r-md shadow-md border border-l-0 border-slate-200 dark:border-slate-700"
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
              {showChat ? (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderChatInterface()}
                </motion.div>
              ) : !recommendation ? (
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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}