'use client';
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { improveTechStack, sendChatMessage, getChatHistory, deleteChat, getChatMessages } from "@/lib/api";
import { MetaInfo } from "./components/MetaInfo";
import { TechStackItem } from "./components/TechStackItem";
import { ChatHistory } from "./components/ChatHistory";
import { ChatInterface } from "./components/ChatInterface";
import { AnalysisForm } from "./components/AnalysisForm";
import { FormData, RecommendationResult, ChatHistory as ChatHistoryType } from "./types";

export default function Improve() {
  const [formData, setFormData] = useState<FormData>({
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
  const [chatHistory, setChatHistory] = useState<ChatHistoryType[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showMetaInfo, setShowMetaInfo] = useState(false);

  // Debounced input handler
  const debouncedInputChange = useCallback((value: string) => {
    setChatInput(value);
  }, []);

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
      const response = await improveTechStack({
        websiteUrl: formData.websiteUrl,
        useCase: formData.useCase,
        seoFocused: formData.seoFocused,
        performanceFocused: formData.performanceFocused
      });
      
      if (response && response.recommendation) {
        const recommendation = {
          ...response.recommendation,
          meta: {
            title: response.websiteTitle || response.recommendation.meta?.title || response.recommendation.meta?.metaTags?.['og:title'] || '',
            description: response.websiteDescription || response.recommendation.meta?.description || response.recommendation.meta?.metaTags?.['og:description'] || '',
            scripts: response.scripts || response.recommendation.meta?.scripts || [],
          }
        };
        
        setRecommendation(recommendation);
        setConversationId(response.conversationId);
        setShowChat(false);
        setChatMessages([]);
        setShowMetaInfo(true);
        
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
      const response = await getChatHistory();
      if (response && response.chats && Array.isArray(response.chats)) {
        const formattedChats = response.chats.map(chat => ({
          ...chat,
          id: chat.id || chat._id,
          timestamp: chat.timestamp || chat.lastUpdated || chat.createdAt || new Date().toISOString()
        }));
        setChatHistory(formattedChats);
      } else {
        setChatHistory([]);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
      setError("Failed to load chat history");
      setChatHistory([]);
    }
  };

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    if (conversationId) {
      loadChatHistory();
    }
  }, [conversationId]);

  const handleChatSelect = async (chatId: string) => {
    try {
      setShowChat(true);
      setChatLoading(true);
      setSelectedChatId(chatId);
      setConversationId(chatId);
      
      const response = await getChatMessages(chatId);
      
      if (!response || !response.chat) {
        setChatMessages([]);
        setError("Failed to load chat messages: Invalid response format");
        return;
      }

      const messages = response.chat.history || [];
      const formattedMessages = messages.map(msg => ({
        role: msg.role || (msg.isUser ? 'user' : 'assistant'),
        content: msg.content || msg.message || ''
      }));
      
      setChatMessages(formattedMessages);
      setShowChat(true);
    } catch (err) {
      console.error("Error loading chat messages:", err);
      setError(err instanceof Error ? err.message : "Failed to load chat messages");
      setChatMessages([]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChatHistory(prev => prev.filter(chat => chat._id !== chatId));
      if (selectedChatId === chatId) {
        setChatMessages([]);
        setSelectedChatId(null);
        setConversationId(null);
      }
      await loadChatHistory();
    } catch (err) {
      console.error("Error deleting chat:", err);
      setError("Failed to delete chat");
    }
  };

  const handleStartChat = () => {
    if (!conversationId || !recommendation) return;

    setShowChat(true);
    setSelectedChatId(null);
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

    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await sendChatMessage({
        message: userMessage,
        conversationId
      });

      setChatMessages(prev => [...prev, { role: "assistant", content: response.reply }]);
      await loadChatHistory();
    } catch (err) {
      console.error("Chat error:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 relative min-h-screen">
      <div className="flex">
        <ChatHistory
          showSidebar={showSidebar}
          chatHistory={chatHistory}
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
          onDeleteChat={handleDeleteChat}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
        />
        
        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'ml-[320px]' : 'ml-0'}`}>
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
                  <ChatInterface
                    chatMessages={chatMessages}
                    chatInput={chatInput}
                    chatLoading={chatLoading}
                    selectedChatId={selectedChatId}
                    chatHistory={chatHistory}
                    onChatInputChange={debouncedInputChange}
                    onChatSubmit={handleChatSubmit}
                    onBack={() => {
                      setShowChat(false);
                      setChatMessages([]);
                      setSelectedChatId(null);
                      setConversationId(null);
                    }}
                    onNewAnalysis={() => setRecommendation(null)}
                  />
                </motion.div>
              ) : !recommendation ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnalysisForm
                    formData={formData}
                    loading={loading}
                    error={error}
                    onInputChange={handleInputChange}
                    onCheckboxChange={handleCheckboxChange}
                    onSubmit={handleSubmit}
                  />
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
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tech Stack Analysis</h2>
                      <Button 
                        variant="outline"
                        onClick={() => setRecommendation(null)}
                      >
                        New Analysis
                      </Button>
                    </div>

                    {showMetaInfo && <MetaInfo meta={recommendation.meta} />}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <TechStackItem tech={recommendation.frontend} title="Frontend" index={0} />
                      <TechStackItem tech={recommendation.backend} title="Backend" index={1} />
                      <TechStackItem tech={recommendation.database} title="Database" index={2} />
                      <TechStackItem tech={recommendation.hosting} title="Hosting" index={3} />
                      <TechStackItem tech={recommendation.other} title="Other" index={4} />
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}