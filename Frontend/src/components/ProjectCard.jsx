import { Link } from 'react-router-dom';
import { projectVisual } from '../lib/projectVisual';

const pad = (n) => String(n).padStart(2, '0');

export default function ProjectCard({ project, index }) {
  const cover = project.screenshots?.[0]?.url;
  const technologies = project.technologies || [];
  const visual = projectVisual(project);

  return (
    <article className="group card-hover relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]">
      {/* Cover: real screenshot if present, otherwise a deterministic abstract cover */}
      <Link
        to={`/projects/${project.slug}`}
        className="sheen relative block aspect-[16/10] overflow-hidden"
        aria-label={`View ${project.title}`}
      >
        {cover ? (
          <img
            src={cover}
            alt={project.screenshots[0].caption || `${project.title} screenshot`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="relative h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
            style={{ background: visual.gradient }}
          >
            <div className="absolute inset-0 bg-grid opacity-30 mix-blend-overlay" />
            {/* abstract geometric accents */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full border border-white/20" />
            <div className="absolute bottom-4 left-4 h-10 w-10 rounded-lg border border-white/25" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold tracking-tight text-white/95 drop-shadow-sm sm:text-6xl">
                {visual.initials}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/25 to-transparent" />
          </div>
        )}

        {typeof index === 'number' ? (
          <span className="absolute right-3 top-3 rounded-md bg-black/30 px-2 py-0.5 font-mono text-xs font-medium text-white/90 backdrop-blur">
            {pad(index + 1)}
          </span>
        ) : null}

        {project.featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent backdrop-blur">
            ★ Featured
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {project.category ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
            {project.category}
          </p>
        ) : null}

        <h3 className="mt-1.5 text-lg font-semibold tracking-tight">
          <Link to={`/projects/${project.slug}`} className="transition-colors hover:text-accent">
            {project.title}
          </Link>
        </h3>

        {project.shortDescription ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
            {project.shortDescription}
          </p>
        ) : null}

        {project.role ? (
          <p className="mt-3 text-sm text-ink">
            <span className="text-ink-muted">Role · </span>
            {project.role}
          </p>
        ) : null}

        {technologies.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {technologies.slice(0, 5).map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-line bg-canvas px-2 py-0.5 text-xs text-ink-muted"
              >
                {tech}
              </li>
            ))}
            {technologies.length > 5 ? (
              <li className="px-1 py-0.5 text-xs text-ink-muted">+{technologies.length - 5}</li>
            ) : null}
          </ul>
        ) : null}

        <Link
          to={`/projects/${project.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink"
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
