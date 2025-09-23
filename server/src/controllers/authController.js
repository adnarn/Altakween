const User = require('../models/user.js');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

// REGISTER + AUTO LOGIN
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address, state, country } = req.body;

    // 1. Basic field checks
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2. Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // 3. Password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    if (phone && !/^\d{11}$/.test(phone)) {
  return res.status(400).json({ message: 'Invalid phone number' });
}


    // 5. Hash password
    const hashedPassword = await argon2.hash(password);

    // 6. Create and save user
    const newUser = new User({
      name,
      email,
      address,
      country,
      state,
      phone,
      password: hashedPassword,
      role: 'client',
    });

    const savedUser = await newUser.save();

    // 7. JWT
    const token = jwt.sign(
      { id: savedUser._id, name: savedUser.name, role: savedUser.role },
      process.env.SECRET_KEY,
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
    res.status(500).json({ message: err.message });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await argon2.verify(user.password, req.body.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '3d' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
