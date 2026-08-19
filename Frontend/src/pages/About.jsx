import { useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Arrow, ButtonLink, EmptyState, MoreLink, PageHeader, Section } from '../components/ui';
import { monogram } from '../lib/projectArt';
import { getExperience, getProjectFilters, getProjects } from '../lib/api';
import useRequest from '../lib/useRequest';
import useScrollReveal from '../lib/useScrollReveal';
import useSeo from '../lib/useSeo';

/* ==========================================================================
   About.

   Personal content comes from the profile document; everything countable is
   read from the projects API. Nothing about years of experience, clients,
   education or certifications is asserted here — if the database does not
   carry it, the section does not render.
   ========================================================================== */

function Block({ title, children, reveal, action }) {
  return (
    <section data-reveal="" data-reveal-index={reveal} className="hairline-t pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="label-mono text-accent">{title}</h2>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/* Initials mark, used only when a name exists but no image does. Never a stock
   photo, never a generated face. */
function PortraitMark({ name }) {
  return (
    <div
      aria-hidden="true"
      className="grid aspect-square w-full max-w-[15rem] place-items-center rounded-card border border-line bg-elevated"
    >
      <span className="font-display text-6xl leading-none text-ink-subtle">{monogram(name)}</span>
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

  /* Every figure below is counted from the API — never written by hand, and
     never a claim the database cannot back. */
  const stats = [
    { label: 'Professional projects', value: projectTotals?.total },
    { label: 'Featured', value: featuredTotals?.total },
    { label: 'Project categories', value: categories.length || undefined },
    { label: 'Technologies used', value: technologies.length || undefined },
  ].filter((stat) => typeof stat.value === 'number' && stat.value > 0);

  return (
    <Section>
      <PageHeader
        eyebrow="About"
        title={profile?.name || 'About'}
        lede={
          profile?.tagline ||
          (typeof projectTotals?.total === 'number' && projectTotals.total > 0
            ? `${projectTotals.total} professional projects recorded in this portfolio, across ${categories.length} categories of work.`
            : undefined)
        }
        meta={profile?.location || undefined}
      >
        {profile?.title ? (
          <p className="rise mt-6 text-body-lg text-ink" style={{ animationDelay: '200ms' }}>
            {profile.title}
          </p>
        ) : null}

        {profile?.resumeUrl ? (
          <div className="rise mt-8" style={{ animationDelay: '260ms' }}>
            <ButtonLink href={profile.resumeUrl}>
              View Résumé
              <Arrow />
            </ButtonLink>
          </div>
        ) : null}
      </PageHeader>

      <div ref={bodyRef} className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
        <div className="space-y-10">
          {profile?.bio ? (
            <Block title="Profile" reveal={0}>
              <p className="measure whitespace-pre-line text-body-lg text-ink-muted">
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
                description="Name, title, bio, location and strengths are added from the admin panel and appear here automatically."
              />
            </div>
          ) : null}

          {strengths.length ? (
            <Block title="Strengths" reveal={1}>
              <ol className="grid gap-x-10 sm:grid-cols-2">
                {strengths.map((strength, index) => (
                  <li
                    key={strength}
                    className="flex gap-4 border-b border-line py-3.5 text-body text-ink"
                  >
                    <span className="index-mono shrink-0 pt-1 text-accent">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ol>
            </Block>
          ) : null}

          {/* Drawn from the technologies recorded on the portfolio projects, so
              the list is evidence rather than a claim. No proficiency levels,
              no percentages, no ratings. */}
          {technologies.length ? (
            <Block
              title="Technical focus"
              reveal={2}
              action={<MoreLink to="/skills">All skills</MoreLink>}
            >
              <p className="measure text-small text-ink-subtle">
                Technologies recorded across the{' '}
                {typeof projectTotals?.total === 'number' ? projectTotals.total : ''} projects in
                this portfolio.
              </p>
              <ul className="mt-5 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
                {technologies.map((tech) => (
                  <li
                    key={tech}
                    className="border-b border-line py-2.5 text-small text-ink-muted transition-colors duration-200 ease-smooth hover:text-ink"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {categories.length ? (
            <Block title="Work types" reveal={3}>
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {categories.map((item) => (
                  <li key={item} className="border-b border-line py-2.5 text-small text-ink-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {recentExperience.length ? (
            <Block
              title="Background"
              reveal={4}
              action={<MoreLink to="/experience">Full timeline</MoreLink>}
            >
              <ol>
                {recentExperience.map((item) => (
                  <li key={item._id} className="border-b border-line py-5 last:border-0">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-h3 text-ink">
                        {item.role}
                        {item.company ? (
                          <span className="text-ink-muted"> · {item.company}</span>
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
                      <p className="mt-3 measure whitespace-pre-line text-small text-ink-muted">
                        {item.summary}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </Block>
          ) : null}
        </div>

        {/* --- Rail --------------------------------------------------------- */}
        <aside className="space-y-10">
          {profile?.profileImage ? (
            <div data-reveal="">
              <img
                src={profile.profileImage}
                alt={profile.name ? `Portrait of ${profile.name}` : 'Profile photo'}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full max-w-[15rem] rounded-card border border-line object-cover"
              />
            </div>
          ) : profile?.name ? (
            <div data-reveal="">
              <PortraitMark name={profile.name} />
            </div>
          ) : null}

          {stats.length ? (
            <div data-reveal="" data-reveal-index={1} className="hairline-t pt-8">
              <h2 className="label-mono text-accent">Portfolio at a glance</h2>
              <dl className="mt-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-0"
                  >
                    <dt className="label-mono">{stat.label}</dt>
                    <dd className="font-display text-h3 text-ink">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </aside>
      </div>
    </Section>
  );
}
