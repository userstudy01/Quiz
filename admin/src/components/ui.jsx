import { useEffect, useState } from 'react';

export function PageHeader({ title, description, action }) {
  return (
    <div className="animate-rise mb-7 flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[1.35rem] font-semibold tracking-tight text-ink sm:text-2xl">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-ink-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Button({ children, variant = 'primary', className = '', ...rest }) {
  const styles = {
    primary:
      'bg-accent text-accent-contrast shadow-card hover:bg-accent-hover active:translate-y-px',
    secondary:
      'border border-line-strong bg-surface text-ink hover:bg-canvas hover:border-ink-subtle',
    danger:
      'border border-danger/30 bg-surface text-danger hover:bg-danger-soft hover:border-danger/50',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-55 ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Field({ label, hint, error, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs text-ink-subtle">{hint}</span> : null}
      {error ? <span className="mt-1.5 block text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}

export const inputClass =
  'w-full rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-ink shadow-[inset_0_1px_1px_rgba(17,24,39,.02)] transition-colors placeholder:text-ink-subtle focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/12';

// Password field with a show/hide eye toggle. `label` names it for a11y.
export function PasswordInput({ label = 'password', className = '', ...rest }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input type={shown ? 'text' : 'password'} className={`${inputClass} pr-11 ${className}`} {...rest} />
      <button
        type="button"
        onClick={() => setShown((v) => !v)}
        aria-label={shown ? `Hide ${label}` : `Show ${label}`}
        aria-pressed={shown}
        className="absolute inset-y-0 right-0 grid w-10 cursor-pointer place-items-center text-ink-muted hover:text-ink"
      >
        {shown ? (
          <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
            <path d="M9.9 4.2A9.5 9.5 0 0112 4c5 0 9 4.5 10 8a12 12 0 01-2.2 3.3M6.1 6.1C3.8 7.6 2.3 9.9 2 12c1 3.5 5 8 10 8a9.6 9.6 0 004-.9" />
          </svg>
        )}
      </button>
    </div>
  );
}

export function Modal({ open, title, onClose, children, footer, wide = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm sm:p-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`animate-rise mt-4 w-full rounded-2xl border border-line bg-surface shadow-pop sm:mt-10 ${
          wide ? 'max-w-3xl' : 'max-w-lg'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-ink-muted hover:bg-line/60 hover:text-ink"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-3 border-t border-line px-6 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title, message, onCancel, onConfirm, busy }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : 'Delete'}
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-muted">{message}</p>
    </Modal>
  );
}

export function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => onDismiss(), 5000);
    return () => clearTimeout(id);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed inset-x-0 top-5 z-[60] flex justify-center px-4 sm:inset-x-auto sm:right-5 sm:justify-end">
      <div
        role={isError ? 'alert' : 'status'}
        className={`animate-toast-in flex w-full max-w-sm items-center gap-3 rounded-xl border-l-4 bg-surface px-4 py-3.5 shadow-xl ring-1 ring-black/5 ${
          isError ? 'border-red-500' : 'border-emerald-500'
        }`}
      >
        <span
          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-white ${
            isError ? 'bg-red-500' : 'bg-emerald-500'
          }`}
          aria-hidden="true"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            {isError ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M20 6 9 17l-5-5" />}
          </svg>
        </span>
        <p className="min-w-0 flex-1 text-sm font-medium text-ink">{toast.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-mr-1 shrink-0 rounded-md p-1 text-ink-muted hover:bg-line/60 hover:text-ink"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-3 py-14 text-sm text-ink-muted" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent/25 border-t-accent" />
      {label}
    </div>
  );
}

export function EmptyRow({ colSpan, message }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-14 text-center">
        <span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-canvas text-ink-subtle">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 7h16M4 12h10M4 17h7" />
          </svg>
        </span>
        <p className="text-sm text-ink-muted">{message}</p>
      </td>
    </tr>
  );
}

// Status pill. `tone` picks the color set; defaults to a neutral grey.
const BADGE_TONES = {
  neutral: 'bg-canvas text-ink-muted',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-success-soft text-success',
  warn: 'bg-warn-soft text-warn',
  danger: 'bg-danger-soft text-danger',
};

// On/off switch. Controls whether the item shows on the public site.
export function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
        checked ? 'bg-accent' : 'bg-line-strong'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-card transition-transform ${
          checked ? 'translate-x-[18px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${BADGE_TONES[tone] || BADGE_TONES.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
