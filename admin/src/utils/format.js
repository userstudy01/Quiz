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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (value = '') => EMAIL_RE.test(String(value).trim());

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
