import { useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ButtonLink, EmptyState, Section } from '../components/ui';
import { getExperience, getProjectFilters, getProjects } from '../lib/api';
import useRequest from '../lib/useRequest';
import useScrollReveal from '../lib/useScrollReveal';
import useSeo from '../lib/useSeo';

/* ==========================================================================
   About / engineering profile.

   Every section is driven by data that already exists: the profile document
   for the personal content, and the projects API for anything countable.
   Nothing about experience, achievements, proficiency or scale is asserted
   here unless the database says it. Empty fields drop their section instead
   of being filled with placeholder copy.
   ========================================================================== */

function Block({ title, children, reveal, action }) {
  return (
    <section data-reveal="" data-reveal-index={reveal} className="hairline-t pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="label-mono text-accent">{title}</h2>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/* Initials portrait, used only when a name exists but no image does. Never a
   stock photo, never a fake avatar. */
function PortraitFallback({ name }) {
  const letters =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join('') || '—';

  return (
    <div
      aria-hidden="true"
      className="project-visual grid aspect-square w-full max-w-[17rem] place-items-center rounded-panel border border-line"
    >
      <span className="font-mono text-6xl font-medium tracking-tight text-ink-muted/45">
        {letters}
      </span>
    </div>
  );
}

export default function About() {
  const { profile } = useOutletContext();

  const { data: experience } = useRequest(getExperience, []);
  const { data: meta } = useRequest(getProjectFilters, []);
  // limit=1 keeps the payload tiny; only `total` is needed.
  const { data: projectTotals } = useRequest(() => getProjects({ limit: 1 }), []);
  const { data: featuredTotals } = useRequest(
    () => getProjects({ limit: 1, featured: 'true' }),
    []
  );

  const bodyRef = useRef(null);
  const strengths = profile?.strengths || [];
  const technologies = meta?.technologies || [];
  const categories = meta?.categories || [];
  const recentExperience = (experience || []).slice(0, 3);

  useScrollReveal(bodyRef, [
    profile?._id,
    strengths.length,
    technologies.length,
    recentExperience.length,
  ]);

  useSeo({
    title: 'About',
    description:
      profile?.bio?.slice(0, 160) ||
      profile?.tagline ||
      'Professional introduction, engineering strengths and technical focus.',
    image: profile?.profileImage,
  });

  const hasIdentity = Boolean(
    profile?.name || profile?.title || profile?.tagline || profile?.bio || profile?.location
  );

  /* Portfolio context. Every figure is counted from the API — never written
     by hand, and never a claim the database cannot back. */
  const stats = [
    { label: 'Professional projects', value: projectTotals?.total },
    { label: 'Featured', value: featuredTotals?.total },
    { label: 'Project categories', value: categories.length || undefined },
    { label: 'Technologies used', value: technologies.length || undefined },
  ].filter((stat) => typeof stat.value === 'number' && stat.value > 0);

  return (
    <Section>
      {/* --- Hero ---------------------------------------------------------- */}
      <header className="grid items-start gap-10 pb-12 md:grid-cols-[1.5fr_1fr] md:gap-12">
        <div>
          <p className="hero-rise label-mono text-accent">About</p>

          <h1 className="hero-rise mt-4 text-h1 text-ink" style={{ animationDelay: '80ms' }}>
            {profile?.name || 'About'}
          </h1>

          {profile?.title ? (
            <p
              className="hero-rise mt-3 text-body-lg text-ink"
              style={{ animationDelay: '150ms' }}
            >
              {profile.title}
            </p>
          ) : null}

          {profile?.tagline ? (
            <p
              className="hero-rise mt-4 max-w-reading text-body-lg text-ink-muted"
              style={{ animationDelay: '210ms' }}
            >
              {profile.tagline}
            </p>
          ) : null}

          {profile?.location ? (
            <p
              className="hero-rise label-mono mt-6 flex items-center gap-2"
              style={{ animationDelay: '260ms' }}
            >
              <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              {profile.location}
            </p>
          ) : null}

          {profile?.resumeUrl ? (
            <div className="hero-rise mt-8" style={{ animationDelay: '320ms' }}>
              {/* min-h only on small screens, so the shared button system is
                  unchanged everywhere else. */}
              <ButtonLink href={profile.resumeUrl} className="min-h-11 sm:min-h-0">
                View Resume
                <svg
                  className="arrow h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-5-5m5 5-5 5" />
                </svg>
              </ButtonLink>
            </div>
          ) : null}
        </div>

        {/* Portrait: the real image when one exists, initials when only a name
            does, nothing at all otherwise.
            Wrappers use flex + justify-end rather than justify-self-end: a grid
            item with justify-self sizes to its content, which collapses a
            w-full child to zero. */}
        {profile?.profileImage ? (
          <div className="hero-rise group flex md:justify-end" style={{ animationDelay: '260ms' }}>
            <img
              src={profile.profileImage}
              alt={profile.name ? `Portrait of ${profile.name}` : 'Profile photo'}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full max-w-[17rem] rounded-panel border border-line object-cover transition-[transform,border-color,filter] duration-500 ease-smooth hover:scale-[1.02] hover:border-accent/35 hover:brightness-110"
            />
          </div>
        ) : profile?.name ? (
          <div className="hero-rise flex md:justify-end" style={{ animationDelay: '260ms' }}>
            <PortraitFallback name={profile.name} />
          </div>
        ) : null}
      </header>

      <div ref={bodyRef} className="space-y-10">
        {/* --- Bio --------------------------------------------------------- */}
        {profile?.bio ? (
          <Block title="Profile" reveal={0}>
            <p className="max-w-reading whitespace-pre-line text-body-lg text-ink-muted">
              {profile.bio}
            </p>
          </Block>
        ) : null}

        {/* Nothing personal on file yet: say so plainly rather than invent a
            biography. The data-driven sections below still render. */}
        {!hasIdentity ? (
          <div data-reveal="" data-reveal-index={0}>
            <EmptyState
              title="Profile not filled in yet"
              description="Add your name, title, bio, location and strengths from the admin panel and they will appear here."
            />
          </div>
        ) : null}

        {/* --- Strengths --------------------------------------------------- */}
        {strengths.length ? (
          <Block title="Strengths" reveal={1}>
            <ol className="grid gap-4 sm:grid-cols-2">
              {strengths.map((strength, index) => (
                <li
                  key={strength}
                  className="surface-card group flex gap-4 p-5 transition-[border-color,box-shadow] duration-500 ease-smooth hover:border-accent/35 hover:glow-sm"
                >
                  <span className="font-mono text-small text-accent transition-transform duration-500 ease-smooth group-hover:-translate-y-0.5">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-body text-ink">{strength}</span>
                </li>
              ))}
            </ol>
          </Block>
        ) : null}

        {/* --- Technical focus --------------------------------------------- *
         * Drawn from the technologies recorded on the portfolio projects, so
         * the list is evidence rather than a claim. No proficiency levels, no
         * percentages, no ratings.                                          */}
        {technologies.length ? (
          <Block
            title="Technical focus"
            reveal={2}
            action={
              <Link to="/skills" className="link-arrow link-accent text-small">
                All skills
                <svg
                  className="arrow ml-1.5 inline h-4 w-4 align-[-3px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-5-5m5 5-5 5" />
                </svg>
              </Link>
            }
          >
            <p className="max-w-reading text-small text-ink-subtle">
              Technologies recorded across the {projectTotals?.total ?? ''} projects in this
              portfolio.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md border border-line bg-elevated px-2.5 py-1 text-small text-ink-muted transition-colors duration-300 ease-smooth hover:border-line-strong hover:text-ink"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </Block>
        ) : null}

        {/* --- Portfolio context ------------------------------------------- */}
        {stats.length ? (
          <Block title="Portfolio at a glance" reveal={3}>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="surface-card p-5">
                  <dt className="label-mono">{stat.label}</dt>
                  <dd className="mt-2 font-mono text-h2 text-ink">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </Block>
        ) : null}

        {/* --- Background --------------------------------------------------- *
         * A short preview of the experience entries that already existed on
         * this page. The full timeline stays on its own page.               */}
        {recentExperience.length ? (
          <Block
            title="Background"
            reveal={4}
            action={
              <Link to="/experience" className="link-arrow link-accent text-small">
                Full timeline
                <svg
                  className="arrow ml-1.5 inline h-4 w-4 align-[-3px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-5-5m5 5-5 5" />
                </svg>
              </Link>
            }
          >
            <ol className="space-y-4">
              {recentExperience.map((item) => (
                <li key={item._id} className="surface-card p-5">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-h3 text-ink">
                      {item.role}
                      {item.company ? (
                        <span className="font-normal text-ink-muted"> · {item.company}</span>
                      ) : null}
                    </h3>
                    {item.startDate || item.endDate || item.current ? (
                      <p className="label-mono shrink-0">
                        {[item.startDate, item.current ? 'Present' : item.endDate]
                          .filter(Boolean)
                          .join(' — ')}
                      </p>
                    ) : null}
                  </div>
                  {item.summary ? (
                    <p className="mt-3 max-w-reading whitespace-pre-line text-small text-ink-muted">
                      {item.summary}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </Block>
        ) : null}
      </div>
    </Section>
  );
}
