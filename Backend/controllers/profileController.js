const Profile = require('../models/Profile');
const { asyncHandler } = require('../middleware/errorHandler');
const { str, toStringArray } = require('../middleware/validate');

// @route GET /api/profile (public)
const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne().lean();
  res.json(profile || {});
});

// @route PUT /api/profile (admin) — upserts the single profile document
const updateProfile = asyncHandler(async (req, res) => {
  const body = req.body || {};

  const payload = {
    name: str(body.name, 120),
    title: str(body.title, 160),
    tagline: str(body.tagline, 300),
    bio: str(body.bio, 8000),
    profileImage: str(body.profileImage, 1000),
    email: str(body.email, 200).toLowerCase(),
    phone: str(body.phone, 60),
    location: str(body.location, 160),
    resumeUrl: str(body.resumeUrl, 1000),
    strengths: toStringArray(body.strengths, 300),
    socialLinks: Array.isArray(body.socialLinks)
      ? body.socialLinks
          .map((link) => ({ label: str(link?.label, 60), url: str(link?.url, 1000) }))
          .filter((link) => link.label && link.url)
      : [],
  };

  const profile = await Profile.findOneAndUpdate(
    {},
    { $set: payload },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.json(profile);
});

module.exports = { getProfile, updateProfile };
