// Deterministic visual identity for a project derived from its title, so the
// 16 real projects look designed even without uploaded screenshots. The same
// title always yields the same gradient + initials.

const PALETTES = [
  ['#4f46e5', '#7c3aed'],
  ['#0ea5e9', '#4f46e5'],
  ['#7c3aed', '#db2777'],
  ['#0891b2', '#0ea5e9'],
  ['#4338ca', '#0ea5e9'],
  ['#059669', '#0891b2'],
  ['#e11d48', '#7c3aed'],
  ['#2563eb', '#06b6d4'],
  ['#9333ea', '#4f46e5'],
  ['#f59e0b', '#e11d48'],
];

function hash(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function projectInitials(title = '') {
  const words = title.replace(/[^\p{L}\p{N} ]/gu, ' ').split(' ').filter(Boolean);
  if (!words.length) return 'PR';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function projectVisual(project) {
  const key = project?.slug || project?.title || '';
  const [from, to] = PALETTES[hash(key) % PALETTES.length];
  const angle = 120 + (hash(key + 'a') % 90);
  return {
    initials: projectInitials(project?.title),
    from,
    to,
    gradient: `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`,
  };
}
