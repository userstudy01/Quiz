import { Link } from 'react-router-dom';

export default function Footer({ profile }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold">{profile?.name || 'Portfolio'}</p>
          {profile?.title ? <p className="mt-1 text-sm text-ink-muted">{profile.title}</p> : null}
          {profile?.location ? (
            <p className="mt-1 text-sm text-ink-muted">{profile.location}</p>
          ) : null}
        </div>

        <nav className="flex flex-col gap-2 text-sm text-ink-muted">
          <Link to="/projects" className="hover:text-ink">Projects</Link>
          <Link to="/about" className="hover:text-ink">About</Link>
          <Link to="/experience" className="hover:text-ink">Experience</Link>
          <Link to="/contact" className="hover:text-ink">Contact</Link>
        </nav>

        <div className="flex flex-col gap-2 text-sm text-ink-muted">
          {profile?.email ? (
            <a href={`mailto:${profile.email}`} className="hover:text-ink">
              {profile.email}
            </a>
          ) : null}
          {(profile?.socialLinks || []).map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-ink-muted sm:px-8">
          © {year} {profile?.name || 'All rights reserved'}.
        </p>
      </div>
    </footer>
  );
}
