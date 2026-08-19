import { Link } from 'react-router-dom';

/* Quiet colophon: a wordmark, one navigation column, contact where the profile
   provides it. Nothing here is invented — empty profile fields simply drop. */

const NAV = [
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/experience', label: 'Experience' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer({ profile }) {
  const year = new Date().getFullYear();
  const name = profile?.name || 'Portfolio';

  return (
    <footer className="hairline-t mt-24">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-h3 text-ink">{name}</p>
          {profile?.title ? (
            <p className="mt-2 text-small text-ink-muted">{profile.title}</p>
          ) : null}
          {profile?.location ? <p className="mt-1 label-mono">{profile.location}</p> : null}
        </div>

        <nav aria-label="Footer">
          <p className="label-mono">Index</p>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="link-underline text-small text-ink-muted hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {profile?.email || profile?.socialLinks?.length ? (
          <div>
            <p className="label-mono">Contact</p>
            <ul className="mt-4 space-y-2.5">
              {profile?.email ? (
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="link-underline text-small text-ink-muted hover:text-ink"
                  >
                    {profile.email}
                  </a>
                </li>
              ) : null}
              {(profile?.socialLinks || []).map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline text-small text-ink-muted hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="hairline-t">
        <p className="container-page py-6 label-mono">
          © {year} {name}
        </p>
      </div>
    </footer>
  );
}
