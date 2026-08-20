import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import API, { clearAuth, getStoredAuth } from '../utils/api';
import { setFlash } from '../utils/flash';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';

// Simple line-icon paths (24×24, stroked) keyed by route.
const ICONS = {
  '/': 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  '/projects': 'M3 8h18v11H3zM8 8V6a2 2 0 012-2h4a2 2 0 012 2v2',
  '/skills': 'M12 4l1.9 4.3L18 10l-4.1 1.7L12 16l-1.9-4.3L6 10l4.1-1.7z',
  '/experience': 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8v4l3 2',
  '/profile': 'M12 12a4 4 0 100-8 4 4 0 000 8zM5 20c0-3.3 3.1-5 7-5s7 1.7 7 5',
  '/messages': 'M3 6h18v12H3zM3 7l9 6 9-6',
  '/analytics': 'M5 20v-9M12 20V4M19 20v-6M3 20h18',
  '/account': 'M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z',
  '/requests': 'M4 13l2-8h12l2 8M4 13v6h16v-6M4 13h5l1.5 2.5h3L18 13h2',
};

function NavIcon({ to }) {
  return (
    <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[to] || ICONS['/']} />
    </svg>
  );
}

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/experience', label: 'Experience' },
  { to: '/profile', label: 'Profile' },
  { to: '/messages', label: 'Messages' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/account', label: 'Account' },
  { to: '/requests', label: 'Requests', superAdmin: true },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getStoredAuth();

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch {
      // The token is discarded locally regardless of the server response.
    }
    clearAuth();
    setFlash('success', 'Logout successful');
    navigate('/login', { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-accent text-accent-contrast shadow-card'
        : 'text-ink-muted hover:bg-canvas hover:text-ink'
    }`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="fixed left-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-ink shadow-card lg:hidden"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
        </svg>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-40 bg-ink/20 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 shrink-0 flex-col border-r border-line bg-surface p-4 shadow-pop transition-transform lg:static lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-7 mt-10 flex items-center justify-between gap-2 lg:mt-0">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-hover text-xs font-bold text-white shadow-card">
              PA
            </span>
            <span className="text-sm font-semibold tracking-tight">Portfolio Admin</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <NotificationBell onNavigate={() => setOpen(false)} />
          </div>
        </div>

        <p className="label-mono mb-2 px-3">Menu</p>
        <nav className="flex-1 space-y-0.5">
          {links
            .filter((link) => !link.superAdmin || auth?.user?.role === 'superadmin')
            .map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                <NavIcon to={link.to} />
                {link.label}
              </NavLink>
            ))}
        </nav>

        <div className="mt-6 border-t border-line pt-4">
          {auth?.user ? (
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-canvas px-3 py-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-semibold uppercase text-accent">
                {(auth.user.name || auth.user.email || '?').trim().charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{auth.user.name}</p>
                <p className="truncate text-xs text-ink-subtle">{auth.user.email}</p>
              </div>
            </div>
          ) : null}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-line-strong px-3.5 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-danger/40 hover:bg-danger-soft hover:text-danger"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 17l5-5-5-5M20 12H9M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
