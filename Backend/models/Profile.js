const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false }
);

// Single-document collection: the site owner's public profile.
const profileSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    title: { type: String, trim: true, default: '' },
    tagline: { type: String, trim: true, default: '' },
    bio: { type: String, trim: true, default: '' },
    profileImage: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    resumeUrl: { type: String, trim: true, default: '' },
    socialLinks: { type: [socialLinkSchema], default: [] },
    strengths: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
