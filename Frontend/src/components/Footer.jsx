import { Link } from 'react-router-dom';

export default function Footer({ profile }) {
  const year = new Date().getFullYear();

  return (
    <footer className="hairline-t mt-24 bg-surface">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="text-small font-semibold text-ink">{profile?.name || 'Portfolio'}</p>
          {profile?.title ? <p className="mt-1 text-small text-ink-muted">{profile.title}</p> : null}
          {profile?.location ? (
            <p className="mt-1 text-small text-ink-muted">{profile.location}</p>
          ) : null}
        </div>

        <nav className="flex flex-col items-start gap-2 text-small">
          <Link to="/projects" className="link-accent">Projects</Link>
          <Link to="/about" className="link-accent">About</Link>
          <Link to="/experience" className="link-accent">Experience</Link>
          <Link to="/contact" className="link-accent">Contact</Link>
        </nav>

        <div className="flex flex-col items-start gap-2 text-small">
          {profile?.email ? (
            <a href={`mailto:${profile.email}`} className="link-accent">
              {profile.email}
            </a>
          ) : null}
          {(profile?.socialLinks || []).map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="link-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="hairline-t">
        <p className="container-page py-5 text-meta text-ink-subtle">
          © {year} {profile?.name || 'All rights reserved'}.
        </p>
      </div>
    </footer>
  );
}
