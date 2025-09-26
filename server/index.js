// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://altakween.vercel.app'],
  credentials: true,
}));

// ✅ MongoDB Connection (connect once)
const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw new Error('❌ MONGO_URI not defined in .env');

    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// ✅ Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running on Vercel 🚀',
    time: new Date().toISOString(),
  });
});

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ✅ Routes (import after DB connect)
const userRouter = require('./src/routes/userRoutes');
const authRouter = require('./src/routes/auth');
const packageRouter = require('./src/routes/packageRouter');
const bookingRouter = require('./src/routes/bookingRouter');

// ✅ Use routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/packages', packageRouter);
app.use('/api/bookings', bookingRouter);

// ✅ 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message,
  });
});

// ✅ Export for Vercel
module.exports = app;

// ✅ Localhost mode
if (require.main === module) {
  connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running at port ${PORT}`));
  });
} else {
  // Connect immediately when Vercel loads the function
  connectDB();
}
