// models/ChatSession.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
}, { _id: false });

const chatSessionSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },  sessionId: { type: String, required: true },
  mode: { type: String, enum: ['improve'], default: 'improve' },
  history: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  lastAccessed: { type: Date, default: Date.now }
});

export default mongoose.model('techstackChatModel', chatSessionSchema);
