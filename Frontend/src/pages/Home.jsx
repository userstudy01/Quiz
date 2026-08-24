import { useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import Hero from '../components/Hero';
import {
  FeaturedProject,
  ProjectCompactRow,
  TechList,
} from '../components/ProjectShowcase';
import {
  Arrow,
  ButtonLink,
  EmptyState,
  Loader,
  MoreLink,
  SectionHeading,
  StaleNotice,
} from '../components/ui';
import { getExperience, getProjectFilters, getProjects, getSkills } from '../lib/api';
import useRequest from '../lib/useRequest';
import useScrollReveal from '../lib/useScrollReveal';
import useSeo, { portfolioJsonLd } from '../lib/useSeo';

/* ==========================================================================
   Home.

   The page is a route to the work: hero, featured spreads, then the rest of
   the archive one click away. Skills and experience appear only when the API
   has something to show for them.
   ========================================================================== */

const COMPACT_LIMIT = 8;

export default function Home() {
  const { profile } = useOutletContext();

  // One list request serves the hero figures, the featured spreads and the
  // archive preview.
  const { data: list, loading, stale, reload } = useRequest(() => getProjects({ limit: 100 }), []);
  const { data: meta } = useRequest(getProjectFilters, []);
  const { data: skills } = useRequest(getSkills, []);
  const { data: experience } = useRequest(getExperience, []);

  const bodyRef = useRef(null);
  const items = list?.items || [];
  const featured = items.filter((project) => project.featured);
  const rest = items.filter((project) => !project.featured);
  const skillGroups = skills?.groups || [];
  const technologies = meta?.technologies || [];
  const recentExperience = (experience || []).slice(0, 3);

  useScrollReveal(bodyRef, [items.length, skillGroups.length, recentExperience.length]);

  useSeo({
    title: profile?.name ? `${profile.name} — ${profile.title || 'Developer'}` : 'Home',
    description:
      profile?.tagline ||
      profile?.bio ||
      'Selected professional work: client platforms, admin panels and product builds.',
    image: profile?.profileImage,
    jsonLd: portfolioJsonLd(profile),
  });

  return (
    <>
      <Hero
        profile={profile}
        featured={featured}
        stats={{
          projects: list?.total,
          categories: meta?.categories?.length,
          technologies: technologies.length,
        }}
      />

      <div ref={bodyRef} className="container-page mt-20 space-y-20 sm:mt-24 sm:space-y-24">
        {stale ? <StaleNotice onRetry={reload} /> : null}
        {/* --- Featured work ---------------------------------------------- */}
        <section aria-labelledby="featured-heading">
          <SectionHeading
            eyebrow="Selected work"
            title={<span id="featured-heading">Featured projects</span>}
            description="Client platforms and product builds, in detail."
            action={<MoreLink to="/projects">All projects</MoreLink>}
            reveal={0}
          />

          {loading ? (
            <Loader label="Loading projects…" />
          ) : featured.length ? (
            <div className="mt-4">
              {featured.map((project, index) => (
                <FeaturedProject
                  key={project._id}
                  project={project}
                  index={index}
                  revealIndex={index + 1}
                />
              ))}
            </div>
          ) : items.length ? (
            <div className="mt-8">
              {items.slice(0, 3).map((project, index) => (
                <FeaturedProject
                  key={project._id}
                  project={project}
                  index={index}
                  revealIndex={index + 1}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects published yet"
              description="Published projects appear here as soon as they exist."
            />
          )}
        </section>

        {/* --- Archive preview -------------------------------------------- */}
        {rest.length ? (
          <section aria-labelledby="archive-heading">
            <SectionHeading
              eyebrow="Archive"
              title={<span id="archive-heading">More work</span>}
              description={
                list?.total
                  ? `The full archive holds ${list.total} projects.`
                  : undefined
              }
              action={<MoreLink to="/projects">Open the archive</MoreLink>}
              reveal={0}
            />

            <ul className="mt-6">
              {rest.slice(0, COMPACT_LIMIT).map((project, index) => (
                <ProjectCompactRow
                  key={project._id}
                  project={project}
                  index={index}
                  revealIndex={index}
                />
              ))}
            </ul>

            {rest.length > COMPACT_LIMIT ? (
              <p data-reveal="" className="hairline-t pt-5">
                <Link
                  to="/projects"
                  className="link-arrow inline-flex items-center gap-2 text-small text-ink-muted transition-colors duration-200 ease-smooth hover:text-accent"
                >
                  <span className="link-underline">
                    {rest.length - COMPACT_LIMIT} more in the archive
                  </span>
                  <Arrow />
                </Link>
              </p>
            ) : null}
          </section>
        ) : null}

        {/* --- Technical focus -------------------------------------------- *
         * Skill groups when the skills API has them; otherwise the tech list
         * counted from the projects themselves. Never a fabricated stack.  */}
        {skillGroups.length ? (
          <section aria-labelledby="skills-heading">
            <SectionHeading
              eyebrow="Toolkit"
              title={<span id="skills-heading">Skills</span>}
              action={<MoreLink to="/skills">All skills</MoreLink>}
              reveal={0}
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {skillGroups.slice(0, 3).map((group, index) => (
                <div
                  key={group.category}
                  data-reveal=""
                  data-reveal-index={index}
                  className="card-lux p-6"
                >
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 place-items-center rounded-control bg-accent-soft text-accent"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8 8-4 4 4 4m8-8 4 4-4 4" />
                    </svg>
                  </span>
                  <h3 className="mt-5 text-h3 text-ink">{group.category}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.slice(0, 8).map((skill) => (
                      <li
                        key={skill._id}
                        className="rounded-control border border-line px-2.5 py-1 text-meta text-ink-muted"
                      >
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : technologies.length ? (
          <section aria-labelledby="tech-heading">
            <SectionHeading
              eyebrow="Toolkit"
              title={<span id="tech-heading">Technical focus</span>}
              description="Technologies recorded across the projects in this portfolio."
              action={<MoreLink to="/skills">Full index</MoreLink>}
              reveal={0}
            />
            <div data-reveal="" data-reveal-index={1} className="mt-8">
              <TechList technologies={technologies} limit={technologies.length} className="gap-x-8 gap-y-3" />
            </div>
          </section>
        ) : null}

        {/* --- Experience preview ------------------------------------------ */}
        {recentExperience.length ? (
          <section aria-labelledby="experience-heading">
            <SectionHeading
              eyebrow="Background"
              title={<span id="experience-heading">Experience</span>}
              action={<MoreLink to="/experience">Full timeline</MoreLink>}
              reveal={0}
            />
            <ol className="mt-6">
              {recentExperience.map((item, index) => (
                <li
                  key={item._id}
                  data-reveal=""
                  data-reveal-index={index}
                  className="hairline-t flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <div>
                    <p className="text-h3 text-ink">{item.role}</p>
                    {item.company ? (
                      <p className="mt-1 text-small text-ink-muted">{item.company}</p>
                    ) : null}
                  </div>
                  <p className="label-mono shrink-0">
                    {[item.startDate, item.current ? 'Present' : item.endDate]
                      .filter(Boolean)
                      .join(' — ')}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {/* --- Contact ------------------------------------------------------ */}
        <section data-reveal="">
          <div className="cta-gradient card-lux relative overflow-hidden p-8 sm:p-12">
            <div
              aria-hidden="true"
              className="glow-accent right-[-4rem] top-[-4rem] h-72 w-72 opacity-60"
            />
            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="label-mono text-accent">Contact</p>
                <h2 className="mt-4 measure text-h2 text-ink">
                  Let&apos;s create something together
                </h2>
                <p className="mt-4 measure text-body text-ink-muted">
                  Have a project that needs building? Send the details and I will reply by email.
                </p>
              </div>
              <ButtonLink to="/contact" className="shrink-0">
                Get in Touch
                <Arrow />
              </ButtonLink>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
