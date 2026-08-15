import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import FeatureProjectCard from '../components/FeatureProjectCard';
import { EmptyState, ErrorState, Loader, Section } from '../components/ui';
import { getProjectFilters, getProjects } from '../lib/api';
import useRequest from '../lib/useRequest';
import useReveal from '../lib/useReveal';
import useSeo from '../lib/useSeo';

const PAGE_SIZE = 24;

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
  const revealRef = useReveal();

  useSeo({
    title: 'Projects',
    description: 'Professional projects with technologies, role and case-study details.',
  });

  const items = data?.items || [];
  const hasFilters = Boolean(search) || category !== 'all' || technology !== 'all' || featured;

  const selectClass =
    'w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-ink/30 focus:outline-none';

  return (
    <Section>
      <div ref={revealRef}>
      <div className="border-b border-line pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Work</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
          Projects that <span className="text-gradient">shipped</span>.
        </h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          {data?.total ? `${data.total} real, delivered projects. ` : ''}Search and filter by category,
          technology or featured status.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <input
            id="project-search"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, technology, category or description"
            className={selectClass}
          />
        </div>

        <div>
          <label htmlFor="filter-category" className="sr-only">
            Category
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => updateParam('category', e.target.value)}
            className={selectClass}
          >
            <option value="all">All categories</option>
            {(meta?.categories || []).map((c) => (
              <option key={c} value={c}>
                {c}
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
            onChange={(e) => updateParam('technology', e.target.value)}
            className={selectClass}
          >
            <option value="all">All technologies</option>
            {(meta?.technologies || []).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => updateParam('featured', featured ? null : 'true')}
          aria-pressed={featured}
          className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
            featured ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-ink-muted hover:border-ink/30'
          }`}
        >
          Featured only
        </button>

        {hasFilters ? (
          <button
            type="button"
            onClick={() => setSearchParams({}, { replace: true })}
            className="text-sm text-ink-muted underline hover:text-ink"
          >
            Clear filters
          </button>
        ) : null}

        {!loading && data ? (
          <p className="ml-auto text-sm text-ink-muted">
            {data.total} project{data.total === 1 ? '' : 's'}
          </p>
        ) : null}
      </div>

      <div className="mt-8">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((project, i) => (
              <div
                key={project._id}
                className={`reveal ${project.featured ? 'sm:col-span-2 lg:col-span-3' : ''}`}
                style={{ '--reveal-delay': `${(i % 6) * 60}ms` }}
              >
                {project.featured ? (
                  <FeatureProjectCard project={project} index={i} />
                ) : (
                  <ProjectCard project={project} index={i} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No projects match these filters"
            description="Try a different search term or clear the filters."
          />
        )}
      </div>
      </div>
    </Section>
  );
}
