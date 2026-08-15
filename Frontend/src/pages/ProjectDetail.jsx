import { useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProjectVisual } from '../components/ProjectShowcase';
import { ButtonLink, ErrorState, Loader, Section } from '../components/ui';
import { getProject, getProjects } from '../lib/api';
import {
  parseDescription,
  parseProgress,
  projectNumber,
  stripRemainingPrefix,
} from '../lib/projectFields';
import useRequest from '../lib/useRequest';
import useScrollReveal from '../lib/useScrollReveal';
import useSeo from '../lib/useSeo';

/* ==========================================================================
   Project case study.

   Every section is conditional on real data. Nothing is generated to fill a
   layout: no placeholder screenshots, no invented challenges, no fabricated
   links. A project with sparse data renders a short, honest page rather than
   a padded one.
   ========================================================================== */

/* --- Section shells ------------------------------------------------------- */

function Block({ title, children, reveal }) {
  return (
    <section data-reveal="" data-reveal-index={reveal} className="hairline-t pt-10">
      <h2 className="label-mono text-accent">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="max-w-reading space-y-3">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-3 text-body text-ink-muted">
          <span
            aria-hidden="true"
            className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent/70"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* Renders only when the list has entries. */
function ListBlock({ title, items, reveal, transform }) {
  if (!items?.length) return null;
  const values = transform ? items.map(transform) : items;
  return (
    <Block title={title} reveal={reveal}>
      <BulletList items={values} />
    </Block>
  );
}

function MetaRow({ label, children }) {
  return (
    <div className="hairline-b flex flex-col gap-1 py-3.5 last:border-0 sm:flex-row sm:gap-6">
      <dt className="label-mono sm:w-40 sm:shrink-0 sm:pt-0.5">{label}</dt>
      <dd className="text-small text-ink">{children}</dd>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Page
   -------------------------------------------------------------------------- */
export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading, error, reload } = useRequest(() => getProject(slug), [slug]);

  // Sibling lookup for previous/next. The list endpoint is already sorted by
  // sortOrder, so position in this array is the reading order.
  const { data: list } = useRequest(() => getProjects({ limit: 100 }), []);

  const { prev, next } = useMemo(() => {
    const items = list?.items || [];
    const index = items.findIndex((item) => item.slug === slug);
    if (index === -1) return { prev: null, next: null };
    return {
      prev: index > 0 ? items[index - 1] : null,
      next: index < items.length - 1 ? items[index + 1] : null,
    };
  }, [list, slug]);

  const { fields, prose } = useMemo(
    () => parseDescription(project?.description),
    [project?.description]
  );

  const bodyRef = useRef(null);
  useScrollReveal(bodyRef, [slug, project?._id]);

  useSeo({
    title: project?.title || 'Project',
    description: project?.shortDescription || project?.description?.slice(0, 160),
    image: project?.screenshots?.[0]?.url,
    type: 'article',
  });

  if (loading) {
    return (
      <Section>
        <Loader label="Loading project…" />
      </Section>
    );
  }

  if (error || !project) {
    return (
      <Section>
        <ErrorState message={error || 'Project not found.'} onRetry={reload} />
        <Link to="/projects" className="link-accent mt-5 inline-block text-small">
          ← Back to Projects
        </Link>
      </Section>
    );
  }

  const technologies = project.technologies || [];
  const screenshots = project.screenshots || [];
  const progress = parseProgress(fields.Progress);

  // The short description leads the hero. The Overview section only appears
  // when it adds something the hero has not already said — for most of these
  // projects both come from the same source line.
  const overviewSource = fields.Overview || prose || '';
  const showOverview = overviewSource && overviewSource !== project.shortDescription;
  const overview = showOverview ? overviewSource : '';

  const hasMeta =
    project.category ||
    project.role ||
    fields.Client ||
    fields.Status ||
    progress !== null ||
    fields['Reference URL'] ||
    technologies.length > 0;

  const hasContribution =
    project.role || project.responsibilities?.length || project.technicalWork?.length;

  return (
    <Section>
      {/* --- Back ---------------------------------------------------------- */}
      <Link
        to="/projects"
        className="link-arrow link-accent inline-flex min-h-11 items-center gap-2 text-small sm:min-h-0"
      >
        <svg
          className="arrow h-4 w-4 rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-5-5m5 5-5 5" />
        </svg>
        Back to Projects
      </Link>

      {/* --- Hero ---------------------------------------------------------- */}
      <header className="mt-6 pb-10">
        <div className="hero-rise flex items-center gap-3">
          <span className="font-mono text-small text-accent">{projectNumber(project)}</span>
          <span className="h-px w-8 bg-line" aria-hidden="true" />
          {project.featured ? (
            <span className="rounded-md border border-accent/40 bg-accent-soft px-2 py-0.5 text-meta text-accent">
              Featured
            </span>
          ) : null}
        </div>

        {project.category ? (
          <p className="hero-rise label-mono mt-5" style={{ animationDelay: '70ms' }}>
            {project.category}
          </p>
        ) : null}

        <h1 className="hero-rise mt-3 text-h1 text-ink" style={{ animationDelay: '140ms' }}>
          {project.title}
        </h1>

        {project.shortDescription ? (
          <p
            className="hero-rise mt-5 max-w-reading text-body-lg text-ink-muted"
            style={{ animationDelay: '210ms' }}
          >
            {project.shortDescription}
          </p>
        ) : null}

        {/* Only real URLs produce buttons. A reference link is not a live site
            and is shown in the meta panel instead. */}
        {project.liveUrl || project.githubUrl ? (
          <div className="hero-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '280ms' }}>
            {project.liveUrl ? (
              <ButtonLink href={project.liveUrl}>
                Live Project
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
            ) : null}
            {project.githubUrl ? (
              <ButtonLink href={project.githubUrl} variant="secondary">
                GitHub
              </ButtonLink>
            ) : null}
          </div>
        ) : null}
      </header>

      {/* --- Hero visual --------------------------------------------------- */}
      {screenshots.length ? (
        <figure className="hero-rise group" style={{ animationDelay: '320ms' }}>
          <div className="overflow-hidden rounded-panel border border-line bg-elevated transition-colors duration-500 ease-smooth hover:border-accent/35">
            <img
              src={screenshots[0].url}
              alt={screenshots[0].caption || `${project.title} screenshot`}
              loading="lazy"
              decoding="async"
              className="w-full object-cover transition-[transform,filter] duration-500 ease-smooth group-hover:scale-[1.02] group-hover:brightness-110"
            />
          </div>
          {screenshots[0].caption ? (
            <figcaption className="mt-3 text-small text-ink-subtle">
              {screenshots[0].caption}
            </figcaption>
          ) : null}
        </figure>
      ) : (
        <div className="hero-rise" style={{ animationDelay: '320ms' }}>
          {/* Fallback artwork. Labelled with the project's real technologies
              rather than repeating the category shown just above. */}
          <ProjectVisual
            project={project}
            caption={technologies.join(' · ') || null}
            className="aspect-[16/10] w-full rounded-panel sm:aspect-[21/8]"
          />
        </div>
      )}

      <div ref={bodyRef} className="mt-14 space-y-10">
        {/* --- Meta -------------------------------------------------------- */}
        {hasMeta ? (
          <section data-reveal="" data-reveal-index={0} className="hairline-t pt-10">
            <h2 className="label-mono text-accent">Project details</h2>
            <dl className="mt-5 grid gap-x-12 lg:grid-cols-2">
              {project.category ? <MetaRow label="Category">{project.category}</MetaRow> : null}
              {fields.Client ? <MetaRow label="Client">{fields.Client}</MetaRow> : null}
              {project.role ? <MetaRow label="Role">{project.role}</MetaRow> : null}
              {fields.Status ? <MetaRow label="Status">{fields.Status}</MetaRow> : null}

              {progress !== null ? (
                <MetaRow label="Progress">
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-1 w-28 overflow-hidden rounded-full bg-line"
                    >
                      <span
                        className="block h-full rounded-full bg-accent"
                        style={{ width: `${progress}%` }}
                      />
                    </span>
                    <span className="font-mono text-small">{progress}%</span>
                  </span>
                </MetaRow>
              ) : null}

              {/* Labelled "Reference", never "Live Project" — it is a site the
                  work referenced, not a deployment of this project. */}
              {fields['Reference URL'] ? (
                <MetaRow label="Reference">
                  <a
                    href={fields['Reference URL']}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-accent break-all underline underline-offset-4"
                  >
                    {fields['Reference URL']}
                  </a>
                </MetaRow>
              ) : null}

              {technologies.length ? (
                <MetaRow label="Technologies">
                  <ul className="flex flex-wrap gap-1.5">
                    {technologies.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-md border border-line bg-elevated px-2 py-0.5 text-meta text-ink-muted"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </MetaRow>
              ) : null}
            </dl>
          </section>
        ) : null}

        {/* --- Overview ---------------------------------------------------- */}
        {overview ? (
          <Block title="Overview" reveal={1}>
            <p className="max-w-reading whitespace-pre-line text-body-lg text-ink-muted">
              {overview}
            </p>
          </Block>
        ) : null}

        {/* --- Contribution ------------------------------------------------ *
         * Wording is passed through untouched. Where the data says the work
         * was a change to an existing system, it keeps saying exactly that. */}
        {hasContribution ? (
          <Block title="My Contribution" reveal={2}>
            {project.role ? (
              <p className="max-w-reading text-body text-ink">{project.role}</p>
            ) : null}

            {project.responsibilities?.length ? (
              <div className={project.role ? 'mt-5' : ''}>
                <h3 className="text-small font-medium text-ink-subtle">Responsibilities</h3>
                <div className="mt-3">
                  <BulletList items={project.responsibilities} />
                </div>
              </div>
            ) : null}

            {project.technicalWork?.length ? (
              <div className="mt-5">
                <h3 className="text-small font-medium text-ink-subtle">Technical work</h3>
                <div className="mt-3">
                  <BulletList items={project.technicalWork} />
                </div>
              </div>
            ) : null}
          </Block>
        ) : null}

        <ListBlock title="Features" items={project.features} reveal={3} />

        {/* --- Challenges & solutions -------------------------------------- */}
        {project.challenges?.length || project.solutions?.length ? (
          <section data-reveal="" data-reveal-index={4} className="hairline-t pt-10">
            <h2 className="label-mono text-accent">Challenges &amp; Solutions</h2>
            <div className="mt-5 grid gap-8 lg:grid-cols-2">
              {project.challenges?.length ? (
                <div>
                  <h3 className="text-small font-medium text-ink-subtle">Challenges</h3>
                  <div className="mt-3">
                    <BulletList items={project.challenges} />
                  </div>
                </div>
              ) : null}
              {project.solutions?.length ? (
                <div>
                  <h3 className="text-small font-medium text-ink-subtle">Solutions</h3>
                  <div className="mt-3">
                    <BulletList items={project.solutions} />
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* --- Result ------------------------------------------------------ */}
        {project.result ? (
          <Block title="Project Status" reveal={5}>
            <p className="max-w-reading whitespace-pre-line text-body text-ink-muted">
              {project.result}
            </p>
          </Block>
        ) : null}

        {/* --- Remaining work ---------------------------------------------- */}
        <ListBlock
          title="Remaining Work"
          items={project.improvements}
          reveal={6}
          transform={stripRemainingPrefix}
        />

        {/* --- Extra screenshots ------------------------------------------- */}
        {screenshots.length > 1 ? (
          <Block title="Screenshots" reveal={7}>
            <div className="grid gap-5 sm:grid-cols-2">
              {screenshots.slice(1).map((shot, index) => (
                <figure key={`${shot.url}-${index}`} className="group">
                  <img
                    src={shot.url}
                    alt={shot.caption || `${project.title} screenshot ${index + 2}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-card border border-line bg-elevated object-cover transition-[transform,filter,border-color] duration-500 ease-smooth group-hover:scale-[1.01] group-hover:border-accent/35 group-hover:brightness-110"
                  />
                  {shot.caption ? (
                    <figcaption className="mt-2 text-small text-ink-subtle">
                      {shot.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </Block>
        ) : null}
      </div>

      {/* --- Previous / next ------------------------------------------------ *
       * Rendered only when a neighbour exists, so the first and last projects
       * simply show one side.                                                */}
      {prev || next ? (
        <nav
          aria-label="Project navigation"
          className="hairline-t mt-14 grid gap-4 pt-8 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              to={`/projects/${prev.slug}`}
              className="group surface-card p-5 transition-[border-color,box-shadow] duration-500 ease-smooth hover:border-accent/35 hover:glow-sm"
            >
              <span className="label-mono">← Previous project</span>
              <span className="mt-2 block text-h3 text-ink transition-colors duration-300 ease-smooth group-hover:text-accent">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span aria-hidden="true" className="hidden sm:block" />
          )}

          {next ? (
            <Link
              to={`/projects/${next.slug}`}
              className="group surface-card p-5 transition-[border-color,box-shadow] duration-500 ease-smooth hover:border-accent/35 hover:glow-sm sm:text-right"
            >
              <span className="label-mono">Next project →</span>
              <span className="mt-2 block text-h3 text-ink transition-colors duration-300 ease-smooth group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </Section>
  );
}
