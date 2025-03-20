const mongoose = require("mongoose");
const { OpenAIEmbeddings } = require("@langchain/community/embeddings/openai");
const WebsiteVector = require("./vectorSchema");

const UserSchema = new mongoose.Schema({
    // Clerk Authentication
    clerkUserId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        match: /^[a-zA-Z0-9_]+$/,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phoneNumber: { type: String, match: /^[0-9]{10,15}$/ },
    image: { type: String, default: "https://default-avatar.com/avatar.png" },
    isVerified: { type: Boolean, default: false },

    // Membership & Stripe Integration
    membership: { type: String, enum: ["premium", "freemium"], default: "freemium" },
    stripe: {
        customerId: { type: String, default: null },
        subscriptionId: { type: String, default: null },
        isActive: { type: Boolean, default: false },
        plan: { type: String, enum: ["basic", "pro", "enterprise"], default: "basic" },
    },
    loginCount: { type: Number, default: 0, min: 0 },

    // Websites & Chat History
    websites: [
        {
            url: {
                type: String,
                required: true,
                match: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}\/?.*$/,
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
            chatCount: { type: Number, default: 0, min: 0, max: 15 },
            createdAt: { type: Date, default: Date.now },
        },
    ],

    // Weekly Website Limit
    weeklyWebsiteLimit: { type: Number, default: 3 },
    lastResetDate: { type: Date, default: Date.now },

    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

/////////////////////////////
// 💡 Model Methods
/////////////////////////////

// 🔄 Reset Weekly Website Limit
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

// 🔄 Check if User Can Add a Website
UserSchema.methods.canAddWebsite = async function () {
    await this.resetWebsiteLimit();
    return this.membership === "premium" || this.websites.length < this.weeklyWebsiteLimit;
};

// 🔄 Add Website and Generate Vector
UserSchema.methods.addWebsiteAndGenerateVector = async function (url, seoReport, aiRecommendations, html, css) {
    if (!(await this.canAddWebsite())) {
        throw new Error("Freemium users can only analyze 3 websites per week.");
    }

    // Add website to user's data
    this.websites.push({ url, seoReport, aiRecommendations, html, css, chatCount: 0 });
    await this.save();

    // Generate and store vector
    const website = this.websites.find(site => site.url === url);
    if (website) {
        await this.generateWebsiteVector(website);
    }

    return this;
};

// 🔄 Generate Website Vector
UserSchema.methods.generateWebsiteVector = async function (website) {
    try {
        const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
        const textData = this.createWebsiteTextData(website);

        // Generate vector embedding
        const vector = await embeddings.embedQuery(textData);

        // Store in `website_vectors` collection
        await WebsiteVector.findOneAndUpdate(
            { websiteUrl: website.url },
            {
                embeddings: vector,
                textData: textData // Store raw text for debugging
            },
            { upsert: true, new: true }
        );

        console.log(`✅ Vectorized data stored for ${website.url}`);
    } catch (error) {
        console.error("❌ Error generating website vector:", error);
        throw new Error("Failed to generate website vector");
    }
};

// 📝 Create Website Text Data for Embeddings
UserSchema.methods.createWebsiteTextData = function (website) {
    return `
        URL: ${website.url}
        SEO: ${JSON.stringify(website.seoReport)}
        Recommendations: ${JSON.stringify(website.aiRecommendations)}
        HTML: ${website.html?.substring(0, 5000)} // Limit size
        CSS: ${website.css?.substring(0, 5000)}
    `;
};

// 🔄 Update Website Data
UserSchema.methods.updateWebsiteData = async function (websiteUrl, updateData) {
    const website = this.websites.find(site => site.url === websiteUrl);
    if (!website) throw new Error("Website not found");

    // Update fields
    Object.keys(updateData).forEach(key => {
        if (key in website) website[key] = updateData[key];
    });

    // Regenerate vector
    await this.generateWebsiteVector(website);
    await this.save();
    return this;
};

// 🔄 Check if User Can Send a Message
UserSchema.methods.canSendMessage = function (websiteUrl) {
    const website = this.websites.find((site) => site.url === websiteUrl);
    if (!website) throw new Error("Website not found.");
    return website.chatCount < 15;
};

// 🔄 Save Chat Message
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