import { Arrow, ButtonLink } from './ui';

/* ==========================================================================
   Home hero.

   Content rule: only real data is rendered. The profile document on this site
   may be empty, so every personal field is optional and the hero falls back to
   figures counted from the projects API — never to invented biography.

   Motion: one entrance, staggered by ~70ms per element, all of it CSS. Nothing
   is hidden until it animates: `rise` starts at opacity 0 for at most 620ms and
   is neutralised entirely under prefers-reduced-motion.
   ========================================================================== */

function Figure({ value, label, delay }) {
  return (
    <div className="hairline-t flex items-baseline justify-between gap-4 py-4">
      <span className="label-mono">{label}</span>
      <span
        className="rise font-display text-h2 leading-none text-ink"
        style={{ animationDelay: `${delay}ms` }}
      >
        {value}
      </span>
    </div>
  );
}

export default function Hero({ profile, stats = {}, featured = [] }) {
  const { projects, categories, technologies } = stats;

  const figures = [
    { label: 'Projects', value: projects },
    { label: 'Categories', value: categories },
    { label: 'Technologies', value: technologies },
  ].filter((figure) => typeof figure.value === 'number' && figure.value > 0);

  /* The statement line under the name. The profile's own tagline when it has
     one; otherwise a sentence assembled purely from counted figures. */
  const statement =
    profile?.tagline ||
    (projects
      ? `${projects} professional projects — client platforms, admin panels and long-running product work.`
      : '');

  return (
    <section className="container-page pb-4 pt-6 sm:pt-10">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-16">
        {/* --- Copy ------------------------------------------------------- */}
        <div>
          <p className="rise label-mono text-accent">
            {profile?.title || 'Developer portfolio'}
          </p>

          <h1
            className="rise mt-6 text-display text-ink"
            style={{ animationDelay: '70ms' }}
          >
            {profile?.name || 'Selected Work'}
          </h1>

          <span
            aria-hidden="true"
            className="rule-draw mt-8 block h-px w-24 bg-accent"
            style={{ animationDelay: '180ms' }}
          />

          {statement ? (
            <p
              className="rise mt-8 measure text-body-lg text-ink-muted"
              style={{ animationDelay: '210ms' }}
            >
              {statement}
            </p>
          ) : null}

          {profile?.location || profile?.strengths?.length ? (
            <div
              className="rise mt-7 flex flex-wrap items-center gap-x-6 gap-y-2"
              style={{ animationDelay: '260ms' }}
            >
              {profile?.location ? (
                <span className="label-mono flex items-center gap-2">
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                  {profile.location}
                </span>
              ) : null}
              {(profile.strengths || []).slice(0, 3).map((strength) => (
                <span key={strength} className="label-mono">
                  {strength}
                </span>
              ))}
            </div>
          ) : null}

          <div className="rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: '300ms' }}>
            <ButtonLink to="/projects">
              View Projects
              <Arrow />
            </ButtonLink>

            <ButtonLink to="/contact" variant="secondary">
              Contact Me
            </ButtonLink>

            {profile?.resumeUrl ? (
              <ButtonLink href={profile.resumeUrl} variant="ghost">
                Résumé
              </ButtonLink>
            ) : null}
          </div>
        </div>

        {/* --- Technical panel -------------------------------------------- *
         * The hero's one visual: a ruled index of counted figures and, when
         * the API returns featured work, the titles behind those figures.  */}
        <aside
          className="rise self-end lg:pb-1"
          style={{ animationDelay: '360ms' }}
          aria-label="Portfolio at a glance"
        >
          {profile?.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name ? `Portrait of ${profile.name}` : 'Profile photo'}
              loading="lazy"
              decoding="async"
              className="mb-8 aspect-square w-32 rounded-card border border-line object-cover sm:w-40"
            />
          ) : null}

          {figures.length ? (
            <div>
              {figures.map((figure, i) => (
                <Figure
                  key={figure.label}
                  label={figure.label}
                  value={figure.value}
                  delay={420 + i * 70}
                />
              ))}
            </div>
          ) : null}

          {featured.length ? (
            <div className="hairline-t pt-5">
              <p className="label-mono">Featured</p>
              <ul className="mt-3 space-y-1.5">
                {featured.slice(0, 3).map((project) => (
                  <li key={project._id} className="text-small text-ink-muted">
                    {project.title}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
