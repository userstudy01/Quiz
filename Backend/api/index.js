const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const connectDB = require('../config/db');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/questions', require('../routes/questionRoutes'));
app.use('/api/evaluations', require('../routes/evaluationRoutes'));

// test route
app.get('/', (req, res) => {
  res.send('API is running on Vercel 🚀');
});

// ✅ ONLY ONE EXPORT (IMPORTANT)
module.exports = serverless(async (req, res) => {
  await connectDB();   // 👈 DB connect here
  return app(req, res);
});