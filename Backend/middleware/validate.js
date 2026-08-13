// Lightweight input validation helpers (no extra dependencies).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmail = (value) => typeof value === 'string' && EMAIL_RE.test(value.trim());

const str = (value, max = 5000) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

// Accepts an array or a newline/comma separated string; always returns clean array.
const toStringArray = (value, max = 200) => {
  if (Array.isArray(value)) {
    return value.map((v) => str(v, max)).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,/)
      .map((v) => v.trim().slice(0, max))
      .filter(Boolean);
  }
  return [];
};

const toBool = (value) => value === true || value === 'true' || value === 1 || value === '1';

const toInt = (value, fallback = 0) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
};

const validateContact = (body = {}) => {
  const errors = [];
  const data = {
    name: str(body.name, 120),
    email: str(body.email, 200).toLowerCase(),
    subject: str(body.subject, 200),
    message: str(body.message, 5000),
  };

  if (data.name.length < 2) errors.push('Name must be at least 2 characters.');
  if (!isEmail(data.email)) errors.push('A valid email address is required.');
  if (data.subject.length < 2) errors.push('Subject must be at least 2 characters.');
  if (data.message.length < 10) errors.push('Message must be at least 10 characters.');

  return { data, errors };
};

module.exports = { isEmail, str, toStringArray, toBool, toInt, validateContact };
