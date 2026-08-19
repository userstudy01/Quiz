import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, Loader, PageHeader, Section } from '../components/ui';
import { getProjects, getSkills } from '../lib/api';
import useRequest from '../lib/useRequest';
import useScrollReveal from '../lib/useScrollReveal';
import useSeo from '../lib/useSeo';

/* ==========================================================================
   Skills — a technical index, not a scorecard.

   Two sources, both real:
     · the skills collection, when the admin panel has entries (grouped by
       category; a level is shown only when one was actually recorded)
     · the technologies recorded on the portfolio projects, counted

   There are no proficiency bars, no percentages and no star ratings anywhere
   on this page. The only number shown is how many projects used a technology,
   which is a fact the database can back.
   ========================================================================== */

export default function Skills() {
  const { data, loading, error, reload } = useRequest(getSkills, []);
  const { data: list } = useRequest(() => getProjects({ limit: 100 }), []);

  useSeo({
    title: 'Skills',
    description: 'Technical index: technologies used across the portfolio projects.',
  });

  const groups = data?.groups || [];
  const projects = useMemo(() => list?.items || [], [list]);

  /* Technology → the projects that record it. Sorted by usage, then name, so
     the index has a deliberate order rather than insertion order. */
  const usage = useMemo(() => {
    const map = new Map();
    projects.forEach((project) => {
      (project.technologies || []).forEach((tech) => {
        if (!map.has(tech)) map.set(tech, []);
        map.get(tech).push(project);
      });
    });
    return [...map.entries()]
      .map(([name, used]) => ({ name, used }))
      .sort((a, b) => b.used.length - a.used.length || a.name.localeCompare(b.name));
  }, [projects]);

  const maxUsage = usage[0]?.used.length || 1;

  /* Categories of work, each with the projects that belong to it. */
  const domains = useMemo(() => {
    const map = new Map();
    projects.forEach((project) => {
      const key = project.category || '';
      if (!key) return;
      if (!map.has(key)) map.set(key, 0);
      map.set(key, map.get(key) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [projects]);

  const bodyRef = useRef(null);
  useScrollReveal(bodyRef, [groups.length, usage.length, domains.length]);

  const hasAnything = groups.length || usage.length;

  return (
    <Section>
      <PageHeader
        eyebrow="Toolkit"
        title="Technical Index"
        lede="Technologies and platforms recorded on the work in this portfolio, counted from the projects themselves rather than self-assessed."
        meta={usage.length ? `${usage.length} Technologies` : undefined}
      />

      <div ref={bodyRef} className="mt-12 space-y-16">
        {loading ? (
          <Loader label="Loading skills…" />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : null}

        {/* --- Declared skills, when the admin panel has any ---------------- */}
        {groups.length ? (
          <section aria-labelledby="groups-heading" className="hairline-t pt-8">
            <h2 id="groups-heading" className="label-mono text-accent">
              By category
            </h2>
            <div className="mt-8 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group, index) => (
                <div key={group.category} data-reveal="" data-reveal-index={index}>
                  <h3 className="text-h3 text-ink">{group.category}</h3>
                  <ul className="mt-4">
                    {group.items.map((skill) => (
                      <li
                        key={skill._id}
                        className="flex items-baseline justify-between gap-4 border-b border-line py-2.5"
                      >
                        <span className="text-small text-ink-muted">{skill.name}</span>
                        {skill.level ? <span className="label-mono">{skill.level}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* --- Usage index --------------------------------------------------- */}
        {usage.length ? (
          <section aria-labelledby="usage-heading">
            <div className="hairline-t flex flex-wrap items-baseline justify-between gap-4 pt-8">
              <h2 id="usage-heading" className="label-mono text-accent">
                Across the portfolio
              </h2>
              <p className="label-mono">Projects using each</p>
            </div>

            <ul className="mt-6">
              {usage.map((entry, index) => (
                <li
                  key={entry.name}
                  data-reveal=""
                  data-reveal-index={index}
                  className="group border-b border-line"
                >
                  <div className="flex items-center gap-5 py-4">
                    <span className="index-mono w-8 shrink-0 text-ink-subtle">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="font-display text-h3 text-ink transition-colors duration-200 ease-smooth group-hover:text-accent">
                        {entry.name}
                      </span>
                      <span className="mt-1.5 block truncate text-meta text-ink-subtle">
                        {entry.used.map((project) => project.title).join(' · ')}
                      </span>
                    </span>

                    {/* A rule sized by real project count — not a skill level. */}
                    <span
                      aria-hidden="true"
                      className="hidden h-px bg-line-strong transition-colors duration-300 ease-smooth group-hover:bg-accent sm:block"
                      style={{ width: `${(entry.used.length / maxUsage) * 6}rem` }}
                    />

                    <span className="index-mono w-8 shrink-0 text-right text-ink">
                      {entry.used.length}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-small text-ink-subtle">
              Counted from the{' '}
              <Link to="/projects" className="link-accent underline underline-offset-4">
                project archive
              </Link>
              .
            </p>
          </section>
        ) : null}

        {/* --- Domains -------------------------------------------------------- */}
        {domains.length ? (
          <section aria-labelledby="domains-heading">
            <h2 id="domains-heading" className="hairline-t label-mono block pt-8 text-accent">
              Types of work
            </h2>
            <ul className="mt-6 grid gap-x-12 sm:grid-cols-2">
              {domains.map(([name, count], index) => (
                <li
                  key={name}
                  data-reveal=""
                  data-reveal-index={index}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-3"
                >
                  <span className="text-small text-ink-muted">{name}</span>
                  <span className="index-mono text-ink-subtle">{count}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {!loading && !error && !hasAnything ? (
          <EmptyState
            title="No skills recorded yet"
            description="Skills added from the admin panel, and technologies recorded on projects, appear here."
          />
        ) : null}
      </div>
    </Section>
  );
}
