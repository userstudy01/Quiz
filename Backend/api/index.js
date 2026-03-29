const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const connectDB = require('../config/db');

const app = express();

// DB connect
module.exports = serverless(async (req, res) => {
  await connectDB();
  return app(req, res);
});

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

// ❌ REMOVE this:
// app.listen(PORT)

// ✅ EXPORT THIS:
module.exports = serverless(app);