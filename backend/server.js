require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Import routes
const authRoutes = require('./routes/authRoutes');
const seoRoutes = require('./routes/seoRoutes');
const techStackRoutes = require('./routes/techStackRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/seo', ClerkExpressRequireAuth(), seoRoutes); // SEO routes (protected)
app.use('/api/tech-stack', ClerkExpressRequireAuth(), techStackRoutes); // Tech stack routes (protected)
app.use('/api/chat', ClerkExpressRequireAuth(), chatRoutes); // Chatbot routes (protected)

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to SiteIQ Backend!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});