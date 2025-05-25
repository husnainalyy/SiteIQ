import { useState } from 'react';
import { RecommendationResult } from '../types';

export const useNavigation = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [cameFromAnalysis, setCameFromAnalysis] = useState(false);
  const [previousState, setPreviousState] = useState<{
    type: 'analysis' | 'chat';
    recommendation?: RecommendationResult | null;
    chatId?: string | null;
    chatMessages?: Array<{ role: string; content: string }>;
  } | null>(null);

  const handleBack = (showChat: boolean, recommendation: RecommendationResult | null) => {
    if (showChat) {
      setShowSidebar(false);
      setCameFromAnalysis(false);
    } else if (recommendation) {
      setShowSidebar(true);
      setCameFromAnalysis(false);
    }
  };

  const handleForward = () => {
    if (!previousState) return null;

    if (previousState.type === 'chat' && previousState.chatId) {
      return {
        showChat: true,
        selectedChatId: previousState.chatId,
        chatMessages: previousState.chatMessages
      };
    } else if (previousState.type === 'analysis' && previousState.recommendation) {
      return {
        recommendation: previousState.recommendation,
        showMetaInfo: true
      };
    }
    return null;
  };

  const handleNewAnalysis = (showChat: boolean, selectedChatId: string | null, chatMessages: Array<{ role: string; content: string }>, recommendation: RecommendationResult | null) => {
    if (showChat) {
      setPreviousState({
        type: 'chat',
        chatId: selectedChatId,
        chatMessages: chatMessages
      });
    } else if (recommendation) {
      setPreviousState({
        type: 'analysis',
        recommendation: recommendation
      });
    }
    setShowSidebar(false);
    setCameFromAnalysis(true);
  };

  return {
    showSidebar,
    cameFromAnalysis,
    previousState,
    setShowSidebar,
    setCameFromAnalysis,
    setPreviousState,
    handleBack,
    handleForward,
    handleNewAnalysis
  };
}; 