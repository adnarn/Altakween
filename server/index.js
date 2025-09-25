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
const bookingRouter = require('./src/routes/bookingRouter.js')

// Initialize dotenv for environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());  // Use express.json() to parse JSON bodies
app.use(cookieParser());

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Test route
app.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.json({ message: 'Server is running' });
});

// Use the userRouter for user-related routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter)
app.use('/api/packages', packageRouter)
app.use('/api/bookings', bookingRouter)

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// MongoDB connection using the URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

console.log('Connecting to MongoDB...');
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
    console.log('Connected to the database successfully');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
