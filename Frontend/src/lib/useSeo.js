import { useEffect } from 'react';

/* ==========================================================================
   Per-page document head.

   This is a client-rendered site, so crawlers and link-preview bots that do
   run JavaScript read what this hook writes, and the ones that do not fall
   back to the static tags in index.html. Both paths need to be true, which is
   why nothing here is invented: every value passed in comes from the profile
   document or the project record, and an empty field simply leaves the
   previous tag alone rather than writing a placeholder.
   ========================================================================== */

const SITE_NAME = 'Developer Portfolio';

/* Shipped in /public, so a share card exists even before a profile image
   does. Resolved against the site origin because Open Graph requires an
   absolute URL. */
const DEFAULT_IMAGE = '/og-image.png';

const siteOrigin = () =>
  (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/+$/, '');

const absolute = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  // An inline data: URI has no origin to resolve against, and crawlers cannot
  // fetch one anyway, so it is not usable as a share image.
  if (/^data:/i.test(path)) return '';
  return `${siteOrigin()}${path.startsWith('/') ? '' : '/'}${path}`;
};

const setMeta = (selector, attr, key, content) => {
  if (!content) return;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const setCanonical = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

/* One structured-data block at a time: the previous page's script is replaced
   rather than appended, so a session of navigation cannot leave several
   contradictory descriptions of the site in the document. */
const setJsonLd = (data) => {
  const existing = document.head.querySelector('script[data-seo-jsonld]');
  if (!data) {
    existing?.remove();
    return;
  }

  const script = existing || document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.setAttribute('data-seo-jsonld', '');
  script.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(script);
};

/**
 * Sets document title, meta description, Open Graph / Twitter tags, the
 * canonical URL and an optional JSON-LD block.
 */
export default function useSeo({ title, description, image, type = 'website', jsonLd } = {}) {
  /* Objects are rebuilt on every render, so the effect keys off the
     serialised form — otherwise it would rewrite the head each pass. */
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    const url = `${siteOrigin()}${window.location.pathname}`;
    const shareImage = absolute(image) || absolute(DEFAULT_IMAGE);

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', type);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[property="og:image"]', 'property', 'og:image', shareImage);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', shareImage);

    setCanonical(url);
    setJsonLd(jsonLdKey ? JSON.parse(jsonLdKey) : null);
  }, [title, description, image, type, jsonLdKey]);
}

/* --- Structured data builders --------------------------------------------- *
 * Both drop every empty field before returning, so the markup never asserts
 * something the database does not hold.                                      */

const compact = (object) =>
  Object.fromEntries(
    Object.entries(object).filter(([, value]) =>
      Array.isArray(value) ? value.length : value !== undefined && value !== null && value !== ''
    )
  );

/** Person + WebSite for the home page. Person is omitted when unnamed. */
export function portfolioJsonLd(profile) {
  const origin = (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, '');

  const website = compact({
    '@type': 'WebSite',
    name: profile?.name ? `${profile.name} — Portfolio` : SITE_NAME,
    url: origin,
    description: profile?.tagline || profile?.bio || undefined,
  });

  if (!profile?.name) return { '@context': 'https://schema.org', ...website };

  const person = compact({
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    description: profile.bio || profile.tagline,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    telephone: profile.phone,
    image: profile.profileImage ? absolute(profile.profileImage) : undefined,
    address: profile.location ? { '@type': 'PostalAddress', addressLocality: profile.location } : undefined,
    sameAs: (profile.socialLinks || []).map((link) => link.url).filter(Boolean),
    knowsAbout: profile.strengths || [],
    url: origin,
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [person, { ...website, author: { '@type': 'Person', name: profile.name } }],
  };
}

/** CreativeWork for one case study. */
export function projectJsonLd(project) {
  if (!project?.title) return undefined;

  return compact({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.shortDescription,
    genre: project.category,
    keywords: (project.technologies || []).join(', '),
    url: project.liveUrl || undefined,
    image: absolute(project.screenshots?.[0]?.url) || undefined,
  });
}
