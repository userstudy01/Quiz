const ContactMessage = require('../models/ContactMessage');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateContact, toBool, toInt } = require('../middleware/validate');

// @route POST /api/contact (public)
const createMessage = asyncHandler(async (req, res) => {
  const { data, errors } = validateContact(req.body);

  if (errors.length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  await ContactMessage.create(data);
  res.status(201).json({ message: 'Message sent successfully. I will get back to you soon.' });
});

// @route GET /api/contact (admin)
const listMessages = asyncHandler(async (req, res) => {
  const page = Math.max(toInt(req.query.page, 1), 1);
  const limit = Math.min(Math.max(toInt(req.query.limit, 50), 1), 100);
  const filter = {};
  if (req.query.read === 'true') filter.read = true;
  if (req.query.read === 'false') filter.read = false;

  const [items, total, unread] = await Promise.all([
    ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ContactMessage.countDocuments(filter),
    ContactMessage.countDocuments({ read: false }),
  ]);

  res.json({ items, total, unread, page, limit, pages: Math.ceil(total / limit) || 1 });
});

// @route PATCH /api/contact/:id (admin) — mark read/unread
const updateMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { $set: { read: toBool(req.body.read) } },
    { new: true }
  );
  if (!message) return res.status(404).json({ message: 'Message not found' });
  res.json(message);
});

// @route DELETE /api/contact/:id (admin)
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) return res.status(404).json({ message: 'Message not found' });
  res.json({ message: 'Message deleted', id: req.params.id });
});

module.exports = { createMessage, listMessages, updateMessage, deleteMessage };
