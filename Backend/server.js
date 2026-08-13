// server.js — local / long-running Node process
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Portfolio API running on port ${PORT}`);
  });
});

module.exports = app;
