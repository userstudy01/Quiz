const PageView = require('../models/PageView');
const Project = require('../models/Project');
const ContactMessage = require('../models/ContactMessage');
const { asyncHandler } = require('../middleware/errorHandler');
const { str } = require('../middleware/validate');

// Coarse device category from the User-Agent — no fingerprinting, no UA stored.
const deviceFromUA = (ua = '') => {
  const s = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) return 'tablet';
  if (/mobi|iphone|ipod|android|blackberry|iemobile|opera mini/.test(s)) return 'mobile';
  if (s) return 'desktop';
  return 'unknown';
};

// Keep only the referrer hostname, and drop our own origin.
const cleanReferrer = (raw, selfHost) => {
  const value = str(raw, 400);
  if (!value) return '';
  try {
    const host = new URL(value).hostname;
    if (!host || host === selfHost) return '';
    return host.slice(0, 200);
  } catch {
    return '';
  }
};

const rangeStart = (range) => {
  const now = new Date();
  if (range === 'today') {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (range === '7d') return new Date(now.getTime() - 7 * 864e5);
  if (range === 'all') return new Date(0);
  return new Date(now.getTime() - 30 * 864e5); // default 30d
};

// @route POST /api/analytics/track  (public, fire-and-forget)
const track = asyncHandler(async (req, res) => {
  // Beacons arrive as a text/plain JSON string; JSON posts arrive as an object.
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body && typeof body === 'object' ? body : {};

  const path = str(body.path, 300);
  const visitorId = str(body.visitorId, 64);
  if (!path || !visitorId) {
    return res.status(400).json({ message: 'path and visitorId are required' });
  }

  const selfHost = (() => {
    try {
      return new URL(process.env.CLIENT_URL || '').hostname;
    } catch {
      return '';
    }
  })();

  await PageView.create({
    path,
    projectSlug: str(body.projectSlug, 200),
    visitorId,
    referrer: cleanReferrer(body.referrer, selfHost),
    device: deviceFromUA(req.headers['user-agent']),
  });

  res.status(204).end();
});

// @route GET /api/analytics/summary?range=today|7d|30d|all  (admin only)
const summary = asyncHandler(async (req, res) => {
  const range = ['today', '7d', '30d', 'all'].includes(req.query.range) ? req.query.range : '30d';
  const start = rangeStart(range);
  const match = { createdAt: { $gte: start } };

  const [totalViews, uniqueVisitorIds, projectViews, messages, series, topRaw, devices, referrersRaw] =
    await Promise.all([
      PageView.countDocuments(match),
      PageView.distinct('visitorId', match),
      PageView.countDocuments({ ...match, projectSlug: { $ne: '' } }),
      ContactMessage.countDocuments({ createdAt: { $gte: start } }),
      PageView.aggregate([
        { $match: match },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      PageView.aggregate([
        { $match: { ...match, projectSlug: { $ne: '' } } },
        { $group: { _id: '$projectSlug', views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 8 },
      ]),
      PageView.aggregate([
        { $match: match },
        { $group: { _id: '$device', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      // Referrer hostnames only (never full URLs / IPs); empty = direct traffic.
      PageView.aggregate([
        { $match: { ...match, referrer: { $ne: '' } } },
        { $group: { _id: '$referrer', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
    ]);

  // Attach real project titles to the top-project slugs.
  const slugs = topRaw.map((t) => t._id);
  const titleBySlug = new Map(
    (await Project.find({ slug: { $in: slugs } }).select('slug title').lean()).map((p) => [p.slug, p.title])
  );

  res.json({
    range,
    totals: {
      views: totalViews,
      uniqueVisitors: uniqueVisitorIds.length,
      projectViews,
      messages,
    },
    series: series.map((s) => ({ date: s._id, count: s.count })),
    topProjects: topRaw.map((t) => ({ slug: t._id, title: titleBySlug.get(t._id) || t._id, views: t.views })),
    devices: devices.map((d) => ({ device: d._id || 'unknown', count: d.count })),
    referrers: referrersRaw.map((r) => ({ host: r._id, count: r.count })),
  });
});

module.exports = { track, summary };
