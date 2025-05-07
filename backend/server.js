import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';


// Import routes
import userRoutes from './routes/userRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import techStackRoutes from './routes/techstackroute.js';
import chatRouter from './routes/techstackChatRouter.js';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use('/api/webhooks', express.raw({ type: 'application/json' })); // Raw body for webhooks
app.use(express.json()); // JSON for other routes
app.use("/api/chat", chatRouter);


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to SiteIQ Backend!');
});

app.use('/api/users', userRoutes);
app.use('/api/webhooks', webhookRoutes); // Mount webhook routes
app.use("/api/techstack", techStackRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});