const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// Request Logging Middleware (Development)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PrivAI Backend API',
    aiProvider: process.env.AI_PROVIDER || 'gemini (fallback demo if no key)',
    timestamp: new Date().toISOString()
  });
});

// Mount REST API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/analysis', require('./routes/analysisRoutes'));
app.use('/api/eligibility', require('./routes/eligibilityRoutes'));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database & Start Express Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 PrivAI Server running on port ${PORT}`);
    console.log(`🔒 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🤖 Default AI Provider: ${process.env.AI_PROVIDER || 'gemini (with automatic mock fallback)'}`);
    console.log(`=================================================`);
  });
});

module.exports = app;
