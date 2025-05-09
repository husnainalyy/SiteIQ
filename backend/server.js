import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// imports for swagger 
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import { apiReference } from '@scalar/express-api-reference';

// Import routes
import userRoutes from './routes/userRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import seoRecommendationsRoutes from './routes/seoRecommendation.routes.js';
import historyRoutes from './routes/history.routes.js';
import seoRoutes from './routes/seoRoutes.js';
import techStackRoutes from './routes/techstackroute.js';
import chatRouter from './routes/techstackChatRouter.js';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 4500;

// Middleware
app.use(cors({
  origin: '*', // Or '*' for testing
  credentials: true
}));
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
app.use('/api/seoreports', seoRoutes); // Mount webhook routes

//swagger routes 

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve Scalar API reference at /reference
app.use(
  '/reference',
  apiReference({
    url: '/openapi.json', // Endpoint serving your OpenAPI spec
    theme: 'purple', // Optional: choose a theme
  })
);

// Serve the OpenAPI spec at /openapi.json
app.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


app.use('/api/seoRecommendations', seoRecommendationsRoutes);
app.use('/api/history', historyRoutes);app.use("/api/techstack", techStackRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});