/**
 * Shared class-string builders for the design system.
 *
 * These live outside ui.jsx so that file only exports components (react-refresh
 * requirement). Everything here resolves to tokens declared in index.css.
 */

/* --- Buttons -------------------------------------------------------------- *
 * Three variants only. Movement is a 1px lift plus a colour/glow shift —
 * anything larger belongs to the later animation work.                       */

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-control px-4 py-2.5 text-nav font-medium ' +
  'transition-[transform,background-color,border-color,color,box-shadow,opacity] duration-200 ease-smooth ' +
  'hover:-translate-y-px active:translate-y-0 disabled:pointer-events-none disabled:opacity-55';

const BUTTON_VARIANTS = {
  primary: 'bg-accent text-accent-contrast hover:bg-accent-strong hover:glow-md',
  secondary: 'border border-line bg-surface text-ink hover:border-line-strong hover:bg-elevated',
  ghost: 'text-ink-muted hover:bg-elevated hover:text-ink',
};

export const buttonClass = (variant = 'primary', className = '') =>
  `${BUTTON_BASE} ${BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary} ${className}`;

/* --- Inputs --------------------------------------------------------------- *
 * States: normal / hover / focus / error / disabled. Keyboard focus uses the
 * global :focus-visible outline; the accent border makes pointer focus visible
 * too.                                                                        */

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
