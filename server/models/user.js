const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least six characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    role: {
      type: String,
      enum: ['client', 'admin'],
      default: "client"
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User =  mongoose.model('User', userSchema);
module.exports = User
