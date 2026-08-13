/**
 * Creates (or updates) the first admin user.
 *
 *   npm run seed:admin
 *
 * Credentials are read from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in .env so
 * no password is ever hard-coded in the repository.
 */
require('dotenv').config();

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

(async () => {
  const name = process.env.SEED_ADMIN_NAME || 'Site Owner';
  const email = (process.env.SEED_ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.SEED_ADMIN_PASSWORD || '';

  if (!email || password.length < 8) {
    console.error(
      'Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (min 8 characters) in Backend/.env first.'
    );
    process.exit(1);
  }

  await connectDB();

  const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

  const user = await User.findOneAndUpdate(
    { email },
    { $set: { name, email, password: hashedPassword, role: 'admin' } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin ready: ${user.email}`);
  await mongoose.connection.close();
  process.exit(0);
})().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
