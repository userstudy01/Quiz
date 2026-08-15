import { Link } from 'react-router-dom';
import { buttonClass, inputClass } from '../lib/styles';

/* ==========================================================================
   Shared public-site primitives.
   Styling comes from the tokens and utilities in index.css — no hex values
   and no ad-hoc spacing values live in this file.
   ========================================================================== */

/* --- Layout --------------------------------------------------------------- */

export function Section({ children, className = '' }) {
  return <section className={`container-page ${className}`}>{children}</section>;
}

export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="hairline-b flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="label-mono">{eyebrow}</p> : null}
        <h2 className="mt-2.5 text-h2 text-ink">{title}</h2>
        {description ? (
          <p className="mt-2.5 max-w-reading text-body text-ink-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/* --- Buttons -------------------------------------------------------------- */

export function Button({ children, variant = 'primary', className = '', ...rest }) {
  return (
    <button className={buttonClass(variant, className)} {...rest}>
      {children}
    </button>
  );
}

/* `to` renders a router link, `href` an external anchor. Wrap an icon in
   <span className="arrow"> to get the hover nudge from `link-arrow`. */
export function ButtonLink({ to, href, children, variant = 'primary', className = '', ...rest }) {
  const classes = buttonClass(variant, `link-arrow ${className}`);

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} target="_blank" rel="noreferrer noopener" {...rest}>
      {children}
    </a>
  );
}

/* --- Inputs --------------------------------------------------------------- */

export function Input({ invalid = false, className = '', ...rest }) {
  return <input aria-invalid={invalid || undefined} className={inputClass(invalid, className)} {...rest} />;
}

export function Textarea({ invalid = false, className = '', ...rest }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={inputClass(invalid, `resize-y ${className}`)}
      {...rest}
    />
  );
}

export function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-small font-medium text-ink">
      {children}
    </label>
  );
}

export function FieldError({ children }) {
  return children ? <p className="mt-1.5 text-meta text-danger">{children}</p> : null;
}

/* --- Content states ------------------------------------------------------- */

export function Tag({ children }) {
  return (
    <span className="rounded-md border border-line bg-elevated px-2 py-1 text-meta text-ink-muted">
      {children}
    </span>
  );
}

export function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-3 py-16 text-small text-ink-muted" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-accent" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="surface-card p-6" role="alert">
      <p className="text-body text-ink">{message}</p>
      {onRetry ? (
        <Button variant="secondary" className="mt-4" onClick={onRetry} type="button">
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-surface p-10 text-center">
      <p className="text-h3 text-ink">{title}</p>
      {description ? <p className="mt-1.5 text-body text-ink-muted">{description}</p> : null}
    </div>
  );
}
