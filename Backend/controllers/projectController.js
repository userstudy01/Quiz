const Project = require('../models/Project');
const { asyncHandler } = require('../middleware/errorHandler');
const { str, toStringArray, toBool, toInt } = require('../middleware/validate');
const { slugify } = require('../utils/slugify');

// Screenshots (which may hold base64 image data) are intentionally excluded
// from list responses to keep them light — the single-project route returns
// the full document, including screenshots, for the case study.
const PUBLIC_FIELDS =
  'title slug shortDescription category role technologies featured sortOrder createdAt liveUrl githubUrl';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Builds the public query from ?search=&category=&technology=&featured=
const buildPublicFilter = (query) => {
  const filter = { status: 'published' };

  if (query.category && query.category !== 'all') {
    filter.category = query.category;
  }

  if (query.technology && query.technology !== 'all') {
    filter.technologies = new RegExp(`^${escapeRegex(query.technology)}$`, 'i');
  }

  if (query.featured === 'true') {
    filter.featured = true;
  }

  const search = str(query.search, 120);
  if (search) {
    const re = new RegExp(escapeRegex(search), 'i');
    filter.$or = [
      { title: re },
      { shortDescription: re },
      { description: re },
      { category: re },
      { technologies: re },
      { role: re },
    ];
  }

  return filter;
};

// Normalizes admin payloads into the schema shape.
const buildProjectPayload = (body = {}) => {
  const payload = {
    title: str(body.title, 200),
    shortDescription: str(body.shortDescription, 400),
    description: str(body.description, 20000),
    category: str(body.category, 80),
    role: str(body.role, 160),
    technologies: toStringArray(body.technologies, 80),
    responsibilities: toStringArray(body.responsibilities, 500),
    features: toStringArray(body.features, 500),
    technicalWork: toStringArray(body.technicalWork, 500),
    improvements: toStringArray(body.improvements, 500),
    challenges: toStringArray(body.challenges, 500),
    solutions: toStringArray(body.solutions, 500),
    result: str(body.result, 4000),
    liveUrl: str(body.liveUrl, 500),
    githubUrl: str(body.githubUrl, 500),
    featured: toBool(body.featured),
    status: body.status === 'draft' ? 'draft' : 'published',
    sortOrder: toInt(body.sortOrder, 0),
    screenshots: Array.isArray(body.screenshots)
      ? body.screenshots
          .map((s) => ({ url: str(s?.url, 8_000_000), caption: str(s?.caption, 200) }))
          .filter((s) => s.url)
      : [],
  };

  if (body.slug) payload.slug = slugify(body.slug);
  return payload;
};

// @route GET /api/projects  (public, paginated + searchable)
const listPublicProjects = asyncHandler(async (req, res) => {
  const page = Math.max(toInt(req.query.page, 1), 1);
  const limit = Math.min(Math.max(toInt(req.query.limit, 24), 1), 100);
  const filter = buildPublicFilter(req.query);

  const [items, total] = await Promise.all([
    Project.find(filter)
      .select(PUBLIC_FIELDS)
      // Only the first screenshot travels with a list card; the full set loads
      // on the case study. Keeps list responses small even with base64 images.
      .slice('screenshots', 1)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter),
  ]);

  res.json({ items, total, page, limit, pages: Math.ceil(total / limit) || 1 });
});

// @route GET /api/projects/meta  (public: categories + technologies for filters)
const getProjectFilters = asyncHandler(async (req, res) => {
  const [categories, technologies] = await Promise.all([
    Project.distinct('category', { status: 'published' }),
    Project.distinct('technologies', { status: 'published' }),
  ]);

  res.json({
    categories: categories.filter(Boolean).sort((a, b) => a.localeCompare(b)),
    technologies: technologies.filter(Boolean).sort((a, b) => a.localeCompare(b)),
  });
});

// @route GET /api/projects/featured
const getFeaturedProjects = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(toInt(req.query.limit, 6), 1), 24);
  const items = await Project.find({ status: 'published', featured: true })
    .select(PUBLIC_FIELDS)
    .slice('screenshots', 1)
    .sort({ sortOrder: 1, createdAt: -1 })
    .limit(limit)
    .lean();

  res.json(items);
});

// @route GET /api/projects/:slug
const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    slug: slugify(req.params.slug),
    status: 'published',
  }).lean();

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json(project);
});

// ---------- Admin ----------

// @route GET /api/projects/admin/all
const listAllProjects = asyncHandler(async (req, res) => {
  // Exclude screenshots (possible base64) — the admin list never shows them.
  const items = await Project.find().select('-screenshots').sort({ sortOrder: 1, createdAt: -1 }).lean();
  res.json(items);
});

// @route GET /api/projects/admin/:id
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).lean();
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
});

// @route POST /api/projects
const createProject = asyncHandler(async (req, res) => {
  const payload = buildProjectPayload(req.body);

  if (!payload.title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  if (!payload.slug) payload.slug = slugify(payload.title);

  const exists = await Project.findOne({ slug: payload.slug }).lean();
  if (exists) {
    return res.status(409).json({ message: 'A project with this slug already exists' });
  }

  const project = await Project.create(payload);
  res.status(201).json(project);
});

// @route PUT /api/projects/:id
const updateProject = asyncHandler(async (req, res) => {
  const payload = buildProjectPayload(req.body);

  if (!payload.title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  if (!payload.slug) payload.slug = slugify(payload.title);

  const clash = await Project.findOne({
    slug: payload.slug,
    _id: { $ne: req.params.id },
  }).lean();
  if (clash) {
    return res.status(409).json({ message: 'A project with this slug already exists' });
  }

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
});

// @route DELETE /api/projects/:id
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ message: 'Project deleted', id: req.params.id });
});

// @route PATCH /api/projects/:id/flags  (publish/unpublish, feature, reorder)
const updateProjectFlags = asyncHandler(async (req, res) => {
  const update = {};
  if ('featured' in req.body) update.featured = toBool(req.body.featured);
  if ('status' in req.body) update.status = req.body.status === 'draft' ? 'draft' : 'published';
  if ('sortOrder' in req.body) update.sortOrder = toInt(req.body.sortOrder, 0);

  if (!Object.keys(update).length) {
    return res.status(400).json({ message: 'Nothing to update' });
  }

  const project = await Project.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
});

module.exports = {
  listPublicProjects,
  getProjectFilters,
  getFeaturedProjects,
  getProjectBySlug,
  listAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectFlags,
};
