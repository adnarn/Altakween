// const User = require('../models/user.js');
// const argon2 = require('argon2');
// const jwt = require('jsonwebtoken');

// // REGISTER + AUTO LOGIN
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, phone, address, state, country } = req.body;

//     // 1. Basic field checks
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // 2. Email format check
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: 'Invalid email format' });
//     }

//     // 3. Password strength
//     if (password.length < 6) {
//       return res.status(400).json({ message: 'Password must be at least 6 characters' });
//     }

//     // 4. Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already registered' });
//     }
//     if (phone && !/^\d{11}$/.test(phone)) {
//   return res.status(400).json({ message: 'Invalid phone number' });
// }


//     // 5. Hash password
//     const hashedPassword = await argon2.hash(password);

//     // 6. Create and save user
//     const newUser = new User({
//       name,
//       email,
//       address,
//       country,
//       state,
//       phone,
//       password: hashedPassword,
//       role: 'client',
//     });

//     const savedUser = await newUser.save();

//     // 7. JWT
//     const token = jwt.sign(
//       { id: savedUser._id, name: savedUser.name, role: savedUser.role },
//       process.env.SECRET_KEY,
//       { expiresIn: '3d' }
//     );

//     res.status(201).json({
//       message: 'Registration successful',
//       user: {
//         _id: savedUser._id,
//         name: savedUser.name,
//         email: savedUser.email,
//         role: savedUser.role,
//         country: savedUser.country,
//         state: savedUser.state,
//         address: savedUser.address,
//         phone: savedUser.phone,
//       },
//       token,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // LOGIN
// exports.login = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const valid = await argon2.verify(user.password, req.body.password);
//     if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign(
//       { id: user._id, name: user.name, role: user.role },
//       process.env.SECRET_KEY,
//       { expiresIn: '3d' }
//     );

//     res.status(200).json({
//       message: 'Login successful',
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       },
//       token
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const User = require('../models/user.js');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService');

// REGISTER + AUTO LOGIN
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address, state, country } = req.body;

    // 1. Basic field checks
    if (!name || !email || !password || !phone || !address || !state || !country) {
      return res.status(400).json({ 
        message: 'All fields are required: name, email, password, phone, address, state, country' 
      });
    }

    // 2. Trim and clean inputs
    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();
    const cleanState = state.trim();
    const cleanCountry = country.trim();

    // 3. Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // 4. Password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // 5. Check if email already exists (email should be unique)
    const existingUserByEmail = await User.findOne({ email: cleanEmail });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 6. Phone validation and formatting
    let formattedPhone;
    if (cleanPhone) {
      // Remove all non-digit characters
      const digitsOnly = cleanPhone.replace(/\D/g, '');
      
      // More flexible phone validation
      if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
        // Nigerian format: 08012345678
        formattedPhone = digitsOnly;
      } else if (digitsOnly.length === 13 && digitsOnly.startsWith('234')) {
        // International format: 2348012345678
        formattedPhone = '0' + digitsOnly.substring(3);
      } else if (digitsOnly.length === 10) {
        // Without leading 0: 8012345678
        formattedPhone = '0' + digitsOnly;
      } else if (digitsOnly.startsWith('+') && digitsOnly.length === 14) {
        // +234 format
        formattedPhone = '0' + digitsOnly.substring(4);
      } else {
        return res.status(400).json({ 
          message: 'Invalid phone number format. Use: 08012345678 or +2348012345678' 
        });
      }
    } else {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // 7. Check if phone already exists (phone should be unique)
    const existingUserByPhone = await User.findOne({ phone: formattedPhone });
    if (existingUserByPhone) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // 8. Hash password
    const hashedPassword = await argon2.hash(password);

    // 9. Create and save user - NAME CAN BE REPEATED ANY NUMBER OF TIMES
    const newUser = new User({
      name: cleanName, // <-- THIS CAN BE DUPLICATED! Multiple users can have same name
      email: cleanEmail, // <-- THIS MUST BE UNIQUE
      address: cleanAddress,
      country: cleanCountry,
      state: cleanState,
      phone: formattedPhone, // <-- THIS MUST BE UNIQUE
      password: hashedPassword,
      role: 'client',
    });

    const savedUser = await newUser.save();

    // 10. Generate JWT token
    const token = jwt.sign(
      { id: savedUser._id, name: savedUser.name, role: savedUser.role },
      process.env.JWT_SECRET || 'your-secret-key-here', // Fallback for development
      { expiresIn: '3d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        country: savedUser.country,
        state: savedUser.state,
        address: savedUser.address,
        phone: savedUser.phone,
      },
      token,
    });
  } catch (err) {
    console.error('Register error details:', err);
    
    // Handle MongoDB duplicate key error specifically
    if (err.code === 11000) {
      // Check which field caused the duplicate
      const duplicateField = Object.keys(err.keyPattern)[0];
      
      if (duplicateField === 'email') {
        return res.status(400).json({ message: 'Email already registered. Please use a different email.' });
      } else if (duplicateField === 'phone') {
        return res.status(400).json({ message: 'Phone number already registered. Please use a different phone number.' });
      } else if (duplicateField === 'name') {
        // THIS SHOULD NOT HAPPEN IF YOU'VE DROPPED THE INDEX!
        // But if it does, we need to handle it
        console.error('ERROR: Name field has a unique index! You need to drop the index from MongoDB.');
        return res.status(400).json({ 
          message: 'Database configuration error: Name field should not be unique. Contact administrator.' 
        });
      } else {
        return res.status(400).json({ 
          message: `Duplicate ${duplicateField}. Please use a different ${duplicateField}.` 
        });
      }
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Generic server error
    res.status(500).json({ 
      message: 'Server error during registration. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await argon2.verify(user.password, password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: '3d' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
        state: user.state,
        address: user.address,
        phone: user.phone,
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login. Please try again.' });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token and expiry (15 minutes)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // Send email
    const emailSent = await sendPasswordResetEmail(email, resetToken);
    
    if (emailSent) {
      res.status(200).json({
        message: 'Password reset instructions sent to your email'
      });
    } else {
      // If email fails
      res.status(500).json({ 
        message: 'Failed to send reset email. Please contact support.' 
      });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash the token to compare with stored token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      message: 'Password reset successful'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
