import mongoose from "mongoose";

const WebsiteVectorSchema = new mongoose.Schema(
    {
        website: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Website",
            required: true,
            unique: true, // One vector per website
        },
        embeddings: {
            type: [Number],
            required: true,
        },
        textData: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true, // Handles createdAt and updatedAt automatically
    }
);

// Indexes for optimized search and filtering
WebsiteVectorSchema.index({ website: 1 });
WebsiteVectorSchema.index({ user: 1 });
WebsiteVectorSchema.index({ updatedAt: -1 });

const WebsiteVector = mongoose.model("WebsiteVector", WebsiteVectorSchema);
export default WebsiteVector;
