// app.js — Express app shared by the local server (server.js) and the
// serverless entry point (api/index.js).
const express = require('express');
const cors = require('cors');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Allowed origins come from env; empty list falls back to "same-origin only"
// in production and "anything" in development.
const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL]
  .filter(Boolean)
  .flatMap((value) => value.split(',').map((v) => v.trim()))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Non-browser clients (curl, server-to-server) send no Origin header.
      if (!origin) return callback(null, true);
      if (!allowedOrigins.length) {
        return callback(null, process.env.NODE_ENV !== 'production');
      }
      return callback(null, allowedOrigins.includes(origin));
    },
    credentials: false,
  })
);

app.use(express.json({ limit: '1mb' }));
// Analytics beacons (navigator.sendBeacon) arrive as text/plain to stay
// preflight-free; parse them as a raw string for the analytics controller.
app.use(express.text({ type: 'text/plain', limit: '16kb' }));

app.get('/', (req, res) => res.json({ status: 'ok', service: 'portfolio-api' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/experience', require('./routes/experienceRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
