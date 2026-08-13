const mongoose = require('mongoose');
const { slugify } = require('../utils/slugify');

const screenshotSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    caption: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true, lowercase: true, trim: true },
    shortDescription: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, default: '', index: true },
    role: { type: String, trim: true, default: '' },
    technologies: [{ type: String, trim: true }],
    responsibilities: [{ type: String, trim: true }],
    features: [{ type: String, trim: true }],
    technicalWork: [{ type: String, trim: true }],
    improvements: [{ type: String, trim: true }],
    challenges: [{ type: String, trim: true }],
    solutions: [{ type: String, trim: true }],
    result: { type: String, trim: true, default: '' },
    screenshots: { type: [screenshotSchema], default: [] },
    liveUrl: { type: String, trim: true, default: '' },
    githubUrl: { type: String, trim: true, default: '' },
    featured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
      index: true,
    },
    sortOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

// Text index powers keyword search across name / description / tech / category.
projectSchema.index({
  title: 'text',
  shortDescription: 'text',
  description: 'text',
  technologies: 'text',
  category: 'text',
});

projectSchema.pre('validate', function generateSlug() {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  } else if (this.slug) {
    this.slug = slugify(this.slug);
  }
});

module.exports = mongoose.model('Project', projectSchema);
