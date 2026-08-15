import { useEffect, useState } from 'react';

const prefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

function readStored() {
  try {
    const v = localStorage.getItem('theme');
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

// Two-state toggle (light / dark). First visit follows the OS setting; once the
// user chooses, the choice is persisted and wins on every later visit.
export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => readStored() || (prefersDark() ? 'dark' : 'light'));

  useEffect(() => {
    // While the user hasn't chosen, keep following the OS.
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return undefined;
    const onChange = (e) => {
      if (!readStored()) setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const apply = (next) => {
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage may be unavailable */
    }
    document.documentElement.setAttribute('data-theme', next);
    const meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute('content', next === 'dark' ? '#0a0c14' : '#fafafb');
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => apply(isDark ? 'light' : 'dark')}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-ink-muted transition-colors hover:border-accent/40 hover:text-ink"
    >
      <svg
        aria-hidden="true"
        className={`h-[18px] w-[18px] transition-all duration-300 ${isDark ? 'hidden' : 'block'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* moon (shown in light mode → click for dark) */}
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg
        aria-hidden="true"
        className={`h-[18px] w-[18px] transition-all duration-300 ${isDark ? 'block' : 'hidden'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* sun (shown in dark mode → click for light) */}
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
