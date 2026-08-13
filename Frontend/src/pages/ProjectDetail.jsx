import { Link, useParams } from 'react-router-dom';
import { ButtonLink, ErrorState, Loader, Section } from '../components/ui';
import { getProject } from '../lib/api';
import useRequest from '../lib/useRequest';
import useSeo from '../lib/useSeo';

// Renders a section only when the underlying data actually exists.
function ListBlock({ title, items }) {
  if (!items?.length) return null;
  return (
    <section className="border-t border-line pt-8">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="flex gap-3 text-ink-muted">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TextBlock({ title, text }) {
  if (!text) return null;
  return (
    <section className="border-t border-line pt-8">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-4 whitespace-pre-line text-ink-muted">{text}</p>
    </section>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading, error, reload } = useRequest(() => getProject(slug), [slug]);

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
        <Link to="/projects" className="mt-4 inline-block text-sm underline">
          Back to all projects
        </Link>
      </Section>
    );
  }

  const technologies = project.technologies || [];

  return (
    <Section>
      <Link to="/projects" className="text-sm text-ink-muted hover:text-ink">
        ← All projects
      </Link>

      <header className="mt-6 border-b border-line pb-8">
        {project.category ? (
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
            {project.category}
          </p>
        ) : null}

        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>

        {project.shortDescription ? (
          <p className="mt-4 max-w-3xl text-lg text-ink-muted">{project.shortDescription}</p>
        ) : null}

        {project.liveUrl || project.githubUrl ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl ? <ButtonLink href={project.liveUrl}>Live site</ButtonLink> : null}
            {project.githubUrl ? (
              <ButtonLink href={project.githubUrl} variant="secondary">
                Source code
              </ButtonLink>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="mt-8 space-y-8">
        <TextBlock title="Overview" text={project.description} />
        <TextBlock title="My Role" text={project.role} />

        {technologies.length ? (
          <section className="border-t border-line pt-8">
            <h2 className="text-lg font-semibold tracking-tight">Technologies</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md border border-line bg-surface px-2.5 py-1 text-sm text-ink-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <ListBlock title="Responsibilities" items={project.responsibilities} />
        <ListBlock title="Features" items={project.features} />
        <ListBlock title="Technical Work" items={project.technicalWork} />
        <ListBlock title="Improvements" items={project.improvements} />
        <ListBlock title="Challenges" items={project.challenges} />
        <ListBlock title="Solutions" items={project.solutions} />
        <TextBlock title="Results" text={project.result} />

        {project.screenshots?.length ? (
          <section className="border-t border-line pt-8">
            <h2 className="text-lg font-semibold tracking-tight">Screenshots</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {project.screenshots.map((shot, index) => (
                <figure key={`${shot.url}-${index}`}>
                  <img
                    src={shot.url}
                    alt={shot.caption || `${project.title} screenshot ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-xl border border-line bg-surface object-cover"
                  />
                  {shot.caption ? (
                    <figcaption className="mt-2 text-sm text-ink-muted">{shot.caption}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </Section>
  );
}
