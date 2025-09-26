// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS setup
app.use(cors({
  origin: ['http://localhost:5173', 'https://altakween.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB Connection (once only)
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MongoDB URI not found in environment variables');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Test routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running on Vercel 🚀',
    env: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time: new Date().toISOString()
  });
});

// ✅ Import routers
const userRouter = require('./src/routes/userRoutes');
const authRouter = require('./src/routes/auth');
const packageRouter = require('./src/routes/packageRouter');
const bookingRouter = require('./src/routes/bookingRouter');

// ✅ Use routers
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/packages', packageRouter);
app.use('/api/bookings', bookingRouter);

// ✅ 404 route handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// ✅ Export for Vercel
module.exports = app;

// ✅ Localhost server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
