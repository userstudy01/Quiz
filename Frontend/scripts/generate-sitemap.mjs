/**
 * Writes public/sitemap.xml before a build.
 *
 * The static routes are known from the router. Project URLs are not — they are
 * slugs in the database — so this asks the live API for them. If the API is
 * unreachable (it sleeps when idle, and CI may have no network), the script
 * still writes the static routes and exits 0: a partial sitemap is useful and
 * a failed deploy is not.
 *
 * Nothing is invented here. A project URL is only listed when the API returned
 * that project.
 */

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SITE =
  (process.env.VITE_SITE_URL || 'https://piyush250-portfolio24.vercel.app').replace(/\/+$/, '');
const API =
  (process.env.VITE_API_URL || 'https://quiz-1-37u4.onrender.com/api').replace(/\/+$/, '');

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/projects', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/skills', priority: '0.6', changefreq: 'monthly' },
  { path: '/experience', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.5', changefreq: 'yearly' },
];

const escape = (value) =>
  String(value).replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c])
  );

async function projectRoutes() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20_000);
    const response = await fetch(`${API}/projects?limit=100`, { signal: controller.signal });
    clearTimeout(timer);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const body = await response.json();
    return (body.items || [])
      .filter((project) => project.slug)
      .map((project) => ({
        path: `/projects/${project.slug}`,
        priority: project.featured ? '0.8' : '0.7',
        changefreq: 'monthly',
        lastmod: project.updatedAt ? String(project.updatedAt).slice(0, 10) : undefined,
      }));
  } catch (error) {
    console.warn(`[sitemap] project routes skipped: ${error.message}`);
    return [];
  }
}

const routes = [...STATIC_ROUTES, ...(await projectRoutes())];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(({ path, priority, changefreq, lastmod }) =>
    [
      '  <url>',
      `    <loc>${escape(SITE + path)}</loc>`,
      lastmod ? `    <lastmod>${escape(lastmod)}</lastmod>` : null,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n')
  )
  .join('\n')}
</urlset>
`;

const target = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sitemap.xml');
await writeFile(target, xml, 'utf8');
console.log(`[sitemap] ${routes.length} URLs written to public/sitemap.xml`);
