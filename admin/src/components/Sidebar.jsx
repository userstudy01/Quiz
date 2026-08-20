import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import API, { clearAuth, getStoredAuth } from '../utils/api';
import NotificationBell from './NotificationBell';

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
    navigate('/login', { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-3.5 py-2.5 text-sm transition-colors ${
      isActive ? 'bg-ink text-white' : 'text-ink-muted hover:bg-line/60 hover:text-ink'
    }`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="fixed left-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-lg border border-line bg-surface lg:hidden"
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
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 shrink-0 flex-col border-r border-line bg-surface p-5 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 mt-10 flex items-center justify-between gap-2 lg:mt-0">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-xs font-semibold text-white">
              PA
            </span>
            <span className="text-sm font-semibold">Portfolio Admin</span>
          </Link>
          <NotificationBell onNavigate={() => setOpen(false)} />
        </div>

        <nav className="flex-1 space-y-1">
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
                {link.label}
              </NavLink>
            ))}
        </nav>

        <div className="mt-6 border-t border-line pt-4">
          {auth?.user ? (
            <div className="mb-3 px-1">
              <p className="truncate text-sm font-medium">{auth.user.name}</p>
              <p className="truncate text-xs text-ink-muted">{auth.user.email}</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
