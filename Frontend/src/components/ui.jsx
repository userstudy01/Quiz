import { Link } from 'react-router-dom';
import { buttonClass, inputClass } from '../lib/styles';

/* ==========================================================================
   Shared public-site primitives.

   Styling comes from the tokens and utilities in index.css — no hex values and
   no ad-hoc spacing live in this file.
   ========================================================================== */

/* --- Layout --------------------------------------------------------------- */

export function Section({ children, className = '' }) {
  return <section className={`container-page ${className}`}>{children}</section>;
}

/* The arrow glyph used by every "keep reading" affordance on the site. */
export function Arrow({ className = '' }) {
  return (
    <svg
      className={`arrow h-4 w-4 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-5-5m5 5-5 5" />
    </svg>
  );
}

/**
 * Page masthead. The heading level is fixed at h1 — every page has exactly one.
 * `index` renders the small mono counter used across the site.
 */
export function PageHeader({ eyebrow, title, lede, meta, children }) {
  return (
    <header className="pb-4">
      {eyebrow ? <p className="rise label-mono text-accent">{eyebrow}</p> : null}

      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="rise text-h1 text-ink" style={{ animationDelay: '70ms' }}>
          {title}
        </h1>
        {meta ? (
          <p className="rise label-mono shrink-0 sm:text-right" style={{ animationDelay: '170ms' }}>
            {meta}
          </p>
        ) : null}
      </div>

      {lede ? (
        <p
          className="rise mt-6 measure text-body-lg text-ink-muted"
          style={{ animationDelay: '140ms' }}
        >
          {lede}
        </p>
      ) : null}

      {children}
    </header>
  );
}

/** Section heading inside a page: mono label above a ruled top border. */
export function SectionHeading({ eyebrow, title, description, action, reveal }) {
  return (
    <div
      data-reveal={reveal !== undefined ? '' : undefined}
      data-reveal-index={reveal}
      className="hairline-t flex flex-col gap-4 pt-8 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        {eyebrow ? <p className="label-mono text-accent">{eyebrow}</p> : null}
        <h2 className="mt-3 text-h2 text-ink">{title}</h2>
        {description ? (
          <p className="mt-3 measure text-body text-ink-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/** Text link with the arrow nudge — used for every "see everything" jump. */
export function MoreLink({ to, children }) {
  return (
    <Link
      to={to}
      className="link-arrow inline-flex items-center gap-2 text-small font-medium text-ink transition-colors duration-200 ease-smooth hover:text-accent"
    >
      <span className="link-underline">{children}</span>
      <Arrow />
    </Link>
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

/* `to` renders a router link, `href` an external anchor. */
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
  return (
    <input aria-invalid={invalid || undefined} className={inputClass(invalid, className)} {...rest} />
  );
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
    <label htmlFor={htmlFor} className="label-mono mb-2 block">
      {children}
    </label>
  );
}

export function FieldError({ children }) {
  return children ? <p className="mt-2 text-meta text-danger">{children}</p> : null;
}

/* --- Content states ------------------------------------------------------- */

export function Tag({ children }) {
  return (
    <span className="rounded-control border border-line px-2 py-0.5 text-meta text-ink-muted">
      {children}
    </span>
  );
}

export function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-3 py-16 label-mono" role="status">
      <span
        aria-hidden="true"
        className="h-3 w-3 animate-spin rounded-full border border-line border-t-accent"
      />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="hairline-t pt-8" role="alert">
      <p className="label-mono text-danger">Error</p>
      <p className="mt-3 measure text-body text-ink">{message}</p>
      {onRetry ? (
        <Button variant="secondary" className="mt-5" onClick={onRetry} type="button">
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="hairline-t py-14 text-center sm:py-20">
      <p className="font-display text-h3 text-ink">{title}</p>
      {description ? (
        <p className="mx-auto mt-3 max-w-md text-small text-ink-muted">{description}</p>
      ) : null}
    </div>
  );
}
