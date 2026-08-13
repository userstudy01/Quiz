/**
 * Seeds the portfolio database and drops collections left over from the
 * application this codebase was converted from.
 *
 *   npm run seed:portfolio
 *
 * Projects are upserted by slug, so re-running never creates duplicates and
 * never overwrites edits made through the admin panel unless --force is passed.
 */
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Project = require('../models/Project');
const Profile = require('../models/Profile');
const projects = require('./projects.data');

const LEGACY_COLLECTIONS = ['questions', 'evaluations'];
const force = process.argv.includes('--force');

const dropLegacyCollections = async () => {
  const existing = await mongoose.connection.db.listCollections().toArray();
  const names = existing.map((c) => c.name);

  for (const name of LEGACY_COLLECTIONS) {
    if (names.includes(name)) {
      await mongoose.connection.db.dropCollection(name);
      console.log(`Dropped legacy collection: ${name}`);
    }
  }
};

(async () => {
  await connectDB();
  await dropLegacyCollections();

  for (const project of projects) {
    if (force) {
      await Project.findOneAndUpdate(
        { slug: project.slug },
        { $set: project },
        { upsert: true, setDefaultsOnInsert: true }
      );
    } else {
      await Project.findOneAndUpdate(
        { slug: project.slug },
        { $setOnInsert: project },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }
  }

  // Ensure a single profile document exists for the admin panel to edit.
  const profileCount = await Profile.countDocuments();
  if (profileCount === 0) {
    await Profile.create({});
    console.log('Created empty profile document.');
  }

  const total = await Project.countDocuments();
  console.log('---');
  console.log(`Professional projects in database: ${total}`);
  console.log(total === 16 ? 'Verification: PASS (16 projects)' : 'Verification: CHECK DATA');

  await mongoose.connection.close();
  process.exit(0);
})().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
