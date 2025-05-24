// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;


export async function recommendTechStack({ useCase, seoFocused, performanceFocused }) {
  try {
    // Ensure boolean values are properly converted
    const requestData = {
      useCase,
      seoFocused: Boolean(seoFocused),
      performanceFocused: Boolean(performanceFocused)
    };

    console.log('Sending request data:', requestData); // Debug log

    const response = await api.post("/techstack/recommend", requestData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error); // Debug log
    throw new Error(error.response?.data?.message || "Failed to fetch recommendation");
  }
}

export const improveTechStack = async ({ websiteUrl, useCase, seoFocused, performanceFocused }) => {
  try {
    console.log("Sending improve request with data:", {
      websiteUrl,
      useCase,
      seoFocused,
      performanceFocused
    });

    const requestData = {
      websiteUrl,
      useCase,
      seoFocused: Boolean(seoFocused),
      performanceFocused: Boolean(performanceFocused)
    };

    const response = await api.post("/techstack/improve", requestData);
    return response.data;
  } catch (error) {
    console.error("Improve Tech Stack API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const sendChatMessage = async ({ message, conversationId }) => {
  try {
    console.log("Sending chat message:", { message, conversationId });
    const response = await api.post("/chat/chat", {
      message,
      conversationId,
    });
    return response.data;
  } catch (error) {
    console.error("Send Chat Message API Error:", error.response?.data || error.message);
    throw error;
  }
};

export async function getUserChats() {
  try {
    const response = await api.get("/userchat/chats");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch chats");
  }
}

export const getChatHistory = async () => {
  try {
    console.log("Fetching chat history from API...");
    const response = await api.get("/userchat/chats");
    console.log("API Response:", response.data);
    
    if (!response.data) {
      console.log("No data received from API");
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.log("Get Chat History API Error:", error.response || error);
    throw error;
  }
};

export const getChatMessages = async (chatId) => {
  try {
    const response = await api.get(`/userchat/chats/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Get Chat Messages API Error:", error);
    throw error;
  }
};

export const deleteChat = async (chatId) => {
  try {
    const response = await api.delete(`/userchat/chats/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Delete Chat API Error:", error);
    throw error;
  }
};