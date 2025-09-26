const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://altakween.vercel.app'],
  credentials: true,
}));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Test each route individually
app.use('/api/users', (req, res) => {
  res.json({ message: 'Users route works' });
});

// Add routes one by one to find the problematic one
try {
  const authRouter = require('./routes/auth');
  app.use('/api/auth', authRouter);
  console.log('✅ Auth route loaded');
} catch (error) {
  console.error('❌ Auth route failed:', error);
}

try {
  const packageRouter = require('./routes/packageRouter');
  app.use('/api/packages', packageRouter);
  console.log('✅ Packages route loaded');
} catch (error) {
  console.error('❌ Packages route failed:', error);
}

try {
  const bookingRouter = require('./routes/bookingRouter');
  app.use('/api/bookings', bookingRouter);
  console.log('✅ Bookings route loaded');
} catch (error) {
  console.error('❌ Bookings route failed:', error);
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;