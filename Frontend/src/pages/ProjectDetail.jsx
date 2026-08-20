import { useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProjectPlate } from '../components/ProjectShowcase';
import { Arrow, ButtonLink, ErrorState, Loader, Section, StaleNotice } from '../components/ui';
import { getProject, getProjects } from '../lib/api';
import {
  parseDescription,
  parseProgress,
  projectNumber,
  stripRemainingPrefix,
} from '../lib/projectFields';
import useRequest from '../lib/useRequest';
import useScrollReveal from '../lib/useScrollReveal';
import useSeo, { projectJsonLd } from '../lib/useSeo';

/* ==========================================================================
   Project case study.

   Every section is conditional on real data. Nothing is generated to fill the
   layout: no placeholder screenshots, no invented challenges, no fabricated
   links. A project with sparse data renders a short, honest page rather than a
   padded one.
   ========================================================================== */

function Block({ title, children, reveal }) {
  return (
    <section data-reveal="" data-reveal-index={reveal} className="hairline-t pt-8">
      <h2 className="label-mono text-accent">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="measure">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex gap-4 border-b border-line py-3 text-body text-ink-muted last:border-0"
        >
          <span className="index-mono shrink-0 pt-1 text-ink-subtle">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

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
    <div className="border-b border-line py-3.5 last:border-0">
      <dt className="label-mono">{label}</dt>
      <dd className="mt-1.5 text-small text-ink">{children}</dd>
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading, error, stale, reload } = useRequest(
    () => getProject(slug),
    [slug]
  );

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
    jsonLd: projectJsonLd(project),
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
        <Link to="/projects" className="link-accent mt-6 inline-block text-small">
          ← Back to Projects
        </Link>
      </Section>
    );
  }

  const technologies = project.technologies || [];
  const screenshots = project.screenshots || [];
  const progress = parseProgress(fields.Progress);

  // The short description leads the page. Overview only appears when it adds
  // something the lede has not already said.
  const overviewSource = fields.Overview || prose || '';
  const overview =
    overviewSource && overviewSource !== project.shortDescription ? overviewSource : '';

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
      <Link
        to="/projects"
        className="link-arrow inline-flex min-h-10 items-center gap-2 text-small text-ink-muted transition-colors duration-200 ease-smooth hover:text-accent"
      >
        <Arrow className="rotate-180" />
        <span className="link-underline">Back to Projects</span>
      </Link>

      {stale ? <StaleNotice onRetry={reload} /> : null}

      {/* --- Masthead ------------------------------------------------------ */}
      <header className="mt-8 hairline-b pb-10">
        <div className="rise flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="index-mono text-accent">{projectNumber(project)}</span>
          <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
          {project.category ? <span className="label-mono">{project.category}</span> : null}
          {project.role ? (
            <span className="label-mono">
              <span className="text-ink-subtle">Role — </span>
              {project.role}
            </span>
          ) : null}
          {project.featured ? <span className="label-mono text-accent">Featured</span> : null}
        </div>

        <h1 className="rise mt-6 text-h1 text-ink" style={{ animationDelay: '80ms' }}>
          {project.title}
        </h1>

        {project.shortDescription ? (
          <p
            className="rise mt-6 measure text-body-lg text-ink-muted"
            style={{ animationDelay: '150ms' }}
          >
            {project.shortDescription}
          </p>
        ) : null}

        {/* Only real URLs produce buttons. A reference link is not a live site
            and is shown in the meta panel instead. */}
        {project.liveUrl || project.githubUrl ? (
          <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '220ms' }}>
            {project.liveUrl ? (
              <ButtonLink href={project.liveUrl}>
                Live Project
                <Arrow />
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

      {/* --- Lead visual ---------------------------------------------------- */}
      <div className="group rise mt-10" style={{ animationDelay: '280ms' }}>
        {screenshots.length ? (
          <figure>
            <div className="visual-frame rounded-panel">
              <img
                src={screenshots[0].url}
                alt={screenshots[0].caption || `${project.title} — screenshot`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.02]"
              />
            </div>
            {screenshots[0].caption ? (
              <figcaption className="mt-3 label-mono">{screenshots[0].caption}</figcaption>
            ) : null}
          </figure>
        ) : (
          /* No capture on file. The plate is drawn from this project's own
             subject and is captioned as artwork, never passed off as a
             screenshot of the software. */
          <figure>
            <ProjectPlate
              project={project}
              size="lg"
              fit="meet"
              label={technologies.join(' · ') || project.category || null}
              className="aspect-[16/9] w-full rounded-panel sm:aspect-[21/8]"
            />
            <figcaption className="mt-3 label-mono">
              Cover artwork — no screenshot recorded for this project
            </figcaption>
          </figure>
        )}
      </div>

      {/* --- Body ----------------------------------------------------------- *
       * Narrative on the left at desktop width, the fact panel in a rail that
       * stays with the reader.                                              */}
      <div
        ref={bodyRef}
        className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16"
      >
        <div className="space-y-10 lg:order-1">
          {overview ? (
            <Block title="Overview" reveal={1}>
              <p className="measure whitespace-pre-line text-body-lg text-ink-muted">{overview}</p>
            </Block>
          ) : null}

          {/* Wording is passed through untouched: where the data says the work
              was support on an existing system, it keeps saying exactly that. */}
          {hasContribution ? (
            <Block title="My Contribution" reveal={2}>
              {project.role ? (
                <p className="measure text-body text-ink">{project.role}</p>
              ) : null}

              {project.responsibilities?.length ? (
                <div className={project.role ? 'mt-6' : ''}>
                  <h3 className="label-mono">Responsibilities</h3>
                  <div className="mt-3">
                    <BulletList items={project.responsibilities} />
                  </div>
                </div>
              ) : null}

              {project.technicalWork?.length ? (
                <div className="mt-6">
                  <h3 className="label-mono">Technical work</h3>
                  <div className="mt-3">
                    <BulletList items={project.technicalWork} />
                  </div>
                </div>
              ) : null}
            </Block>
          ) : null}

          <ListBlock title="Features" items={project.features} reveal={3} />

          {project.challenges?.length || project.solutions?.length ? (
            <section data-reveal="" data-reveal-index={4} className="hairline-t pt-8">
              <h2 className="label-mono text-accent">Challenges &amp; Solutions</h2>
              <div className="mt-6 grid gap-10 lg:grid-cols-2">
                {project.challenges?.length ? (
                  <div>
                    <h3 className="label-mono">Challenges</h3>
                    <div className="mt-3">
                      <BulletList items={project.challenges} />
                    </div>
                  </div>
                ) : null}
                {project.solutions?.length ? (
                  <div>
                    <h3 className="label-mono">Solutions</h3>
                    <div className="mt-3">
                      <BulletList items={project.solutions} />
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {project.result ? (
            <Block title="Project Status" reveal={5}>
              <p className="measure whitespace-pre-line text-body text-ink-muted">
                {project.result}
              </p>
            </Block>
          ) : null}

          <ListBlock
            title="Remaining Work"
            items={project.improvements}
            reveal={6}
            transform={stripRemainingPrefix}
          />

          {screenshots.length > 1 ? (
            <Block title="Screenshots" reveal={7}>
              <div className="grid gap-6 sm:grid-cols-2">
                {screenshots.slice(1).map((shot, index) => (
                  <figure key={`${shot.url}-${index}`} className="group">
                    <img
                      src={shot.url}
                      alt={shot.caption || `${project.title} — screenshot ${index + 2}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full rounded-card border border-line bg-elevated object-cover transition-colors duration-500 ease-smooth group-hover:border-line-strong"
                    />
                    {shot.caption ? (
                      <figcaption className="mt-2 label-mono">{shot.caption}</figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </Block>
          ) : null}
        </div>

        {/* --- Fact panel --------------------------------------------------- */}
        {hasMeta ? (
          <aside data-reveal="" data-reveal-index={0} className="lg:order-2">
            <div className="hairline-t pt-8 lg:sticky lg:top-24">
              <h2 className="label-mono text-accent">Project details</h2>
              <dl className="mt-5">
                {project.category ? <MetaRow label="Category">{project.category}</MetaRow> : null}
                {fields.Client ? <MetaRow label="Client">{fields.Client}</MetaRow> : null}
                {project.role ? <MetaRow label="Role">{project.role}</MetaRow> : null}
                {fields.Status ? <MetaRow label="Status">{fields.Status}</MetaRow> : null}

                {progress !== null ? (
                  <MetaRow label="Progress">
                    <span className="flex items-center gap-3">
                      <span aria-hidden="true" className="block h-0.5 w-24 bg-line-strong">
                        <span
                          className="block h-0.5 bg-accent"
                          style={{ width: `${progress}%` }}
                        />
                      </span>
                      <span className="index-mono">{progress}%</span>
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
                    <ul className="mt-1 space-y-1.5">
                      {technologies.map((tech) => (
                        <li key={tech} className="text-small text-ink-muted">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </MetaRow>
                ) : null}
              </dl>
            </div>
          </aside>
        ) : null}
      </div>

      {/* --- Previous / next ------------------------------------------------ */}
      {prev || next ? (
        <nav
          aria-label="Project navigation"
          className="hairline-t mt-20 grid gap-px pt-2 sm:grid-cols-2"
        >
          {prev ? (
            <Link to={`/projects/${prev.slug}`} className="group block py-8 pr-6">
              <span className="label-mono flex items-center gap-2">
                <Arrow className="rotate-180" />
                Previous
              </span>
              <span className="mt-3 block text-h3 text-ink transition-colors duration-200 ease-smooth group-hover:text-accent">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span aria-hidden="true" className="hidden sm:block" />
          )}

          {next ? (
            <Link
              to={`/projects/${next.slug}`}
              className={`group block border-t border-line py-8 sm:border-t-0 sm:pl-8 sm:text-right ${
                prev ? 'sm:border-l' : ''
              }`}
            >
              <span className="label-mono flex items-center gap-2 sm:justify-end">
                Next
                <Arrow />
              </span>
              <span className="mt-3 block text-h3 text-ink transition-colors duration-200 ease-smooth group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </Section>
  );
}
