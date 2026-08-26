/**
 * The 16 professional projects.
 *
 * SOURCE OF TRUTH: "Updated_Professional_Project_Portfolio (1).xlsx", sheets
 * "Dashboard", "Master Project Tracker" and "Project Details & URLs".
 *
 * Nothing here is invented. Every value is taken from that workbook; wording is
 * only reformatted (labels, list splitting) and never rewritten. Fields the
 * workbook has no data for are intentionally left empty and are meant to be
 * completed later through the admin panel.
 *
 * Netafim, Netafim Video Portal and CraftDiscountLiquors are three separate
 * rows in the workbook and are kept as three separate projects.
 *
 * "To Be Added" in the workbook means "not recorded yet" and is treated as an
 * empty value rather than being copied into the database.
 */

// Builds one project record. Only labelled workbook columns end up in
// `description`, so the original meaning of each column stays visible.
const project = ({
  id,
  title,
  slug,
  client,
  type,
  overview,
  work,
  workStatus,
  progress,
  remaining,
  technologies = [],
  features = [],
  // Each entry is { url, caption }. `url` is a path under Frontend/public, so
  // the file is served at full resolution rather than inlined here.
  screenshots = [],
  reference = '',
  featured = false,
}) => {
  const lines = [];
  if (client) lines.push(`Client: ${client}`);
  if (type) lines.push(`Project type: ${type}`);
  if (overview) lines.push(`Overview: ${overview}`);
  if (work) lines.push(`My work: ${work}`);
  if (workStatus) lines.push(`Status: ${workStatus}`);
  if (progress) lines.push(`Progress: ${progress}%`);
  if (reference) lines.push(`Reference URL: ${reference}`);

  return {
    title,
    slug,
    shortDescription: overview || '',
    description: lines.join('\n'),
    category: type || '',
    role: work || '',
    technologies,
    responsibilities: [],
    features,
    technicalWork: [],
    improvements: remaining ? [`Remaining work: ${remaining}`] : [],
    challenges: [],
    solutions: [],
    result: workStatus ? `${workStatus} — ${progress}% complete.` : '',
    screenshots,
    liveUrl: '',
    githubUrl: '',
    featured,
    status: 'published',
    sortOrder: id,
  };
};

// `featured` follows the "High-priority / Focus Projects" list on the
// Dashboard sheet: VicharkrantiBooks, Netafim Video Portal, Vastipatrak.
const projects = [
  project({
    id: 1,
    title: 'Moments Service Pvt. Ltd.',
    slug: 'moments-service-pvt-ltd',
    client: 'Moments Service Pvt. Ltd.',
    type: 'Railway Backoffice Support',
    overview:
      'noova_obs, noova_lounge, noova_ideabox; tasks assigned/tested through Caitlin and Arjuns',
    work: 'Maintenance & Support',
    workStatus: 'Ongoing Support',
    progress: '100',
    remaining: 'Client support, bug fixes, enhancements',
    // Technology column reads "To Be Added" in the workbook.
    technologies: [],
    features: ['noova_obs', 'noova_lounge', 'noova_ideabox'],
    // Served from Frontend/public/images/momentum/ as files, so these stay at
    // full resolution instead of being inlined into the document.
    screenshots: [
      { url: '/images/momentum/home.jpg', caption: 'Home — "We speak hospitality"' },
      { url: '/images/momentum/services.jpg', caption: 'Our Services — end-to-end hospitality solutions' },
      { url: '/images/momentum/careers.jpg', caption: 'Careers — open positions' },
      { url: '/images/momentum/contact.jpg', caption: 'Contact — enquiry form and office details' },
    ],
  }),

  project({
    id: 2,
    title: 'VicharkrantiBooks',
    slug: 'vicharkrantibooks',
    client: 'Dinesh Bhai',
    type: 'E-commerce + CMS',
    overview:
      'Books, Magazines, Articles, Audio; admin panel; single/bulk Excel import; staging and production workflow',
    work: 'Development & Maintenance',
    workStatus: 'In Progress',
    progress: '95',
    remaining: 'Payment integration',
    technologies: ['PHP', 'Laravel', 'MySQL'],
    features: [
      'Books',
      'Magazines',
      'Articles',
      'Audio',
      'Admin panel',
      'Single/bulk Excel import',
      'Staging and production workflow',
    ],
    screenshots: [
      { url: '/images/vicharkrantibooks/overview.jpg', caption: 'Overview — stack and key screens' },
      { url: '/images/vicharkrantibooks/ebooks.jpg', caption: 'E-Books library with category and language filters' },
      { url: '/images/vicharkrantibooks/audiobooks.jpg', caption: 'Audio Books with inline player and playlist' },
      { url: '/images/vicharkrantibooks/dashboard.jpg', caption: 'Reader dashboard — library, reading progress, listening time' },
    ],
    featured: true,
  }),

  project({
    id: 3,
    title: 'Nilkanth Agrotech',
    slug: 'nilkanth-agrotech',
    client: 'Sunny Bhai',
    type: 'Informative Website',
    overview: 'Farming/agriculture product information website',
    work: 'Maintenance',
    workStatus: 'Completed',
    progress: '100',
    remaining: 'Add new products when required',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    screenshots: [
      { url: '/images/nilkanth/overview.jpg', caption: 'Overview — stack and key highlights' },
      { url: '/images/nilkanth/home.jpg', caption: 'Home — product range and after-sales service' },
      { url: '/images/nilkanth/products.jpg', caption: 'Products, filtered by equipment category' },
      { url: '/images/nilkanth/contact.jpg', caption: 'Contact — enquiry form and mapped location' },
    ],
  }),

  project({
    id: 4,
    title: 'Neo Tech (NSL Bathrooms)',
    slug: 'neo-tech-nsl-bathrooms',
    client: 'Parminder Bhaiya',
    type: 'Business / Product Website',
    overview: 'Support requests are infrequent',
    work: 'Maintenance',
    workStatus: 'Maintenance',
    progress: '100',
    remaining: 'Rare billing fixes or product image updates',
    technologies: ['PHP', 'Laravel'],
    screenshots: [
      { url: '/images/neotech/dashboard.jpg', caption: 'Admin dashboard — sales, stock alerts and cash flow' },
      { url: '/images/neotech/products.jpg', caption: 'Product catalogue with stock status' },
      { url: '/images/neotech/product-details.jpg', caption: 'Product details with stock, purchase and sales history' },
      { url: '/images/neotech/reports.jpg', caption: 'Reports — sales, income vs expense, top sellers' },
    ],
  }),

  project({
    id: 5,
    title: 'GJT Construction',
    slug: 'gjt-construction',
    client: 'Pragnesh Bhai / Tejas Bhai',
    type: 'Construction / Corporate Website',
    overview: 'Construction-related information website',
    work: 'Development',
    workStatus: 'Client Review',
    progress: '90',
    remaining: 'Image changes and client review feedback',
    technologies: ['PHP', 'Laravel'],
  }),

  project({
    id: 6,
    title: 'KN Infinity',
    slug: 'kn-infinity',
    client: 'Aashis Bhaiya',
    type: 'Informative Website',
    overview: 'Society and building information',
    work: 'Maintenance',
    workStatus: 'Completed',
    progress: '100',
    remaining: 'Future client-requested changes',
    technologies: ['PHP', 'Laravel'],
  }),

  project({
    id: 7,
    title: 'Maseeha Global',
    slug: 'maseeha-global',
    client: 'Aashis Bhaiya',
    type: 'Informative Website',
    overview: 'Seed-related information website',
    work: 'Maintenance',
    workStatus: 'Completed',
    progress: '100',
    remaining: 'Future client-requested changes',
    technologies: ['PHP', 'Laravel'],
  }),

  project({
    id: 8,
    title: 'MyMaseeha',
    slug: 'mymaseeha',
    client: 'Aashis Bhaiya',
    type: 'E-commerce + Admin Panel',
    overview: 'Informational + e-commerce website with admin panel and product management',
    work: 'Maintenance',
    workStatus: 'Completed',
    progress: '100',
    remaining: 'Future client-requested changes',
    technologies: ['PHP', 'Laravel'],
    features: ['Admin panel', 'Product management'],
  }),

  project({
    id: 9,
    title: 'RR Industry',
    slug: 'rr-industry',
    client: 'Dirgeesh Bhai',
    type: 'Corporate Website',
    overview: 'Completed WordPress website',
    work: 'Maintenance',
    workStatus: 'Completed',
    progress: '100',
    remaining: 'Future maintenance if required',
    technologies: ['WordPress'],
  }),

  project({
    id: 10,
    title: 'Vadiya Doors',
    slug: 'vadiya-doors',
    client: 'Bhavik Sir (Reference)',
    type: 'Website + Admin Panel',
    overview: 'Doors information website with admin panel',
    work: 'Development',
    workStatus: 'Almost Complete',
    progress: '98',
    remaining: 'Push responsive changes from local to production',
    technologies: ['React.js', 'PHP Laravel', 'MySQL'],
    features: ['Admin panel'],
  }),

  project({
    id: 11,
    title: 'Netafim Video Portal',
    slug: 'netafim-video-portal',
    client: 'Bhavik Sir',
    type: 'Knowledge Sharing / Video Portal',
    overview:
      '16 phases planned; 10 complete. Video repository, search/filter, persona access, points, courses, quiz and certification',
    work: 'Development & Testing',
    workStatus: 'Development + Testing',
    progress: '62.5',
    remaining: 'Phases 11-16 and remaining testing',
    // Technology column reads "To Be Added" in the workbook.
    technologies: [],
    features: [
      'Video repository',
      'Search/filter',
      'Persona access',
      'Points',
      'Courses',
      'Quiz and certification',
    ],
    featured: true,
  }),

  project({
    id: 12,
    title: 'Netafim',
    slug: 'netafim',
    // Client column reads "To Be Added" in the workbook.
    type: 'Application Support',
    overview: 'Separate from Netafim Video Portal; troubleshooting and issue resolution',
    work: 'Call Support / Maintenance',
    workStatus: 'Ongoing Support',
    progress: '100',
    remaining: 'Resolve issues reported through support calls',
    technologies: ['PHP', 'Laravel'],
  }),

  project({
    id: 13,
    title: 'CraftDiscountLiquors',
    slug: 'craftdiscountliquors',
    // Client column reads "To Be Added" in the workbook.
    type: 'Admin Panel Enhancement',
    overview: 'Existing admin panel; Excel format changes and upload using revised format',
    work: 'Enhancement',
    workStatus: 'Completed',
    progress: '100',
    remaining: 'Future changes if required',
    // Technology column reads "To Be Added" in the workbook.
    technologies: [],
  }),

  project({
    id: 14,
    title: 'Umaswadum',
    slug: 'umaswadum',
    // Client column reads "To Be Added" in the workbook.
    type: 'Web Application + Admin Panel',
    overview: 'New admin panel developed by user; remaining module details can be added later',
    work: 'Admin Panel Development',
    workStatus: 'In Progress',
    progress: '0',
    remaining: 'Continue admin panel modules; exact progress to be updated',
    technologies: ['Flutter'],
  }),

  project({
    id: 15,
    title: 'MGL Pharma - Jiva Ayurveda Clone',
    slug: 'mgl-pharma-jiva-ayurveda-clone',
    // Client column reads "To Be Added" in the workbook.
    type: 'Website Clone + Admin Panel',
    overview:
      'Clone developed for MGL Pharma with admin panel. Reference site supplied by user: Jiva Ayurveda',
    work: 'Development',
    workStatus: 'Completed',
    progress: '100',
    remaining: 'Future changes if required',
    technologies: ['PHP', 'Laravel'],
    features: ['Admin panel'],
    // "Reference URL" column. This is the reference site, not a URL of my work,
    // so it is not stored as liveUrl.
    reference: 'https://ayurveda.jiva.com/jiva-ayurveda/',
  }),

  project({
    id: 16,
    title: 'Vastipatrak',
    slug: 'vastipatrak',
    // Client column reads "To Be Added" in the workbook.
    type: 'Web Application + Admin Panel',
    overview:
      'Flutter frontend + PHP Laravel backend. Family information: family members, residence, business and related details',
    work: 'Admin Panel Development',
    workStatus: 'In Progress',
    progress: '0',
    remaining: 'Continue admin panel development and remaining modules',
    technologies: ['Flutter', 'PHP', 'Laravel'],
    featured: true,
  }),
];

module.exports = projects;
