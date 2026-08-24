import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import ThemeToggle from './ThemeToggle';

const MotionDiv = motion.div;

/* ==========================================================================
   Masthead.

   Visually light: a hairline, a serif wordmark and six small links. The rule
   under the bar only appears once the page has scrolled, so the top of every
   page opens with nothing above the content.
   ========================================================================== */

const LINKS = [
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/experience', label: 'Experience' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar({ profile }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* While the mobile panel is open: lock the page behind it, close on Escape,
     and keep Tab inside the panel. */
  useEffect(() => {
    if (!open) return undefined;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const reduce = useReducedMotion();
  const name = profile?.name || 'Portfolio';
  const role = profile?.title || '';
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'PF';

  /* Active page is marked with a short rule under the label rather than a
     heavier weight — the row stays visually even. */
  const linkClass = ({ isActive }) =>
    `relative py-1 text-nav transition-colors duration-200 ease-smooth after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-accent after:transition-[width] after:duration-300 after:ease-smooth ${
      isActive
        ? 'text-ink after:w-full'
        : 'text-ink-muted hover:text-ink after:w-0 hover:after:w-full'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color] duration-300 ease-smooth ${
        scrolled ? 'surface-glass border-b border-line' : 'border-b border-transparent'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-control focus:border focus:border-line focus:bg-surface focus:px-3 focus:py-2 focus:text-nav"
      >
        Skip to content
      </a>

      <nav
        aria-label="Primary"
        className="container-page flex items-center justify-between gap-6 py-4"
      >
        <Link
          to="/"
          className="group flex items-center gap-3 text-ink"
          aria-label={`${name} — home`}
        >
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-control border border-line-strong bg-elevated font-display text-sm font-medium text-accent transition-colors duration-300 ease-smooth group-hover:border-accent"
          >
            {initials}
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block font-display text-base tracking-tight">{name}</span>
            {role ? <span className="label-mono block">{role}</span> : null}
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {profile?.resumeUrl ? (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden text-nav text-ink-muted transition-colors duration-200 ease-smooth hover:text-accent lg:block"
            >
              Résumé
            </a>
          ) : null}

          <ThemeToggle />

          <Link
            to="/contact"
            className="hidden items-center gap-2 rounded-control bg-accent px-4 py-2 text-nav font-medium text-accent-contrast shadow-[var(--shadow-soft)] transition-colors duration-200 ease-smooth hover:bg-accent-strong md:inline-flex"
          >
            Let&apos;s Talk
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-5-5m5 5-5 5" />
            </svg>
          </Link>

          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
            className="grid h-9 w-9 place-items-center rounded-control border border-line text-ink transition-colors duration-200 ease-smooth hover:border-line-strong md:hidden"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 8h16M4 16h16'} />
            </svg>
          </button>
        </div>
      </nav>

      {/* --- Mobile panel ---------------------------------------------------- *
       * AnimatePresence gives the panel a smooth height+fade on both open and
       * close (a plain `hidden` toggle could only snap shut). Items keep their
       * CSS `rise` stagger. Collapses to a simple fade under reduced motion.  */}
      <AnimatePresence>
        {open ? (
          <MotionDiv
            id="mobile-menu"
            ref={panelRef}
            className="surface-glass hairline-t overflow-hidden md:hidden"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="container-page flex flex-col pb-6 pt-2">
              {LINKS.map((link, i) => (
                <li key={link.to} className="hairline-b last:border-0">
                  <NavLink
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rise flex items-center justify-between py-4 text-body transition-colors duration-200 ease-smooth ${
                        isActive ? 'text-accent' : 'text-ink'
                      }`
                    }
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {link.label}
                    <span className="index-mono text-ink-subtle">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </NavLink>
                </li>
              ))}

              {profile?.resumeUrl ? (
                <li className="hairline-t">
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => setOpen(false)}
                    className="block py-4 text-body text-ink"
                  >
                    Résumé
                  </a>
                </li>
              ) : null}
            </ul>
          </MotionDiv>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
