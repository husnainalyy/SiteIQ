    import mongoose from "mongoose";

    const chatMessageSchema = new mongoose.Schema(
        {
            userMessage: { type: String, required: true },
            botResponse: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
        { _id: false }
    );

    const websiteSchema = new mongoose.Schema(
        {
            clerkuserId: {type: String, required: true},
            
            domain: {
                type: String,
                required: true,
            },
            seoReport: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SeoReport",
            },
            seoRecommendation: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SeoRecommendation",
            },
            aiRecommendations: {
                type: Object,
                default: {},
            },
            chatHistory: {
                type: [chatMessageSchema],
                default: [],
            },
            chatCount: {
                type: Number,
                default: 0,
                min: 0,
                max: 15,
            },
        },
        { timestamps: true }
    );

    const Website = mongoose.model("Website", websiteSchema);
    export default Website;
