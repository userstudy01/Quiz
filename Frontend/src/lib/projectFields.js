/**
 * Helpers for reading the fields a project document actually carries.
 *
 * `description` is stored as labelled lines by the seed importer:
 *
 *   Client: Dinesh Bhai
 *   Project type: E-commerce + CMS
 *   Overview: Books, Magazines, Articles, Audio; admin panel; ...
 *   My work: Development & Maintenance
 *   Status: In Progress
 *   Progress: 95%
 *   Reference URL: https://...
 *
 * Parsing it back out lets the case study show those values in their own
 * places instead of dumping one block of "Label: value" lines at the reader.
 * Nothing is added here — every value returned came from the database.
 *
 * If a description is not in that shape (for example after being rewritten
 * through the admin panel), `prose` holds the original text and the caller
 * renders it as plain copy.
 */

const KNOWN_LABELS = [
  'Client',
  'Project type',
  'Overview',
  'My work',
  'Status',
  'Progress',
  'Reference URL',
];

const LINE_RE = /^([A-Za-z][A-Za-z ]{1,20}):\s*(.+)$/;

export function parseDescription(description = '') {
  const text = typeof description === 'string' ? description.trim() : '';
  if (!text) return { fields: {}, prose: '' };

  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  const fields = {};
  let matched = 0;

  lines.forEach((line) => {
    const match = line.match(LINE_RE);
    if (!match) return;
    const [, label, value] = match;
    if (!KNOWN_LABELS.includes(label.trim())) return;
    fields[label.trim()] = value.trim();
    matched += 1;
  });

  // Needs at least two recognised labels before we trust the structure.
  if (matched < 2) return { fields: {}, prose: text };

  return { fields, prose: '' };
}

/** "95%" / "62.5" → 62.5. Returns null when no number is recorded. */
export function parseProgress(value) {
  if (value === undefined || value === null || value === '') return null;
  const number = Number.parseFloat(String(value).replace('%', '').trim());
  if (!Number.isFinite(number) || number < 0 || number > 100) return null;
  return number;
}

/**
 * Improvements are stored as "Remaining work: <text>". The heading above them
 * already says that, so drop the duplicated prefix for display only.
 */
export function stripRemainingPrefix(item = '') {
  return String(item).replace(/^remaining work:\s*/i, '').trim() || String(item);
}

/** The labelled `Status:` line the importer stores inside `description`. */
export const projectStatus = (project) =>
  parseDescription(project?.description).fields.Status || '';

/** Two-digit display number, from sortOrder. Never a Mongo id. */
export const projectNumber = (project, fallbackIndex = 0) =>
  String(project?.sortOrder ?? fallbackIndex + 1).padStart(2, '0');
