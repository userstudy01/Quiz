/* ==========================================================================
   Technology marks.

   Small drawn glyphs that sit beside a technology name. They are *marks in
   this site's own hand* — a database cylinder for MySQL, an atom for React —
   rather than reproductions of anyone's brand logo, and they inherit
   `currentColor` so they carry the theme like every other stroke on the site.

   A technology with no mark falls back to its initials in a ruled square, so
   the index never has a hole in it and no technology is invented to fill one.
   Every name that reaches this component came from the API.
   ========================================================================== */

const MARKS = {
  php: (
    <>
      <ellipse cx="12" cy="12" rx="10" ry="6.4" />
      <path d="M8 9.5 6.8 14.5M8 9.5h2.2a1.4 1.4 0 0 1 0 2.8H7.5M15.2 9.5 14 14.5M15.2 9.5h2.2a1.4 1.4 0 0 1 0 2.8h-2.8" />
    </>
  ),
  /* A single clean isometric block: it stays readable at 16px, where the
     multi-facet version turned to noise. */
  laravel: (
    <>
      <path d="M12 3.2 20 7.6v8.8L12 20.8 4 16.4V7.6z" />
      <path d="m4 7.6 8 4.4 8-4.4M12 12v8.8" />
    </>
  ),
  mysql: (
    <>
      <ellipse cx="12" cy="6.4" rx="7.6" ry="3.2" />
      <path d="M4.4 6.4v11.2c0 1.8 3.4 3.2 7.6 3.2s7.6-1.4 7.6-3.2V6.4" />
      <path d="M4.4 12c0 1.8 3.4 3.2 7.6 3.2s7.6-1.4 7.6-3.2" />
    </>
  ),
  html: (
    <>
      <path d="m8.6 7-5 5 5 5M15.4 7l5 5-5 5" />
      <path d="m13.4 5.4-2.8 13.2" />
    </>
  ),
  css: (
    <>
      <path d="M4.6 3.6h14.8l-1.4 15.2L12 20.4l-6-1.6z" />
      <path d="M8.2 7.8h7.6M8.6 11.6h6.8l-.4 4L12 16.6l-3-.9" />
    </>
  ),
  javascript: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="2.4" />
      <path d="M10 8.6v6.2a1.8 1.8 0 0 1-3.6 0" />
      <path d="M17.8 9.4a2.2 2.2 0 0 0-3.8 1.4c0 2.4 3.8 1.6 3.8 4a2.2 2.2 0 0 1-3.9 1.3" />
    </>
  ),
  wordpress: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m5.2 8.2 4 10.4 2.4-6.4M12.2 5.2l3.6 13.4 2.6-7.6a5 5 0 0 0-.4-4.2" />
    </>
  ),
  react: (
    <>
      <circle cx="12" cy="12" r="2.1" />
      <ellipse cx="12" cy="12" rx="9.4" ry="3.8" />
      <ellipse cx="12" cy="12" rx="9.4" ry="3.8" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.4" ry="3.8" transform="rotate(120 12 12)" />
    </>
  ),
  flutter: (
    <>
      <path d="M14.6 2.6 5.2 12l3 3 12.4-12.4z" />
      <path d="M14.6 11.4 9.4 16.6l5.2 5.2h6L15.4 16.6l5.2-5.2z" />
    </>
  ),
  node: (
    <>
      <path d="M12 2.6 20.4 7v10L12 21.4 3.6 17V7z" />
      <path d="M9.4 15.2a2.2 2.2 0 0 0 4.2-.9c0-2.6-4-1.6-4-4.2a2.2 2.2 0 0 1 4.2-.8" />
    </>
  ),
  tailwind: (
    <>
      <path d="M3.4 12c1.2-3.6 3.4-5.4 6.6-5.4 4.8 0 5.4 3.6 7.8 4.2 1.6.4 3-.2 4.2-1.8-1.2 3.6-3.4 5.4-6.6 5.4-4.8 0-5.4-3.6-7.8-4.2-1.6-.4-3 .2-4.2 1.8z" />
      <path d="M3.4 19.2c1.2-3.6 3.4-5.4 6.6-5.4" />
    </>
  ),
  git: (
    <>
      <path d="M12 2.6 21.4 12 12 21.4 2.6 12z" />
      <circle cx="12" cy="8.6" r="1.6" />
      <circle cx="12" cy="15.4" r="1.6" />
      <circle cx="15.6" cy="12" r="1.6" />
      <path d="M12 10.2v3.6M13.4 13.9 14.6 13" />
    </>
  ),
  api: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="3.8" r="1.8" />
      <circle cx="19.1" cy="16" r="1.8" />
      <circle cx="4.9" cy="16" r="1.8" />
      <path d="M12 5.6V9M14.5 13.6l3 1.6M9.5 13.6l-3 1.6" />
    </>
  ),
};

/* Longest match first, so "PHP Laravel" resolves to Laravel rather than PHP
   and "React.js" resolves to React. */
const ALIASES = [
  [/laravel/i, 'laravel'],
  [/tailwind/i, 'tailwind'],
  [/wordpress|wp\b/i, 'wordpress'],
  [/react/i, 'react'],
  [/flutter|dart/i, 'flutter'],
  [/node|express/i, 'node'],
  [/mysql|mongo|postgres|sql|database/i, 'mysql'],
  [/javascript|typescript|\bjs\b|\bts\b/i, 'javascript'],
  [/html/i, 'html'],
  [/\bcss\b|sass|scss|bootstrap/i, 'css'],
  [/\bgit\b|github/i, 'git'],
  [/api|rest|graphql/i, 'api'],
  [/php/i, 'php'],
];

function initials(name = '') {
  const clean = name.replace(/[^\p{L}\p{N} ]/gu, ' ').trim();
  if (!clean) return '—';
  const words = clean.split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * @param {string} name  the technology exactly as the API returned it
 * @param {string} size  Tailwind sizing classes for the mark's box
 */
export default function TechMark({ name = '', className = '' }) {
  const key = ALIASES.find(([re]) => re.test(name))?.[1];
  const glyph = key ? MARKS[key] : null;

  if (!glyph) {
    return (
      <span
        aria-hidden="true"
        className={`grid shrink-0 place-items-center rounded-control border border-line font-mono text-[0.625rem] tracking-[0.08em] text-ink-subtle transition-colors duration-200 ease-smooth group-hover:border-line-strong group-hover:text-accent ${className}`}
      >
        {initials(name)}
      </span>
    );
  }

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 text-ink-subtle transition-colors duration-200 ease-smooth group-hover:text-accent ${className}`}
    >
      {glyph}
    </svg>
  );
}
