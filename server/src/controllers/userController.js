const argon2 = require("argon2");
const mongoose = require("mongoose");
const validator = require("validator"); // For email validation
const User = require("../models/user"); // Adjust this path based on your folder structure
const jwt = require("jsonwebtoken")


const generateToken = (id) => {
  return jwt.sign({id}, process.env.SECRET_KEY, {expiresIn: '1d'})
}

const registerUser = async (userData) => {
  try {
    // Destructure user data
    const { name, email, password, address, state, country, phone } = userData;

    // Validate input
    if (!name || !email || !password || !address || !state || !country || !phone) {
      return { success: false, message: "All fields are required" };
    }

    if (!validator.isEmail(email)) {
      return { success: false, message: "Invalid email format" };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least six characters",
      };
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: "Email already exists" };
    }

    // Hash the password using Argon2
    const hashedPassword = await argon2.hash(password);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      state,
      country,
      phone,
      role: "client"
    });

    // Save the user to the database
    await newUser.save();

    return {
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        state: newUser.state,
        country: newUser.country,
        phone: newUser.phone,
        role: newUser.role
      },
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, message: "An error occurred during registration" };
  }
};


// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide both email and password" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Verify the password
    const passwordIsCorrect = await argon2.verify(user.password, password);
    if (!passwordIsCorrect) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Prepare user data for response (exclude sensitive data)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      state: user.state,
      country: user.country,
      phone: user.phone,
      role: user.role
    };

    // Set secure HTTP-only cookie
    res.cookie("token", token, {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      path: '/',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    
    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during logout' 
    });
  }
};

const getUser = async (req, res) => {
  try {
    // Fetch the user by ID from the request object (populated by middleware)
    const user = await User.findById(req.user._id);

    if (user) {
      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      console.error("User not found during fetching info.");
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error during fetching user info:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getLogInStatus = async (req, res) => {
  try {
        const token = req.cookies.token;
        
      if (!token) {
        return res.status(401).json(false)
      }

    const verified = jwt.verify(token, process.env.SECRET_KEY);
    if (verified){
      return res.json(true)
    }
      return res.status(401).json(false)
    
    }
   catch (error) {
    console.error("Error during fetching user info:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get current authenticated user's data
const getCurrentUser = async (req, res) => {
  try {
    // User is already attached to req by the auth middleware
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Return user data without sensitive information
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'client',
      isEmailVerified: user.isEmailVerified,
      profilePicture: user.profilePicture,
      phone: user.phone,
      address: user.address,
      state: user.state,
      country: user.country,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      success: true,
      user: userData  // Make sure this matches what the client expects
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};




module.exports = {registerUser, loginUser, logoutUser, getUser, getLogInStatus, getCurrentUser };
