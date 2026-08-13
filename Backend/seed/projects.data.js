/**
 * The 16 professional projects.
 *
 * IMPORTANT: nothing here is invented. Only project names that were explicitly
 * supplied are filled in; every other field is intentionally left empty and is
 * meant to be completed from the real project data, either by editing this file
 * and re-running `npm run seed:portfolio`, or through the admin panel.
 *
 * Netafim and Netafim Video Portal are deliberately kept as two separate
 * projects.
 */

const empty = {
  shortDescription: '',
  description: '',
  category: '',
  role: '',
  technologies: [],
  responsibilities: [],
  features: [],
  technicalWork: [],
  improvements: [],
  challenges: [],
  solutions: [],
  result: '',
  screenshots: [],
  liveUrl: '',
  githubUrl: '',
};

const placeholder = (index) => ({
  ...empty,
  title: `Project ${String(index).padStart(2, '0')}`,
  slug: `project-${String(index).padStart(2, '0')}`,
  featured: false,
  status: 'published',
  sortOrder: index,
});

const projects = [
  { ...empty, title: 'Netafim', slug: 'netafim', featured: true, status: 'published', sortOrder: 1 },
  {
    ...empty,
    title: 'Netafim Video Portal',
    slug: 'netafim-video-portal',
    featured: true,
    status: 'published',
    sortOrder: 2,
  },
  {
    ...empty,
    title: 'CraftDiscountLiquors',
    slug: 'craftdiscountliquors',
    featured: true,
    // Describe only the work actually performed on this project.
    role: '',
    status: 'published',
    sortOrder: 3,
  },
  ...Array.from({ length: 13 }, (_, i) => placeholder(i + 4)),
];

module.exports = projects;
