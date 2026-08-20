/**
 * Deterministic artwork for projects that have no uploaded screenshot.
 *
 * The rule this file exists to enforce: a project without a screenshot gets a
 * *plate* — a printed-looking panel carrying a drawn motif for the project's
 * own subject, its index and its monogram. It is unmistakably a graphic, never
 * a mock UI, and never a stock photo. The same project always produces the same
 * plate, so the archive reads as a designed set rather than random decoration.
 *
 * Colours come from the theme (`--plate-*`, `--color-ink`, `--color-accent`),
 * so the plates belong to whichever theme is active instead of carrying their
 * own palette.
 *
 * Nothing here reads or invents project data: the domain is derived only from
 * the category, overview and technologies the API already returned.
 */

const PATTERNS = [
  // Fine diagonal hatch
  'repeating-linear-gradient(45deg, var(--plate-rule) 0 1px, transparent 1px 14px)',
  // Ruled horizontal lines, ledger-style
  'repeating-linear-gradient(0deg, var(--plate-rule) 0 1px, transparent 1px 16px)',
  // Engineering grid
  'linear-gradient(90deg, var(--plate-rule) 0 1px, transparent 1px), linear-gradient(0deg, var(--plate-rule) 0 1px, transparent 1px)',
  // Halftone dot field
  'radial-gradient(var(--plate-mark) 1.4px, transparent 1.5px)',
  // Concentric arcs
  'repeating-radial-gradient(circle at 22% 78%, transparent 0 22px, var(--plate-rule) 22px 23px)',
  // Vertical columns
  'repeating-linear-gradient(90deg, var(--plate-rule) 0 1px, transparent 1px 22px)',
];

const SIZES = ['auto', 'auto', '34px 34px', '18px 18px', 'auto', 'auto'];

function hash(value = '') {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** "Netafim Video Portal" → "NV"; single words keep two letters. */
export function monogram(title = '') {
  const words = title.replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(Boolean);
  if (!words.length) return '—';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * CSS custom properties for the `.plate` utility, derived from the project's
 * own identity. Spread onto the element's `style`.
 */
export function plateStyle(project) {
  const key = project?.slug || project?.title || '';
  const index = hash(key) % PATTERNS.length;
  const angle = -8 + (hash(`${key}-angle`) % 17);

  return {
    '--plate-pattern': PATTERNS[index],
    '--plate-size': SIZES[index],
    '--plate-angle': `${angle}deg`,
  };
}

/* --- Subject ------------------------------------------------------------- *
 * Which motif a project is drawn with. Matched against the text the database
 * already holds — category first, because that is the field the workbook filled
 * in most reliably, then the overview, title and technologies.
 *
 * Order matters: the first rule that matches wins, so the more specific
 * subjects are listed above the generic web ones.                            */

const SUBJECT_RULES = [
  ['agriculture', /agri|farm|irrigat|seed|crop|agro|drip/],
  ['video', /video|stream|media|course|quiz|certificat|knowledge shar|learning/],
  ['health', /pharma|ayurved|medic|health|clinic|hospital|wellness/],
  ['construction', /construct|building|society|infra|architect|door|bathroom|interior/],
  ['commerce', /e-?commerce|shop|store|retail|catalog|product management|liquor|cart/],
  ['publishing', /book|magazine|article|audio|cms|content|publish/],
  ['support', /support|maintenance|helpdesk|backoffice|back office|troubleshoot|call/],
  ['mobile', /flutter|react native|android|ios|mobile|app\b/],
  ['dashboard', /admin panel|dashboard|panel|report|excel|import/],
  ['corporate', /corporate|business|company|industry|enterprise/],
];

/**
 * The motif key for a project. Deterministic and data-derived: the same
 * project always resolves to the same subject.
 */
export function projectSubject(project) {
  const category = String(project?.category || '').toLowerCase();
  const rest = [
    project?.shortDescription,
    project?.title,
    project?.role,
    ...(project?.technologies || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Category is the strongest signal, so it gets its own pass first.
  const byCategory = SUBJECT_RULES.find(([, re]) => re.test(category));
  if (byCategory) return byCategory[0];

  const byText = SUBJECT_RULES.find(([, re]) => re.test(rest));
  if (byText) return byText[0];

  return 'web';
}

/** Everything a plate needs to draw itself, in one deterministic bundle. */
export function projectArt(project) {
  const key = project?.slug || project?.title || '';
  return {
    subject: projectSubject(project),
    monogram: monogram(project?.title),
    // 0–3: rotates the ground composition so neighbouring plates differ.
    variant: hash(`${key}-variant`) % 4,
    plate: plateStyle(project),
  };
}
