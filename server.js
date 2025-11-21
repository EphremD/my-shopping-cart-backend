const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Debug: Log all environment variables (except sensitive ones)
console.log('🔍 Environment Variables Check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('CLIENT_URL:', process.env.CLIENT_URL);

// Try multiple possible environment variable names for MongoDB
const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || process.env.MONGO_URL;

console.log('🔍 Checking database connection strings:');
console.log('MONGODB_URI:', !!process.env.MONGODB_URI);
console.log('DATABASE_URL:', !!process.env.DATABASE_URL);
console.log('MONGO_URL:', !!process.env.MONGO_URL);

// Middleware
app.use(cors({
  origin: [
    'https://my-shopping-cart-frontend.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'My Shopping Cart API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    databaseConnected: mongoose.connection.readyState === 1
  });
});

// Health check route
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    console.log('🔧 Attempting MongoDB connection...');
    console.log('MONGODB_URI length:', MONGODB_URI ? MONGODB_URI.length : 'undefined');
    
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      console.log('💡 Available env vars:', Object.keys(process.env).filter(key => 
        !key.toLowerCase().includes('secret') && !key.toLowerCase().includes('key')
      ));
      return;
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Continuing without database connection');
    }
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  });
};

startServer().catch(console.error);

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed');
  process.exit(0);
});