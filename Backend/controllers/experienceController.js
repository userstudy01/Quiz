const Experience = require('../models/Experience');
const { asyncHandler } = require('../middleware/errorHandler');
const { str, toStringArray, toBool, toInt } = require('../middleware/validate');

const buildPayload = (body = {}) => ({
  company: str(body.company, 160),
  role: str(body.role, 160),
  location: str(body.location, 160),
  employmentType: str(body.employmentType, 80),
  startDate: str(body.startDate, 40),
  endDate: str(body.endDate, 40),
  current: toBool(body.current),
  summary: str(body.summary, 4000),
  highlights: toStringArray(body.highlights, 500),
  technologies: toStringArray(body.technologies, 80),
  sortOrder: toInt(body.sortOrder, 0),
  visible: 'visible' in body ? toBool(body.visible) : true,
});

// @route GET /api/experience (public)
const listPublicExperience = asyncHandler(async (req, res) => {
  const items = await Experience.find({ visible: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();
  res.json(items);
});

const listAllExperience = asyncHandler(async (req, res) => {
  const items = await Experience.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  res.json(items);
});

const createExperience = asyncHandler(async (req, res) => {
  const payload = buildPayload(req.body);
  if (!payload.company || !payload.role) {
    return res.status(400).json({ message: 'Company and role are required' });
  }
  const item = await Experience.create(payload);
  res.status(201).json(item);
});

const updateExperience = asyncHandler(async (req, res) => {
  const payload = buildPayload(req.body);
  if (!payload.company || !payload.role) {
    return res.status(400).json({ message: 'Company and role are required' });
  }
  const item = await Experience.findByIdAndUpdate(
    req.params.id,
    { $set: payload },
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: 'Experience entry not found' });
  res.json(item);
});

const deleteExperience = asyncHandler(async (req, res) => {
  const item = await Experience.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Experience entry not found' });
  res.json({ message: 'Experience entry deleted', id: req.params.id });
});

const reorderExperience = asyncHandler(async (req, res) => {
  const order = Array.isArray(req.body.order) ? req.body.order : [];
  if (!order.length) return res.status(400).json({ message: 'order array is required' });

  await Experience.bulkWrite(
    order.map((row, index) => ({
      updateOne: {
        filter: { _id: row.id },
        update: { $set: { sortOrder: toInt(row.sortOrder, index) } },
      },
    }))
  );

  res.json({ message: 'Order updated' });
});

module.exports = {
  listPublicExperience,
  listAllExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperience,
};
