const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://altakween.vercel.app', 'https://app.altakween.ng'],
  credentials: true,
}));

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 API is running with correct paths!',
    timestamp: new Date().toISOString()
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) return;
    
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB connected');
    } else {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ✅ CORRECT PATH REQUIREMENTS - Use absolute paths
console.log('🔍 Loading routes from:', path.join(__dirname, 'routes'));

try {
  // Use require with absolute path
  const authRouter = require('./routes/auth');
  app.use('/api/auth', authRouter);
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.error('❌ Auth routes failed:', error);
  app.use('/api/auth', (req, res) => {
    res.status(500).json({ error: 'Auth routes failed to load: ' + error.message });
  });
}

try {
  const packageRouter = require('./routes/packageRouter');
  app.use('/api/packages', packageRouter);
  console.log('✅ Package routes loaded successfully');
} catch (error) {
  console.error('❌ Package routes failed:', error);
  app.use('/api/packages', (req, res) => {
    res.status(500).json({ error: 'Package routes failed to load: ' + error.message });
  });
}

try {
  const bookingRouter = require('./routes/bookingRouter');
  app.use('/api/bookings', bookingRouter);
  console.log('✅ Booking routes loaded successfully');
} catch (error) {
  console.error('❌ Booking routes failed:', error);
  app.use('/api/bookings', (req, res) => {
    res.status(500).json({ error: 'Booking routes failed to load: ' + error.message });
  });
}

try {
  const userRouter = require('./routes/userRoutes');
  app.use('/api/users', userRouter);
  console.log('✅ User routes loaded successfully');
} catch (error) {
  console.error('❌ User routes failed:', error);
  app.use('/api/users', (req, res) => {
    res.status(500).json({ error: 'User routes failed to load: ' + error.message });
  });
}
try {
  const dashRouter = require('./routes/dashboardRoutes');
  app.use('/api/dashboard', dashRouter);
  console.log('✅ Dashboard routes loaded successfully');
} catch (error) {
  console.error('❌ Dashboard routes failed:', error);
  app.use('/api/dashboard', (req, res) => {
    res.status(500).json({ error: 'Dashboard routes failed to load: ' + error.message });
  });
}
try {
  const reportsRouter = require('./routes/reportRoutes');
  app.use('/api/reports', reportsRouter);
  console.log('✅ Reports routes loaded successfully');
} catch (error) {
  console.error('❌ Reports routes failed:', error);
  app.use('/api/reports', (req, res) => {
    res.status(500).json({ error: 'Dashboard routes failed to load: ' + error.message });
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Debug route
app.get('/debug', (req, res) => {
  res.json({
    message: 'Debug endpoint',
    currentDir: __dirname,
    routesExist: {
      auth: require.resolve('./routes/auth'),
      packageRouter: require.resolve('./routes/packageRouter'),
      bookingRouter: require.resolve('./routes/bookingRouter'),
      userRoutes: require.resolve('./routes/userRoutes')
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    availableRoutes: [
      '/',
      '/health',
      '/debug',
      '/api/auth/*',
      '/api/packages/*',
      '/api/bookings/*',
      '/api/users/*'
    ]
  });
});

module.exports = app;