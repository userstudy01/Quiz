// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // .env file load karne ke liye
const connectDB = require('./config/db');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Frontend ko backend se baat karne allow karta hai
app.use(express.json()); // JSON data parse karne ke liye (req.body)

// Mount Routes
// app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/evaluations', require('./routes/evaluationRoutes')); 

// Basic Health Check Route
app.get('/', (req, res) => {
  res.send('API is running securely...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app