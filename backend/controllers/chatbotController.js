const User = require("../models/User");
const { chatWithAI } = require("../utils/langchainHelper");

// 💬 Chat with the website AI
const chatWithWebsite = async (req, res) => {
    try {
        const { websiteUrl, userMessage } = req.body;
        const user = req.user;

        // Validate input
        if (!websiteUrl || !userMessage) {
            return res.status(400).json({
                success: false,
                message: "Website URL and user message are required."
            });
        }

        // Check if website exists
        const website = user.websites.find(site => site.url === websiteUrl);
        if (!website) {
            return res.status(404).json({
                success: false,
                message: "Website not found. Please generate an SEO report first."
            });
        }

        // Check chat limit
        if (!user.canSendMessage(websiteUrl)) {
            return res.status(403).json({
                success: false,
                message: "Chat limit reached for this website (15 messages max)."
            });
        }

        // Process chat using LangChain
        const botResponse = await chatWithAI(website, userMessage);

        // Save chat history
        await user.saveChatMessage(websiteUrl, userMessage, botResponse);

        res.status(200).json({
            success: true,
            response: botResponse,
            message: "Chat processed successfully!",
        });
    } catch (error) {
        console.error("Error processing chatbot query:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error processing chatbot query."
        });
    }
};

// 📜 Get chat history for a website
const getChatHistory = async (req, res) => {
    try {
        const { websiteUrl } = req.params;
        const user = req.user;

        // Validate website URL
        if (!websiteUrl) {
            return res.status(400).json({
                success: false,
                message: "Website URL is required."
            });
        }

        // Find website
        const website = user.websites.find(site => site.url === websiteUrl);
        if (!website) {
            return res.status(404).json({
                success: false,
                message: "Website not found."
            });
        }

        // Return chat history
        res.status(200).json({
            success: true,
            chatHistory: website.chatHistory,
        });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error fetching chat history."
        });
    }
};

module.exports = { chatWithWebsite, getChatHistory };