const User = require("../models/user");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    // Get the token from the Authorization header only
    let token;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Get token from header
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized, no token" 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized, user not found' 
        });
      }

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, token failed' 
      });
    }
  } catch (error) {
    console.error('Error in protect middleware:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

module.exports = protect;