// api/index.js — serverless entry point (Vercel)
require('dotenv').config();

const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = require('../app');

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

// Reuse the connection across warm invocations instead of dialling per request.
let connection = global.__mongooseConnection;

const connect = async () => {
  if (!connection) {
    connection = mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    global.__mongooseConnection = connection;
  }
  return connection;
};

const handler = serverless(app);

module.exports = async (req, res) => {
  await connect();
  return handler(req, res);
};
