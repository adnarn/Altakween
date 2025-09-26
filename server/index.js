// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
  });

// ✅ Test Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running 🚀',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ✅ Health Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time: new Date().toISOString(),
  });
});

// ✅ Export app for Vercel
module.exports = app;

// ✅ Localhost mode (for local testing)
if (require.main === module) {
  const PORT = process.env.PORT || 8081;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
