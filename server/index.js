// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
}));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// ✅ Basic route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server running fine 🚀',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ✅ Export app
module.exports = app;
