import { Link } from 'react-router-dom';

export function Section({ children, className = '' }) {
  return (
    <section className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</section>
  );
}

export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-ink-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Tag({ children }) {
  return (
    <span className="rounded-md border border-line bg-surface px-2 py-1 text-xs text-ink-muted">
      {children}
    </span>
  );
}

export function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-3 py-16 text-sm text-ink-muted" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-ink" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-6" role="alert">
      <p className="text-sm text-ink">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg border border-line px-3 py-1.5 text-sm hover:border-ink/30"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
      <p className="font-medium">{title}</p>
      {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
    </div>
  );
}

export function ButtonLink({ to, href, children, variant = 'primary', ...rest }) {
  const className =
    variant === 'primary'
      ? 'inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90'
      : 'inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/30';

  if (to) {
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} target="_blank" rel="noreferrer noopener" {...rest}>
      {children}
    </a>
  );
}
