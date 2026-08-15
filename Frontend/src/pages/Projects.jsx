import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FeaturedProject, ProjectTile } from '../components/ProjectShowcase';
import { EmptyState, ErrorState, Loader, Section } from '../components/ui';
import { inputClass } from '../lib/styles';
import { getProjectFilters, getProjects } from '../lib/api';
import useRequest from '../lib/useRequest';
import useScrollReveal from '../lib/useScrollReveal';
import useSeo from '../lib/useSeo';

const PAGE_SIZE = 24;

/* Rhythm for the non-featured grid on large screens: the 6-column track is
   split 3+3, then 2+2+2, so rows alternate between two-up and three-up instead
   of repeating one card width. */
const isWide = (index) => index % 5 < 2;

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

  const { data, loading, error, reload } = useRequest(() => getProjects(query), [query]);
  const { data: meta } = useRequest(getProjectFilters, []);
  // Unfiltered count for the header, so the headline total does not change
  // while the visitor is filtering. limit=1 keeps the payload tiny.
  const { data: totals } = useRequest(() => getProjects({ limit: 1 }), []);

  useSeo({
    title: 'Projects',
    description: 'Professional projects with technologies, role and case-study details.',
  });

  const items = data?.items || [];
  const hasFilters = Boolean(search) || category !== 'all' || technology !== 'all' || featured;
  const totalAll = totals?.total;

  // Featured projects lead the page; everything else follows in the grid.
  const featuredItems = items.filter((project) => project.featured);
  const restItems = items.filter((project) => !project.featured);

  // Remounts the results on any filter change so the swap animation replays.
  const resultsKey = `${search}|${category}|${technology}|${featured}`;

  const resultsRef = useRef(null);
  useScrollReveal(resultsRef, [resultsKey, items.length]);

  const selectClass = `${inputClass()} appearance-none pr-9 cursor-pointer`;

  // min-h on small screens keeps the chips at a comfortable touch target;
  // desktop drops back to the tighter editorial height.
  const chipClass = (active) =>
    `inline-flex min-h-11 items-center rounded-full border px-4 text-meta transition-colors duration-200 ease-smooth sm:min-h-0 sm:px-3.5 sm:py-1.5 ${
      active
        ? 'border-accent bg-accent text-accent-contrast'
        : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink'
    }`;

  return (
    <Section>
      {/* --- Header ------------------------------------------------------- */}
      <header className="hairline-b flex flex-col gap-6 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-mono text-accent">Selected work</p>
          <h1 className="mt-3 text-h1 text-ink">My Projects</h1>
          <p className="mt-4 max-w-reading text-body text-ink-muted">
            Client and product work across web applications, admin panels and long-running
            support engagements. Each entry links to its case study.
          </p>
        </div>

        {typeof totalAll === 'number' ? (
          <p className="label-mono shrink-0 sm:text-right">
            {totalAll} Project{totalAll === 1 ? '' : 's'}
          </p>
        ) : null}
      </header>

      {/* --- Controls ----------------------------------------------------- */}
      <div className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
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
            strokeWidth="1.8"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3.2-3.2" />
          </svg>
          <input
            id="project-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name, technology, category or description"
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

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
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
            className="link-accent inline-flex min-h-11 items-center text-small underline underline-offset-4 sm:min-h-0"
          >
            Clear filters
          </button>
        ) : null}

        {!loading && data ? (
          <p className="label-mono ml-auto">
            {typeof totalAll === 'number' && data.total !== totalAll
              ? `Showing ${data.total} of ${totalAll}`
              : `${data.total} result${data.total === 1 ? '' : 's'}`}
          </p>
        ) : null}
      </div>

      {/* --- Results ------------------------------------------------------ */}
      <div className="mt-10">
        {loading ? (
          <Loader label="Loading projects…" />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : items.length ? (
          <div key={resultsKey} ref={resultsRef} className="project-swap">
            {featuredItems.length ? (
              <div className="flex flex-col gap-6">
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
              <div
                className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-6 ${
                  featuredItems.length ? 'mt-6' : ''
                }`}
              >
                {restItems.map((project, index) => (
                  <ProjectTile
                    key={project._id}
                    project={project}
                    index={index}
                    revealIndex={featuredItems.length + index}
                    wide={isWide(index)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <EmptyState
            title="No projects found."
            description="Try another search or filter."
          />
        )}
      </div>
    </Section>
  );
}
