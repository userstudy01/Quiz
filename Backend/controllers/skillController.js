const Skill = require('../models/Skill');
const { asyncHandler } = require('../middleware/errorHandler');
const { str, toBool, toInt } = require('../middleware/validate');

const buildPayload = (body = {}) => ({
  name: str(body.name, 80),
  category: str(body.category, 80),
  level: str(body.level, 40),
  sortOrder: toInt(body.sortOrder, 0),
  visible: 'visible' in body ? toBool(body.visible) : true,
});

// @route GET /api/skills  (public, grouped by category)
const listPublicSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({ visible: true }).sort({ sortOrder: 1, name: 1 }).lean();

  const grouped = skills.reduce((acc, skill) => {
    const key = skill.category || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  res.json({
    items: skills,
    groups: Object.entries(grouped).map(([category, items]) => ({ category, items })),
  });
});

// @route GET /api/skills/admin/all
const listAllSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find().sort({ sortOrder: 1, name: 1 }).lean();
  res.json(skills);
});

const createSkill = asyncHandler(async (req, res) => {
  const payload = buildPayload(req.body);
  if (!payload.name || !payload.category) {
    return res.status(400).json({ message: 'Name and category are required' });
  }
  const skill = await Skill.create(payload);
  res.status(201).json(skill);
});

const updateSkill = asyncHandler(async (req, res) => {
  const payload = buildPayload(req.body);
  if (!payload.name || !payload.category) {
    return res.status(400).json({ message: 'Name and category are required' });
  }
  const skill = await Skill.findByIdAndUpdate(
    req.params.id,
    { $set: payload },
    { new: true, runValidators: true }
  );
  if (!skill) return res.status(404).json({ message: 'Skill not found' });
  res.json(skill);
});

const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) return res.status(404).json({ message: 'Skill not found' });
  res.json({ message: 'Skill deleted', id: req.params.id });
});

// @route PUT /api/skills/reorder  body: { order: [{ id, sortOrder }] }
const reorderSkills = asyncHandler(async (req, res) => {
  const order = Array.isArray(req.body.order) ? req.body.order : [];
  if (!order.length) return res.status(400).json({ message: 'order array is required' });

  await Skill.bulkWrite(
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
  listPublicSkills,
  listAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
};
