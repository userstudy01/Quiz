/**
 * Shared class-string builders.
 *
 * These live outside ui.jsx so that file only exports components (react-refresh
 * requirement). Every value resolves to a token declared in index.css.
 */

/* --- Buttons -------------------------------------------------------------- *
 * Editorial controls: square-ish, ruled, no gradient and no glow. Movement on
 * hover is a colour/border shift plus the arrow nudge that `link-arrow` adds —
 * the button itself never jumps.                                             */

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-control px-5 py-2.5 text-nav font-medium ' +
  'transition-[background-color,border-color,color,opacity] duration-200 ease-smooth ' +
  'disabled:pointer-events-none disabled:opacity-55';

const BUTTON_VARIANTS = {
  primary:
    'bg-accent text-accent-contrast shadow-[var(--shadow-soft)] hover:bg-accent-strong',
  secondary:
    'border border-line-strong bg-transparent text-ink hover:border-accent hover:text-accent',
  ghost: 'text-ink-muted hover:text-accent',
};

export const buttonClass = (variant = 'primary', className = '') =>
  `${BUTTON_BASE} ${BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary} ${className}`;

/* --- Inputs --------------------------------------------------------------- *
 * Underlined rather than boxed wherever it reads better, but the boxed variant
 * stays the default so forms remain obvious. Keyboard focus uses the global
 * :focus-visible outline; the accent border covers pointer focus too.        */

const INPUT_BASE =
  'w-full rounded-control border bg-surface px-3.5 py-2.5 text-body text-ink ' +
  'placeholder:text-ink-subtle transition-colors duration-200 ease-smooth ' +
  'disabled:cursor-not-allowed disabled:bg-elevated disabled:text-ink-subtle';

export const inputClass = (invalid = false, className = '') =>
  `${INPUT_BASE} ${
    invalid
      ? 'border-danger focus:border-danger'
      : 'border-line hover:border-line-strong focus:border-accent'
  } ${className}`;
