import { Arrow, ButtonLink } from './ui';
import { SceneArtwork } from './Artwork';

/* ==========================================================================
   Home hero — premium dark composition.

   Content rule is unchanged: only real profile data is rendered. Every personal
   field is optional and the figures fall back to counts from the projects API,
   never to invented biography. Entrance is the site's CSS `rise` stagger,
   neutralised entirely under prefers-reduced-motion.
   ========================================================================== */

function Figure({ value, label, delay }) {
  return (
    <div className="rise" style={{ animationDelay: `${delay}ms` }}>
      <p className="font-display text-h2 leading-none text-ink">
        {value}
        <span className="text-accent">+</span>
      </p>
      <p className="label-mono mt-2">{label}</p>
    </div>
  );
}

/* A social link as a bordered round chip — the platform label drives the
   accessible name, its initials draw the chip. No icon is invented. */
function SocialChip({ link }) {
  const label = link.label || 'Link';
  const initials = label.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'Li';
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-meta text-ink-muted transition-colors duration-200 ease-smooth hover:border-accent hover:text-accent"
    >
      {initials}
    </a>
  );
}

export default function Hero({ profile, stats = {}, featured = [] }) {
  const { projects, categories, technologies } = stats;

  const figures = [
    { label: 'Projects', value: projects },
    { label: 'Categories', value: categories },
    { label: 'Technologies', value: technologies },
  ].filter((figure) => typeof figure.value === 'number' && figure.value > 0);

  const socials = (profile?.socialLinks || []).filter((link) => link?.url);

  const statement =
    profile?.tagline ||
    profile?.bio ||
    (projects
      ? `${projects} professional projects — client platforms, admin panels and long-running product work.`
      : '');

  return (
    <section className="relative overflow-hidden pt-4 sm:pt-8">
      {/* Decorative copper glow — pure ornament, hidden from AT. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-accent right-[-6rem] top-[-4rem] h-[26rem] w-[26rem] opacity-70" />
        <div className="glow-accent left-[-8rem] top-[18rem] h-[22rem] w-[22rem] opacity-40" />
      </div>

      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* --- Copy ------------------------------------------------------- */}
        <div>
          <p className="rise label-mono text-accent">
            {profile?.name ? "Hello, I'm" : 'Selected work'}
          </p>

          <h1 className="rise mt-4 text-display text-ink" style={{ animationDelay: '70ms' }}>
            {profile?.name || 'Developer Portfolio'}
          </h1>

          {profile?.title ? (
            <p
              className="rise mt-3 font-display text-h1 leading-tight text-accent"
              style={{ animationDelay: '150ms' }}
            >
              {profile.title}
            </p>
          ) : null}

          {statement ? (
            <p
              className="rise mt-6 measure text-body-lg text-ink-muted"
              style={{ animationDelay: '220ms' }}
            >
              {statement}
            </p>
          ) : null}

          <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '290ms' }}>
            <ButtonLink to="/projects">
              View My Work
              <Arrow />
            </ButtonLink>
            <ButtonLink to="/contact" variant="secondary">
              Let&apos;s Talk
            </ButtonLink>
            {profile?.resumeUrl ? (
              <ButtonLink href={profile.resumeUrl} variant="ghost">
                Résumé
              </ButtonLink>
            ) : null}
          </div>

          {socials.length ? (
            <div className="rise mt-8 flex flex-wrap gap-2.5" style={{ animationDelay: '340ms' }}>
              {socials.map((link) => (
                <SocialChip key={link.url} link={link} />
              ))}
            </div>
          ) : null}
        </div>

        {/* --- Visual ----------------------------------------------------- *
         * A real portrait when the profile carries one; otherwise a drawn
         * studio scene, framed and lifted off the glow. Never a stock face. */}
        <div className="rise" style={{ animationDelay: '360ms' }}>
          <div className="relative">
            <div
              aria-hidden="true"
              className="glow-accent inset-0 opacity-60 blur-[64px]"
            />
            <div className="card-lux group relative overflow-hidden">
              {profile?.profileImage ? (
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={profile.profileImage}
                    alt={profile.name ? `Portrait of ${profile.name}` : 'Profile photo'}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] w-full">
                  <SceneArtwork scene="studio" />
                  <div className="visual-scrim">
                    <span className="label-mono">{profile?.title || 'Studio'}</span>
                    <span className="label-mono text-ink-subtle">Artwork</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {figures.length ? (
            <div className="mt-8 grid grid-cols-3 gap-4">
              {figures.map((figure, i) => (
                <Figure key={figure.label} label={figure.label} value={figure.value} delay={420 + i * 70} />
              ))}
            </div>
          ) : null}

          {featured.length ? (
            <p className="rise mt-6 label-mono" style={{ animationDelay: '620ms' }}>
              Featured — {featured.slice(0, 3).map((p) => p.title).join(' · ')}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
