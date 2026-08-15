import { Link } from 'react-router-dom';

/* ==========================================================================
   Projects showcase pieces.

   Two presentations share one visual language:
     FeaturedProject — full-width editorial row, sides alternate
     ProjectTile     — grid card, width varies by position

   Only fields the API actually returns are rendered. Nothing is invented, and
   no decorative slot is filled with placeholder copy.

   Card interaction model: the "View Case Study" link carries an `after:` layer
   covering the whole card, so the entire surface is clickable while keyboard
   users get exactly one focus stop per project.
   ========================================================================== */

const projectNumber = (project, index) =>
  String(project.sortOrder ?? index + 1).padStart(2, '0');

/* Initials from the project title, e.g. "Netafim Video Portal" → "NV". */
const initials = (title = '') =>
  title
    .split(/[\s/-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('') || '—';

/* --------------------------------------------------------------------------
   Visual
   Uses the first screenshot when one exists. None of the current projects have
   images, so the fallback is built to look designed rather than missing: the
   engineering grid from `project-visual`, the project category, and the title
   initials.
   -------------------------------------------------------------------------- */
/* `caption` overrides the label shown inside the fallback artwork. The listing
   uses the category; the case study passes its technologies instead, since the
   category is already stated twice on that page. Pass null for no label. */
export function ProjectVisual({ project, className = '', caption = undefined }) {
  const shot = project.screenshots?.[0];
  const label = caption === undefined ? project.category : caption;

  if (shot?.url) {
    return (
      <div className={`overflow-hidden rounded-card border border-line bg-elevated ${className}`}>
        <img
          src={shot.url}
          alt={shot.caption || `${project.title} screenshot`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-90 transition-[transform,opacity,filter] duration-500 ease-smooth grayscale-[35%] group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`project-visual rounded-card border border-line transition-colors duration-500 ease-smooth group-hover:border-line-strong ${className}`}
    >
      {/* Kept out of the card body so the two halves do not repeat one line. */}
      {label ? (
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="label-mono text-ink-subtle">{label}</span>
        </div>
      ) : null}

      <div className="absolute inset-0 grid place-items-center">
        <span className="font-mono text-5xl font-medium tracking-tight text-ink-muted/45 transition-[color,transform] duration-500 ease-smooth group-hover:text-accent/70 sm:text-6xl">
          {initials(project.title)}
        </span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Shared bits
   -------------------------------------------------------------------------- */

function TechList({ technologies = [], limit = 6 }) {
  if (!technologies.length) return null;
  const shown = technologies.slice(0, limit);
  const rest = technologies.length - shown.length;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {shown.map((tech) => (
        <li
          key={tech}
          className="rounded-md border border-line bg-elevated px-2 py-0.5 text-meta text-ink-muted transition-colors duration-300 ease-smooth group-hover:border-line-strong"
        >
          {tech}
        </li>
      ))}
      {rest > 0 ? <li className="px-1 py-0.5 text-meta text-ink-subtle">+{rest}</li> : null}
    </ul>
  );
}

function FeaturedBadge() {
  return (
    <span className="rounded-md border border-accent/40 bg-accent-soft px-2 py-0.5 text-meta text-accent">
      Featured
    </span>
  );
}

function CaseStudyLink({ project, stretch = true }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      aria-label={`View case study for ${project.title}`}
      className={`link-arrow inline-flex items-center gap-1.5 text-small font-medium text-ink transition-colors duration-300 ease-smooth group-hover:text-accent ${
        stretch ? "after:absolute after:inset-0 after:content-['']" : ''
      }`}
    >
      View Case Study
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
    </Link>
  );
}

/* --------------------------------------------------------------------------
   Featured row
   -------------------------------------------------------------------------- */
export function FeaturedProject({ project, index, revealIndex }) {
  const flip = index % 2 === 1;

  return (
    <article
      data-reveal=""
      data-reveal-index={revealIndex}
      className="group relative grid items-center gap-6 rounded-panel border border-line bg-surface p-5 transition-[border-color,box-shadow] duration-500 ease-smooth hover:border-accent/35 hover:glow-md sm:p-6 lg:grid-cols-2 lg:gap-10 lg:p-8"
    >
      <ProjectVisual
        project={project}
        className={`aspect-[16/10] w-full ${flip ? 'lg:order-2' : ''}`}
      />

      <div className={flip ? 'lg:order-1' : ''}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-small text-accent transition-transform duration-500 ease-smooth group-hover:-translate-y-0.5">
            {projectNumber(project, index)}
          </span>
          <span className="h-px w-8 bg-line" aria-hidden="true" />
          <FeaturedBadge />
        </div>

        <h3 className="mt-4 text-h2 text-ink">{project.title}</h3>

        {project.shortDescription ? (
          <p className="mt-4 max-w-reading text-body text-ink-muted">{project.shortDescription}</p>
        ) : null}

        {project.role ? (
          <p className="mt-3 text-small text-ink-muted">
            <span className="text-ink-subtle">Role: </span>
            {project.role}
          </p>
        ) : null}

        <div className="mt-5">
          <TechList technologies={project.technologies} limit={8} />
        </div>

        <div className="mt-6">
          <CaseStudyLink project={project} />
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------------
   Grid tile
   `wide` tiles take half the row instead of a third, which is what stops the
   remaining projects reading as a uniform card wall.
   -------------------------------------------------------------------------- */
export function ProjectTile({ project, index, revealIndex, wide = false }) {
  return (
    <article
      data-reveal=""
      data-reveal-index={revealIndex}
      className={`group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-[border-color,box-shadow,transform] duration-500 ease-smooth hover:-translate-y-0.5 hover:border-accent/35 hover:glow-sm ${
        wide ? 'lg:col-span-3' : 'lg:col-span-2'
      }`}
    >
      <ProjectVisual
        project={project}
        className={`w-full rounded-none border-0 border-b border-line ${
          wide ? 'aspect-[16/9]' : 'aspect-[4/3]'
        }`}
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="font-mono text-small text-ink-subtle transition-[color,transform] duration-500 ease-smooth group-hover:-translate-y-0.5 group-hover:text-accent">
            {projectNumber(project, index)}
          </span>
          {project.featured ? <FeaturedBadge /> : null}
        </div>

        <h3 className="mt-3 text-h3 text-ink">{project.title}</h3>

        {project.shortDescription ? (
          <p className="mt-3 line-clamp-3 text-small text-ink-muted">{project.shortDescription}</p>
        ) : null}

        <div className="mt-4">
          <TechList technologies={project.technologies} limit={5} />
        </div>

        <div className="mt-5 pt-1">
          <CaseStudyLink project={project} />
        </div>
      </div>
    </article>
  );
}
