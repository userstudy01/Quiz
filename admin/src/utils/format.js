export const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const isValidUrl = (value = '') => {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

// A root-relative path to a file served from Frontend/public, e.g.
// "/images/momentum/hero.jpg". This is the route for large (4K) assets: they
// live on disk and are served as files, so nothing bloats the Mongo document
// the way an inline base64 copy would.
const PUBLIC_IMAGE_PATH_RE = /^\/[\w\-./]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i;

export const isPublicImagePath = (value = '') => PUBLIC_IMAGE_PATH_RE.test(value.trim());

// Valid <img src>: a public file path, an http(s) URL, or an inline base64
// data:image URI (produced by the image uploader).
export const isImageSrc = (value = '') =>
  /^data:image\//i.test(value) || isPublicImagePath(value) || isValidUrl(value);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (value = '') => EMAIL_RE.test(String(value).trim());

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Convert a stored date value into the YYYY-MM-DD string an <input type="date">
// expects. Timezone-safe: an already-ISO date is returned verbatim (no Date
// object, so it can never shift a day under UTC), an ISO datetime keeps its
// date part, and legacy free text (e.g. "September 2024") is parsed with LOCAL
// getters. Unparseable text returns '' so the picker starts empty rather than
// showing a wrong date. Never fabricates a value for empty input.
export const formatDateForInput = (value) => {
  if (!value) return '';
  const s = String(value).trim();
  if (ISO_DATE_RE.test(s)) return s;
  const isoDateTime = s.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (isoDateTime) return isoDateTime[1];
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// True only for a real YYYY-MM-DD string; used for range validation. Because
// such strings sort chronologically, callers can compare them directly.
export const isIsoDate = (value = '') => ISO_DATE_RE.test(String(value).trim());

// Build a `mailto:` reply that opens the admin's own email client. The recipient
// is always the message sender's real address — never hardcoded.
export const buildReplyMailto = (message = {}) => {
  const subjectRaw = (message.subject || '').trim();
  const base = subjectRaw.replace(/^(re:\s*)+/i, '').trim();
  const subject = base ? `Re: ${base}` : 'Re: Your portfolio message';

  const body = `Hello ${message.name || ''},

[Type your reply here]

---
Original message:
${message.message || ''}`;

  return `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
