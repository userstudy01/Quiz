import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { buttonClass, inputClass } from '../lib/styles';

const MotionLink = motion.create(Link);

/* Shared press/hover feel for every button on the site: a small lift on hover
   and a press on tap. Returns nothing under prefers-reduced-motion, so the
   controls stay completely still for those users. */
function usePressProps() {
  const reduce = useReducedMotion();
  if (reduce) return {};
  return {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.97 },
    transition: { type: 'spring', stiffness: 420, damping: 26 },
  };
}

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
  const press = usePressProps();
  return (
    <motion.button className={buttonClass(variant, className)} {...press} {...rest}>
      {children}
    </motion.button>
  );
}

/* `to` renders a router link, `href` an external anchor. */
export function ButtonLink({ to, href, children, variant = 'primary', className = '', ...rest }) {
  const classes = buttonClass(variant, `link-arrow ${className}`);
  const press = usePressProps();

  if (to) {
    return (
      <MotionLink to={to} className={classes} {...press} {...rest}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.a href={href} className={classes} target="_blank" rel="noreferrer noopener" {...press} {...rest}>
      {children}
    </motion.a>
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

/**
 * The API runs on an instance that sleeps when idle, and waking it takes long
 * enough that a silent spinner reads as a broken page. After a few seconds the
 * loader explains itself rather than leaving the visitor guessing.
 */
export function Loader({ label = 'Loading…' }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="py-16" role="status">
      <p className="flex items-center gap-3 label-mono">
        <span
          aria-hidden="true"
          className="h-3 w-3 animate-spin rounded-full border border-line border-t-accent"
        />
        {label}
      </p>
      {slow ? (
        <p className="mt-4 measure text-small text-ink-subtle">
          The server sleeps when it has had no visitors, so the first request of
          the day takes a little longer. This will load as soon as it wakes.
        </p>
      ) : null}
    </div>
  );
}

/**
 * Shown when the network failed and the page is rendering the last response
 * this API returned. The content is real, just not fetched this minute — and
 * saying so is better than passing it off as live.
 */
export function StaleNotice({ onRetry }) {
  return (
    <p className="hairline-t flex flex-wrap items-center gap-x-4 gap-y-2 py-3 text-meta text-ink-subtle">
      <span className="label-mono text-accent">Offline copy</span>
      <span>Showing the last version loaded — the server did not respond just now.</span>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="link-accent underline underline-offset-4"
        >
          Retry
        </button>
      ) : null}
    </p>
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
