import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import routes
import userRoutes from './routes/userRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import seoRecommendationsRoutes from './routes/seoRecommendation.routes.js';
import historyRoutes from './routes/history.routes.js';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 4500;

// Middleware
app.use(cors());
app.use('/api/webhooks', express.raw({ type: 'application/json' })); // Raw body for webhooks
app.use(express.json()); // JSON for other routes

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

app.use('/api/seoRecommendations', seoRecommendationsRoutes);
app.use('/api/history', historyRoutes);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});