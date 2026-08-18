const mongoose = require('mongoose');

// Privacy-conscious analytics event. Stores no IP address and no personal data:
// the visitor is identified only by an anonymous, client-generated id used for
// unique-visitor deduplication.
const pageViewSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, trim: true, maxlength: 300, index: true },
    projectSlug: { type: String, trim: true, default: '', index: true },
    visitorId: { type: String, required: true, trim: true, maxlength: 64, index: true },
    referrer: { type: String, trim: true, default: '', maxlength: 200 },
    device: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'unknown'],
      default: 'unknown',
    },
  },
  { timestamps: true }
);

pageViewSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PageView', pageViewSchema);
