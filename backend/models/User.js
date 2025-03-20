const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        // Clerk Authentication
        clerkUserId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
            match: /^[a-zA-Z0-9_]+$/, // Only allow letters, numbers, and underscores
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validate email format
        },
        phoneNumber: {
            type: String,
            match: /^[0-9]{10,15}$/, // Allow only digits (10-15 length)
        },
        image: {
            type: String, // Profile Image URL
            default: "https://default-avatar.com/avatar.png",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        membership: {
            type: String,
            enum: ["premium", "freemium"],
            default: "freemium",
        },
        stripe: {
            customerId: { type: String, default: null },
            subscriptionId: { type: String, default: null },
            isActive: { type: Boolean, default: false },
            plan: { type: String, enum: ["basic", "pro", "enterprise"], default: "basic" },
        },
        loginCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Websites & Chat History
        websites: [
            {
                url: {
                    type: String,
                    required: true,
                    match: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}\/?.*$/, // Validate URL format
                },
                seoReport: { type: Object, default: {} },
                aiRecommendations: { type: Object, default: {} },
                html: { type: String },
                css: { type: String },
                chatHistory: [
                    {
                        userMessage: { type: String, required: true, maxlength: 500 },
                        botResponse: { type: String, required: true, maxlength: 1000 },
                        timestamp: { type: Date, default: Date.now },
                    },
                ],
                chatCount: {
                    type: Number,
                    default: 0,
                    min: 0,
                    max: 15, // Limit to 15 messages per website
                },
                createdAt: { type: Date, default: Date.now },
            },
        ],

        // Weekly Website Limit
        weeklyWebsiteLimit: { type: Number, default: 3 },
        lastResetDate: { type: Date, default: Date.now },

        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

/////////////////////////////
// 💡 Model Methods & Validations
/////////////////////////////

// Automatically reset the weekly limit for freemium users
UserSchema.methods.resetWebsiteLimit = async function () {
    const now = new Date();
    const lastReset = new Date(this.lastResetDate);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (lastReset < oneWeekAgo) {
        this.websites = [];
        this.lastResetDate = now;
        await this.save();
    }
};

// Check if user can add a new website (Freemium: Max 3 per week)
UserSchema.methods.canAddWebsite = async function () {
    await this.resetWebsiteLimit();
    return this.membership === "premium" || this.websites.length < this.weeklyWebsiteLimit;
};

// Add a new website (with validation)
UserSchema.methods.addWebsite = async function (url, seoReport, html, css) {
    if (!(await this.canAddWebsite())) {
        throw new Error("Freemium users can only analyze 3 websites per week.");
    }

    this.websites.push({
        url,
        seoReport,
        html,
        css,
        chatCount: 0,
    });

    await this.save();
    return this;
};

// Check if user can send a new message (Max 15 messages per website)
UserSchema.methods.canSendMessage = function (websiteUrl) {
    const website = this.websites.find((site) => site.url === websiteUrl);
    if (!website) throw new Error("Website not found.");
    return website.chatCount < 15;
};

// Save chat history (with message limit)
UserSchema.methods.saveChatMessage = async function (websiteUrl, userMessage, botResponse) {
    const website = this.websites.find((site) => site.url === websiteUrl);
    if (!website) throw new Error("Website not found.");

    if (website.chatCount >= 15) {
        throw new Error("Chat limit reached for this website.");
    }

    website.chatHistory.push({ userMessage, botResponse });
    website.chatCount += 1;

    await this.save();
    return this;
};

module.exports = mongoose.model("User", UserSchema);
