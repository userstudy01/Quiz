/**
 * Seeds the portfolio database and drops collections left over from the
 * application this codebase was converted from.
 *
 *   npm run seed:portfolio
 *
 * Projects are upserted by slug, so re-running never creates duplicates and
 * never overwrites edits made through the admin panel unless --force is passed.
 *
 * Any project document whose slug is not in projects.data.js is obsolete (the
 * placeholder records the earlier seed created) and is removed. Only the
 * projects collection is touched; users, skills, experience, profile and
 * contact messages are never deleted.
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

// Removes project documents that are no longer part of the current dataset,
// matched by slug. Scoped to the projects collection only.
const removeObsoleteProjects = async (slugs) => {
  const obsolete = await Project.find({ slug: { $nin: slugs } })
    .select('title slug')
    .lean();

  if (!obsolete.length) return;

  for (const project of obsolete) {
    console.log(`Removing obsolete project: ${project.title} (${project.slug})`);
  }

  const { deletedCount } = await Project.deleteMany({ slug: { $nin: slugs } });
  console.log(`Removed ${deletedCount} obsolete project record(s).`);
};

(async () => {
  await connectDB();
  await dropLegacyCollections();

  const slugs = projects.map((project) => project.slug);
  await removeObsoleteProjects(slugs);

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
  const unexpected = await Project.countDocuments({ slug: { $nin: slugs } });

  console.log('---');
  console.log(`Professional projects in database: ${total}`);
  console.log(`Records outside projects.data.js: ${unexpected}`);
  console.log(
    total === slugs.length && unexpected === 0
      ? `Verification: PASS (${slugs.length} projects)`
      : 'Verification: CHECK DATA'
  );

  await mongoose.connection.close();
  process.exit(0);
})().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
