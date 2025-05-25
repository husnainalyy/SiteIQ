import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        clerkUserId: { type: String, required: true, unique: true },
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
        image: {
            type: String,
            default: "https://default-avatar.com/avatar.png",
        },
        isVerified: { type: Boolean, default: false },

        // Websites owned by this user
        websites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Website" }],

        // Membership & Stripe
        membership: {
            type: String,
            enum: ["premium", "freemium"],
            default: "freemium",
        },
        stripe: {
            customerId: { type: String, default: null },
            subscriptionId: { type: String, default: null },
            isActive: { type: Boolean, default: false },
            plan: {
                type: String,
                enum: ["basic", "pro", "enterprise"],
                default: "basic",
            },
        },

        // Website limit tracking
        weeklyWebsiteLimit: { type: Number, default: 3 },
        lastResetDate: { type: Date, default: Date.now },

        // Usage tracking
        subscription: {
            plan: {
                type: String,
                enum: ["freemium", "individual", "business"],
                default: "freemium",
            },
            usage: {
                seoRecommendations: { type: Number, default: 0 },
                techStackRecommendations: { type: Number, default: 0 },
                weekStart: { type: Date, default: Date.now },
            },
        },

        loginCount: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true }
);

// Reset website limit weekly
UserSchema.methods.resetWebsiteLimit = async function () {
    const now = new Date();
    const lastReset = new Date(this.lastResetDate);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (lastReset < oneWeekAgo) {
        this.lastResetDate = now;
        this.websites = [];
        await this.save();
    }
};

UserSchema.methods.canAddWebsite = async function () {
    await this.resetWebsiteLimit();
    return (
        this.membership === "premium" ||
        this.websites.length < this.weeklyWebsiteLimit
    );
};

const User = mongoose.model("User", UserSchema);
export default User;
