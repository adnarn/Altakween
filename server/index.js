// // const express = require('express');
// // const cors = require('cors');
// // const mongoose = require('mongoose');
// // const dotenv = require('dotenv');

// // // Initialize environment variables
// // dotenv.config();

// // const app = express();
// // const PORT = process.env.PORT || 3000;

// // // Middleware
// // app.use(express.json());
// // app.use(cors({
// //   origin: [
// //     'http://localhost:5173', 
// //     'https://altakween.vercel.app',
// //     'https://your-production-frontend.com' // Add your production domain
// //   ],
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// // }));

// // // MongoDB connection with caching for serverless
// // let isConnected = false;
// // let connectionPromise = null;

// // const connectDB = async () => {
// //   if (isConnected) {
// //     console.log('✅ Using existing MongoDB connection');
// //     return;
// //   }

// //   if (connectionPromise) {
// //     console.log('✅ Connection already in progress');
// //     return connectionPromise;
// //   }

// //   connectionPromise = (async () => {
// //     try {
// //       console.log('🔗 Connecting to MongoDB...');
      
// //       if (!process.env.MONGO_URI) {
// //         throw new Error('MONGO_URI environment variable is required');
// //       }

// //       const options = {
// //         useNewUrlParser: true,
// //         useUnifiedTopology: true,
// //         serverSelectionTimeoutMS: 5000,
// //         socketTimeoutMS: 45000,
// //       };

// //       await mongoose.connect(process.env.MONGO_URI, options);
      
// //       isConnected = mongoose.connection.readyState === 1;
      
// //       if (isConnected) {
// //         console.log('✅ MongoDB connected successfully');
        
// //         mongoose.connection.on('error', (err) => {
// //           console.error('❌ MongoDB connection error:', err);
// //           isConnected = false;
// //         });

// //         mongoose.connection.on('disconnected', () => {
// //           console.log('❌ MongoDB disconnected');
// //           isConnected = false;
// //         });
// //       }
// //     } catch (error) {
// //       console.error('❌ MongoDB connection failed:', error);
// //       isConnected = false;
// //       connectionPromise = null;
// //       throw error;
// //     }
// //   })();

// //   return connectionPromise;
// // };

// // // Database connection middleware
// // app.use(async (req, res, next) => {
// //   try {
// //     await connectDB();
// //     next();
// //   } catch (error) {
// //     console.error('Database connection error:', error);
// //     res.status(503).json({
// //       success: false,
// //       message: 'Service temporarily unavailable',
// //       error: 'Database connection failed'
// //     });
// //   }
// // });

// // // Health check endpoint
// // app.get('/health', (req, res) => {
// //   const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
// //   res.status(200).json({
// //     status: 'OK',
// //     timestamp: new Date().toISOString(),
// //     database: dbStatus,
// //     environment: process.env.NODE_ENV || 'development',
// //     version: '1.0.0'
// //   });
// // });

// // // Root endpoint
// // app.get('/', (req, res) => {
// //   res.json({
// //     success: true,
// //     message: '🚀 Altaqween Travel API is running!',
// //     version: '1.0.0',
// //     timestamp: new Date().toISOString(),
// //     endpoints: {
// //       auth: '/api/auth',
// //       users: '/api/users',
// //       packages: '/api/packages',
// //       bookings: '/api/bookings'
// //     }
// //   });
// // });

// // // API status endpoint
// // app.get('/api', (req, res) => {
// //   res.json({
// //     success: true,
// //     message: 'Altaqween Travel API',
// //     status: 'operational',
// //     version: '1.0.0'
// //   });
// // });

// // // Load and use routes with error handling
// // try {
// //   const authRouter = require('./routes/auth');
// //   app.use('/api/auth', authRouter);
// //   console.log('✅ Auth routes loaded successfully');
// // } catch (error) {
// //   console.error('❌ Failed to load auth routes:', error);
// // }

// // try {
// //   const userRouter = require('./routes/userRoutes');
// //   app.use('/api/users', userRouter);
// //   console.log('✅ User routes loaded successfully');
// // } catch (error) {
// //   console.error('❌ Failed to load user routes:', error);
// // }

// // try {
// //   const packageRouter = require('./routes/packageRouter');
// //   app.use('/api/packages', packageRouter);
// //   console.log('✅ Package routes loaded successfully');
// // } catch (error) {
// //   console.error('❌ Failed to load package routes:', error);
// // }

// // try {
// //   const bookingRouter = require('./routes/bookingRouter');
// //   app.use('/api/bookings', bookingRouter);
// //   console.log('✅ Booking routes loaded successfully');
// // } catch (error) {
// //   console.error('❌ Failed to load booking routes:', error);
// // }

// // // 404 Handler for undefined routes
// // app.use('*', (req, res) => {
// //   res.status(404).json({
// //     success: false,
// //     message: 'Route not found',
// //     path: req.originalUrl,
// //     method: req.method
// //   });
// // });

// // // Global error handling middleware
// // app.use((error, req, res, next) => {
// //   console.error('🔥 Unhandled Error:', error);
  
// //   // Mongoose validation error
// //   if (error.name === 'ValidationError') {
// //     return res.status(400).json({
// //       success: false,
// //       message: 'Validation Error',
// //       errors: Object.values(error.errors).map(err => err.message)
// //     });
// //   }
  
// //   // Mongoose duplicate key error
// //   if (error.code === 11000) {
// //     return res.status(400).json({
// //       success: false,
// //       message: 'Duplicate field value entered'
// //     });
// //   }
  
// //   // JWT errors
// //   if (error.name === 'JsonWebTokenError') {
// //     return res.status(401).json({
// //       success: false,
// //       message: 'Invalid token'
// //     });
// //   }
  
// //   if (error.name === 'TokenExpiredError') {
// //     return res.status(401).json({
// //       success: false,
// //       message: 'Token expired'
// //     });
// //   }

// //   // Default error
// //   res.status(error.status || 500).json({
// //     success: false,
// //     message: process.env.NODE_ENV === 'production' 
// //       ? 'Internal server error' 
// //       : error.message,
// //     ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
// //   });
// // });

// // // Handle unhandled promise rejections
// // process.on('unhandledRejection', (err) => {
// //   console.error('🔥 Unhandled Promise Rejection:', err);
// //   // In production, you might want to exit the process
// //   if (process.env.NODE_ENV === 'production') {
// //     process.exit(1);
// //   }
// // });

// // // Handle uncaught exceptions
// // process.on('uncaughtException', (err) => {
// //   console.error('🔥 Uncaught Exception:', err);
// //   process.exit(1);
// // });

// // // Export for Vercel serverless functions
// // module.exports = app;

// // // Start server only when not in serverless environment
// // if (require.main === module) {
// //   connectDB()
// //     .then(() => {
// //       const server = app.listen(PORT, () => {
// //         console.log(`\n🚀 Server running on port ${PORT}`);
// //         console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
// //         console.log(`📊 MongoDB: ${isConnected ? 'Connected' : 'Disconnected'}`);
// //         console.log(`⏰ Started at: ${new Date().toISOString()}`);
// //         console.log(`🔗 Local: http://localhost:${PORT}`);
// //         console.log(`❤️  Health check: http://localhost:${PORT}/health\n`);
// //       });

// //       // Graceful shutdown
// //       process.on('SIGTERM', () => {
// //         console.log('SIGTERM received, shutting down gracefully');
// //         server.close(() => {
// //           mongoose.connection.close();
// //           console.log('Process terminated');
// //           process.exit(0);
// //         });
// //       });
// //     })
// //     .catch((error) => {
// //       console.error('❌ Failed to start server:', error);
// //       process.exit(1);
// //     });
// // }


// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const fs = require('fs');
// const path = require('path');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors({
//   origin: ['http://localhost:5173', 'https://altakween.vercel.app'],
//   credentials: true,
// }));

// // Debug middleware to log all requests
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// });

// // Test route
// app.get('/', (req, res) => {
//   res.json({
//     success: true,
//     message: '🚀 API is running!',
//     timestamp: new Date().toISOString()
//   });
// });

// // Debug route to check file system
// app.get('/debug-files', (req, res) => {
//   try {
//     const currentDir = __dirname;
//     const routesDir = path.join(currentDir, 'routes');
    
//     let routesFiles = [];
//     try {
//       routesFiles = fs.readdirSync(routesDir);
//     } catch (error) {
//       routesFiles = [`Error reading routes directory: ${error.message}`];
//     }

//     const filesInRoot = fs.readdirSync(currentDir);

//     res.json({
//       currentDirectory: currentDir,
//       filesInRoot: filesInRoot,
//       routesDirectory: routesDir,
//       routesFiles: routesFiles,
//       exists: {
//         routesDir: fs.existsSync(routesDir),
//         authRoute: fs.existsSync(path.join(routesDir, 'auth.js')),
//         packageRoute: fs.existsSync(path.join(routesDir, 'packageRouter.js'))
//       }
//     });
//   } catch (error) {
//     res.json({ error: error.message });
//   }
// });

// // Simple test routes first
// app.get('/api/test-simple', (req, res) => {
//   res.json({ message: 'Simple route works!' });
// });

// app.get('/api/packages/simple', (req, res) => {
//   res.json({ 
//     success: true, 
//     message: 'Simple packages route works',
//     timestamp: new Date().toISOString()
//   });
// });

// // Try to load routes with absolute paths
// console.log('🔍 Current directory:', __dirname);
// console.log('🔍 Loading routes...');

// const routeAttempts = [
//   { path: './routes/auth', name: 'auth' },
//   { path: './routes/packageRouter', name: 'packageRouter' },
//   { path: './routes/bookingRouter', name: 'bookingRouter' },
//   { path: './routes/userRoutes', name: 'userRoutes' }
// ];

// routeAttempts.forEach(route => {
//   try {
//     console.log(`📁 Attempting to load: ${route.path}`);
    
//     // Try multiple path variations
//     const pathsToTry = [
//       route.path,
//       `./src/${route.path}`,
//       `../${route.path}`,
//       `${route.path}.js`
//     ];
    
//     let loadedRouter = null;
//     let loadedPath = null;
    
//     for (const tryPath of pathsToTry) {
//       try {
//         const resolvedPath = require.resolve(tryPath, { paths: [__dirname] });
//         console.log(`✅ Found at: ${resolvedPath}`);
//         loadedRouter = require(tryPath);
//         loadedPath = tryPath;
//         break;
//       } catch (e) {
//         // Continue to next path
//       }
//     }
    
//     if (loadedRouter) {
//       app.use(`/api/${route.name === 'packageRouter' ? 'packages' : route.name}`, loadedRouter);
//       console.log(`✅ ${route.name} routes loaded successfully from ${loadedPath}`);
//     } else {
//       throw new Error(`Could not find ${route.name} router file`);
//     }
    
//   } catch (error) {
//     console.error(`❌ Failed to load ${route.name} routes:`, error.message);
    
//     // Create a fallback route
//     app.use(`/api/${route.name === 'packageRouter' ? 'packages' : route.name}`, (req, res) => {
//       res.status(500).json({
//         error: `${route.name} routes not loaded`,
//         message: error.message
//       });
//     });
//   }
// });

// // 404 handler with more details
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found',
//     path: req.originalUrl,
//     method: req.method,
//     availableRoutes: [
//       '/',
//       '/debug-files',
//       '/health',
//       '/api/test-simple',
//       '/api/packages/simple',
//       '/api/packages',
//       '/api/auth',
//       '/api/bookings',
//       '/api/users'
//     ]
//   });
// });

// // Basic MongoDB connection for Vercel
// const connectDB = async () => {
//   try {
//     if (mongoose.connection.readyState === 1) {
//       return;
//     }
    
//     if (process.env.MONGO_URI) {
//       await mongoose.connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });
//       console.log('✅ MongoDB connected');
//     } else {
//       console.log('⚠️  MONGO_URI not set, running without database');
//     }
//   } catch (error) {
//     console.error('❌ MongoDB connection failed:', error.message);
//   }
// };

// // Connect to DB on each request (serverless-friendly)
// app.use(async (req, res, next) => {
//   await connectDB();
//   next();
// });

// module.exports = app;
// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://altakween.vercel.app'],
    credentials: true,
  })
);

// ✅ Connect to MongoDB (once, not per request)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err.message));

// ✅ Base route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Altaqween API running on Render',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ✅ Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time: new Date().toISOString(),
  });
});

// ✅ Import routes
try {
  const authRouter = require('./routes/auth');
  const packageRouter = require('./routes/packageRouter');
  const bookingRouter = require('./routes/bookingRouter');
  const userRouter = require('./routes/userRoutes');

  app.use('/api/auth', authRouter);
  app.use('/api/packages', packageRouter);
  app.use('/api/bookings', bookingRouter);
  app.use('/api/users', userRouter);

  console.log('✅ All routes loaded successfully');
} catch (err) {
  console.error('❌ Route loading error:', err.message);
}

// ✅ 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

// ✅ Start server (Render runs this directly)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
