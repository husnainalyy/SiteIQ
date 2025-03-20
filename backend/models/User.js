const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        clerkUserId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
        },
        image: {
            type: String, // Profile Image URL from Clerk
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
            customerId: { type: String }, // Store Stripe Customer ID
            subscriptionId: { type: String }, // Store Stripe Subscription ID
            isActive: { type: Boolean, default: false }, // Active Subscription Status
            plan: { type: String, enum: ["basic", "pro", "enterprise"], default: "basic" },
        },
        loginCount: {
            type: Number,
            default: 0,
        },
        seoReports: [
            {
                url: { type: String, required: true },
                reportData: { type: Object, default: {} }, // Store SEO analysis result
                createdAt: { type: Date, default: Date.now },
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Update `updatedAt` on save
UserSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("User", UserSchema);
