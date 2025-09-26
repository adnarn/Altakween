// // index.js
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const connectDB= require('./src/config/dbConfig'); // ✅ import before use

// dotenv.config();

// const app = express();

// // ✅ Middleware
// app.use(express.json());
// app.use(cors({
//   origin: ['http://localhost:5173', 'https://altakween.vercel.app'],
//   credentials: true,
// }));

// // ✅ Test route
// app.get('/', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Server is running on Vercel 🚀',
//     time: new Date().toISOString(),
//   });
// });

// // ✅ Health check route
// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
//   });
// });

// // ✅ Routes
// const userRouter = require('./src/routes/userRoutes');
// const authRouter = require('./src/routes/auth');
// const packageRouter = require('./src/routes/packageRouter');
// const bookingRouter = require('./src/routes/bookingRouter');

// // ✅ Use routes
// app.use('/api/users', userRouter);
// app.use('/api/auth', authRouter);
// app.use('/api/packages', packageRouter);
// app.use('/api/bookings', bookingRouter);

// // ✅ 404 Handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found',
//   });
// });

// // ✅ Error Handler
// app.use((err, req, res, next) => {
//   console.error('🔥 Error:', err.message);
//   res.status(500).json({
//     success: false,
//     message: 'Internal Server Error',
//     error: process.env.NODE_ENV === 'production' ? {} : err.message,
//   });
// });

// // ✅ Export for Vercel
// module.exports = app;

// // ✅ Localhost mode (connect DB and start server)
// if (require.main === module) {
//   connectDB().then(() => {
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => console.log(`🚀 Server running at port ${PORT}`));
//   });
// } else {
//   // Connect immediately when Vercel loads the function
//   connectDB();
// }


import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running ✅" });
});

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

export default app;
