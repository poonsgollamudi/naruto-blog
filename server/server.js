require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const postsRouter = require('./routes/posts');

const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// API rate limiting (stricter for API endpoints)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 API requests per windowMs
  message: 'Too many API requests from this IP, please try again later.',
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',') 
      : [
          'http://localhost:5173',
          'https://yourusername.github.io' // Update with your GitHub username
        ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize user input to prevent NoSQL injection attacks
app.use(mongoSanitize());

// Connect to MongoDB Atlas with better error handling
const connectDB = async () => {
  try {
    console.log('🔍 Checking environment variables...');
    console.log('MONGODB_URI present:', !!process.env.MONGODB_URI);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB Atlas');
    
    // Initialize scheduler after DB connection
    try {
      if (process.env.ENABLE_SCHEDULER !== 'false') {
        require('./scheduler');
        console.log('🤖 AI scheduler initialized');
      } else {
        console.log('📴 AI scheduler disabled');
      }
    } catch (err) {
      console.warn('⚠️  Scheduler not started:', err.message);
    }
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    
    // Don't crash the app, just log the error
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Retrying MongoDB connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

connectDB();

// Routes with API rate limiting
app.use('/api/posts', apiLimiter, postsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation' });
  }
  
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Root endpoint for health check
app.get('/', (req, res) => {
  res.json({ 
    message: '🍥 Naruto Blog API Server',
    status: 'running',
    version: '1.0.0',
    endpoints: ['/api/posts', '/health']
  });
});

const port = process.env.PORT || 5000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🍥 Naruto Blog server running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    mongoose.connection.close();
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    mongoose.connection.close();
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  console.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});