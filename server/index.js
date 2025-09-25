// server.js or app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./src/routes/userRoutes');
const cookieParser = require('cookie-parser');
const authRouter = require('./src/routes/auth.js');
const packageRouter = require('./src/routes/packageRouter.js');
const bookingRouter = require('./src/routes/bookingRouter.js');

// Initialize dotenv for environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());  // Use express.json() to parse JSON bodies
app.use(cookieParser());

// Configure CORS for production and development
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend-domain.vercel.app' // Replace with your actual frontend domain
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Test route
app.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.json({ message: 'Server is running on Vercel' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'API is working correctly', timestamp: new Date().toISOString() });
});

// Use the routers
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/packages', packageRouter);
app.use('/api/bookings', bookingRouter);

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// For Vercel serverless functions, we need to export the app
module.exports = app;

// For local development, start the server normally
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  });
}