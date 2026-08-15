import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/experience', label: 'Experience' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar({ profile }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const name = profile?.name || 'Portfolio';
  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'PF';

  const linkClass = ({ isActive }) =>
    `relative text-sm transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-accent after:transition-all after:duration-300 ${
      isActive
        ? 'text-ink font-semibold after:w-full'
        : 'text-ink-muted hover:text-ink after:w-0 hover:after:w-full'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-line bg-canvas/80 backdrop-blur-xl shadow-[0_1px_0_rgba(15,23,42,0.03)]'
          : 'border-b border-transparent bg-canvas/40 backdrop-blur'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl text-xs font-bold tracking-wide text-white shadow-[var(--shadow-soft)] transition-transform duration-300 group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
          >
            {initials}
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:block">{name}</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {profile?.resumeUrl ? (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.03] sm:block"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
            >
              Résumé
            </a>
          ) : null}

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-surface md:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-line bg-surface md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-5 py-2 sm:px-8">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `border-b border-line/70 py-3 text-sm last:border-0 ${
                    isActive ? 'font-semibold text-ink' : 'text-ink-muted'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
