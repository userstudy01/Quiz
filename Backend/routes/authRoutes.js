// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Jo schema humne pehle banaya tha

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user (Candidate or Admin)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'candidate' // Default role candidate rahega
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully! Please log in.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get JWT token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials (Email not found)' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials (Wrong Password)' });
    }

    // Generate JWT Token
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }, // Token 7 din tak valid rahega
      (err, token) => {
        if (err) throw err;
        // Password frontend par nahi bhejna chahiye, isliye usko hata kar bhejenge
        res.json({
          token,
          user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
      }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;