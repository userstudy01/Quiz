import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FeaturedProject, ProjectIndexRow } from '../components/ProjectShowcase';
import { EmptyState, ErrorState, Loader, PageHeader, Section, StaleNotice } from '../components/ui';
import { inputClass } from '../lib/styles';
import { getProjectFilters, getProjects } from '../lib/api';
import useRequest from '../lib/useRequest';
import useScrollReveal from '../lib/useScrollReveal';
import useSeo from '../lib/useSeo';

/* ==========================================================================
   Selected Work — the case-study archive.

   Featured projects lead as full spreads; everything else follows as ruled
   index rows. The archive rows are a different *treatment*, not a lesser one:
   each still carries its number, category, description, role, status and tech.
   ========================================================================== */

const PAGE_SIZE = 100;

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const technology = searchParams.get('technology') || 'all';
  const featured = searchParams.get('featured') === 'true';

  // Debounce the text input so typing does not fire a request per keystroke.
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => setSearchInput(search), [search]);
  useEffect(() => {
    const id = setTimeout(() => {
      if (searchInput !== search) updateParam('search', searchInput || null);
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === 'all' || value === '' || value === false) next.delete(key);
    else next.set(key, String(value));
    setSearchParams(next, { replace: true });
  };

  const query = useMemo(
    () => ({
      search,
      category,
      technology,
      featured: featured ? 'true' : undefined,
      limit: PAGE_SIZE,
    }),
    [search, category, technology, featured]
  );

  const { data, loading, error, stale, reload } = useRequest(() => getProjects(query), [query]);
  const { data: meta } = useRequest(getProjectFilters, []);
  // Unfiltered count for the masthead, so the headline total does not move
  // while the visitor is filtering. limit=1 keeps the payload tiny.
  const { data: totals } = useRequest(() => getProjects({ limit: 1 }), []);

  useSeo({
    title: 'Selected Work',
    description: 'Professional project archive with technologies, role and case-study detail.',
  });

  const items = data?.items || [];
  const hasFilters = Boolean(search) || category !== 'all' || technology !== 'all' || featured;
  const totalAll = totals?.total;

  const featuredItems = items.filter((project) => project.featured);
  const restItems = items.filter((project) => !project.featured);

  // Remounts the results on any filter change so the swap animation replays.
  const resultsKey = `${search}|${category}|${technology}|${featured}`;
  const resultsRef = useRef(null);
  useScrollReveal(resultsRef, [resultsKey, items.length]);

  const selectClass = `${inputClass()} cursor-pointer appearance-none bg-transparent pr-9`;

  const chipClass = (active) =>
    `inline-flex min-h-10 items-center rounded-control border px-4 label-mono transition-colors duration-200 ease-smooth ${
      active
        ? 'border-ink bg-ink text-canvas'
        : 'border-line text-ink-muted hover:border-line-strong hover:text-ink'
    }`;

  return (
    <Section>
      <PageHeader
        eyebrow="Archive"
        title="Selected Work"
        lede="Client and product work across web applications, admin panels and long-running support engagements. Each entry links to its case study."
        meta={
          typeof totalAll === 'number'
            ? `${totalAll} Project${totalAll === 1 ? '' : 's'}`
            : undefined
        }
      />

      {/* --- Controls ------------------------------------------------------ */}
      <div className="hairline-t mt-10 grid gap-4 pt-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="relative">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3.2-3.2" />
          </svg>
          <input
            id="project-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name, technology or category"
            className={inputClass(false, 'pl-10')}
          />
        </div>

        <div>
          <label htmlFor="filter-category" className="sr-only">
            Category
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={(event) => updateParam('category', event.target.value)}
            className={selectClass}
          >
            <option value="all">All categories</option>
            {(meta?.categories || []).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-technology" className="sr-only">
            Technology
          </label>
          <select
            id="filter-technology"
            value={technology}
            onChange={(event) => updateParam('technology', event.target.value)}
            className={selectClass}
          >
            <option value="all">All technologies</option>
            {(meta?.technologies || []).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setSearchParams({}, { replace: true })}
          aria-pressed={!hasFilters}
          className={chipClass(!hasFilters)}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => updateParam('featured', featured ? null : 'true')}
          aria-pressed={featured}
          className={chipClass(featured)}
        >
          Featured
        </button>

        {hasFilters ? (
          <button
            type="button"
            onClick={() => setSearchParams({}, { replace: true })}
            className="link-accent inline-flex min-h-10 items-center text-small underline underline-offset-4"
          >
            Clear filters
          </button>
        ) : null}

        {!loading && data ? (
          <p className="label-mono ml-auto" role="status">
            {typeof totalAll === 'number' && data.total !== totalAll
              ? `Showing ${data.total} of ${totalAll}`
              : `${data.total} result${data.total === 1 ? '' : 's'}`}
          </p>
        ) : null}
      </div>

      {/* --- Results -------------------------------------------------------- */}
      <div className="mt-12">
        {stale ? <StaleNotice onRetry={reload} /> : null}
        {loading ? (
          <Loader label="Loading projects…" />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : items.length ? (
          <div key={resultsKey} ref={resultsRef} className="project-swap">
            {featuredItems.length ? (
              <div>
                {featuredItems.map((project, index) => (
                  <FeaturedProject
                    key={project._id}
                    project={project}
                    index={index}
                    revealIndex={index}
                  />
                ))}
              </div>
            ) : null}

            {restItems.length ? (
              <div className={featuredItems.length ? 'mt-16' : ''}>
                {featuredItems.length ? (
                  <p className="label-mono pb-2">Archive</p>
                ) : null}
                {restItems.map((project, index) => (
                  <ProjectIndexRow
                    key={project._id}
                    project={project}
                    index={index}
                    revealIndex={featuredItems.length + index}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <EmptyState title="No projects found" description="Try another search or filter." />
        )}
      </div>
    </Section>
  );
}
