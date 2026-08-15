import { Link } from 'react-router-dom';
import { projectVisual } from '../lib/projectVisual';

const pad = (n) => String(n).padStart(2, '0');

// Wide editorial treatment for featured projects: large abstract cover on one
// side, content on the other. Falls back to a real screenshot when present.
export default function FeatureProjectCard({ project, index }) {
  const cover = project.screenshots?.[0]?.url;
  const technologies = project.technologies || [];
  const visual = projectVisual(project);

  return (
    <article className="group card-hover relative grid overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] md:grid-cols-2">
      <Link
        to={`/projects/${project.slug}`}
        className="sheen relative block aspect-[16/10] overflow-hidden md:aspect-auto"
        aria-label={`View ${project.title}`}
      >
        {cover ? (
          <img
            src={cover}
            alt={project.screenshots[0].caption || `${project.title} screenshot`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="relative h-full min-h-[15rem] w-full transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ background: visual.gradient }}
          >
            <div className="absolute inset-0 bg-grid opacity-30 mix-blend-overlay" />
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/20" />
            <div className="absolute bottom-6 left-6 h-14 w-14 rounded-xl border border-white/25" />
            <div className="absolute right-8 bottom-10 h-6 w-24 rounded-full bg-white/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl font-bold tracking-tight text-white/95 drop-shadow sm:text-8xl">
                {visual.initials}
              </span>
            </div>
          </div>
        )}
      </Link>

      <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          {typeof index === 'number' ? (
            <span className="font-mono text-sm text-ink-muted">{pad(index + 1)}</span>
          ) : null}
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
            ★ Featured
          </span>
          {project.category ? (
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {project.category}
            </span>
          ) : null}
        </div>

        <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
          <Link to={`/projects/${project.slug}`} className="transition-colors hover:text-accent">
            {project.title}
          </Link>
        </h3>

        {project.shortDescription ? (
          <p className="max-w-prose leading-relaxed text-ink-muted">{project.shortDescription}</p>
        ) : null}

        {project.role ? (
          <p className="text-sm text-ink">
            <span className="text-ink-muted">Role · </span>
            {project.role}
          </p>
        ) : null}

        {technologies.length ? (
          <ul className="flex flex-wrap gap-1.5">
            {technologies.slice(0, 7).map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-line bg-canvas px-2 py-0.5 text-xs text-ink-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        <Link
          to={`/projects/${project.slug}`}
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ink"
          aria-label={`View case study for ${project.title}`}
        >
          View case study
          <svg
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-5-5m5 5-5 5" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
