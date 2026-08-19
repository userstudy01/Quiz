/**
 * Deterministic artwork for projects that have no uploaded screenshot.
 *
 * The rule this file exists to enforce: a project without a screenshot gets a
 * *plate* — a printed-looking panel of ruled geometry carrying the project's
 * index and monogram. It is unmistakably a graphic, never a mock UI, and it is
 * never a stock photo. The same project always produces the same plate, so the
 * archive reads as a designed set rather than random decoration.
 *
 * Colours come from the theme (`--plate-rule` / `--plate-mark`), so the plates
 * belong to whichever theme is active instead of carrying their own palette.
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
