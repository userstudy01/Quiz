import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const cover = project.screenshots?.[0]?.url;
  const technologies = project.technologies || [];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-ink/25">
      {cover ? (
        <Link to={`/projects/${project.slug}`} className="block aspect-[16/9] overflow-hidden bg-canvas">
          <img
            src={cover}
            alt={project.screenshots[0].caption || `${project.title} screenshot`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold tracking-tight">
            <Link to={`/projects/${project.slug}`} className="hover:underline">
              {project.title}
            </Link>
          </h3>
          {project.featured ? (
            <span className="shrink-0 rounded-md border border-line px-2 py-0.5 text-[11px] uppercase tracking-wide text-ink-muted">
              Featured
            </span>
          ) : null}
        </div>

        {project.category ? (
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-muted">{project.category}</p>
        ) : null}

        {project.shortDescription ? (
          <p className="mt-3 line-clamp-3 text-sm text-ink-muted">{project.shortDescription}</p>
        ) : null}

        {project.role ? (
          <p className="mt-3 text-sm">
            <span className="text-ink-muted">Role: </span>
            {project.role}
          </p>
        ) : null}

        {technologies.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {technologies.slice(0, 6).map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-line px-2 py-0.5 text-xs text-ink-muted"
              >
                {tech}
              </li>
            ))}
            {technologies.length > 6 ? (
              <li className="px-1 py-0.5 text-xs text-ink-muted">+{technologies.length - 6}</li>
            ) : null}
          </ul>
        ) : null}

        <Link
          to={`/projects/${project.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink"
          aria-label={`View case study for ${project.title}`}
        >
          View Case Study
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-5-5m5 5-5 5" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
