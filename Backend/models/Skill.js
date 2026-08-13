const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    level: { type: String, trim: true, default: '' },
    sortOrder: { type: Number, default: 0, index: true },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, sortOrder: 1 });

module.exports = mongoose.model('Skill', skillSchema);
