// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;


export async function recommendTechStack({ useCase, seoFocused, performanceFocused }) {
  try {
    const response = await api.post("/techstack/recommend", {
      useCase,
      seoFocused,
      performanceFocused,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch recommendation");
  }
}

export async function improveTechStack({ websiteUrl, seoFocused, performanceFocused }) {
  try {
    const response = await api.post("/techstack/improve", {
      websiteUrl,
      seoFocused,
      performanceFocused,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch improvement analysis");
  }
}



export async function sendChatMessage({ message, conversationId }) {
  try {
    const response = await api.post("/chat/chat", {
      message,
      conversationId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send chat message");
  }
}



export async function getMessagesByConversationId(conversationId) {
  try {
    const response = await api.get(`/chat/${conversationId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch messages");
  }
}



export async function getUserChats() {
  try {
    const response = await api.get("/chat");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch chats");
  }
}


export async function deleteChat(chatId) {
  try {
    const response = await api.delete(`/chat/${chatId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete chat");
  }
}