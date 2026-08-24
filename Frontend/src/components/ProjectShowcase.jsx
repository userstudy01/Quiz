import { Link } from 'react-router-dom';
import { Arrow } from './ui';
import { ProjectArtwork } from './Artwork';
import { Parallax } from './ScrollFx';
import { monogram, plateStyle } from '../lib/projectArt';
import { projectNumber, projectStatus } from '../lib/projectFields';

/* ==========================================================================
   Project presentation.

   Three treatments, one visual language — a mono index number, a serif title,
   ruled structure and a single arrow affordance:

     ProjectPlate    the artwork (real screenshot, or a deterministic plate)
     FeaturedProject the wide editorial spread used for featured work
     ProjectIndexRow the ruled archive row used for everything else

   Only fields the API actually returns are rendered. Nothing is invented and
   no slot is padded with placeholder copy.

   Interaction model: the row/spread is a `group`, and the case-study link
   carries an `after:` layer covering the whole surface. The entire block is
   clickable while keyboard users get exactly one focus stop per project.
   ========================================================================== */

/* --- Artwork -------------------------------------------------------------- */

export function ProjectPlate({
  project,
  className = '',
  label = undefined,
  size = 'md',
  priority = false,
  fit = 'slice',
}) {
  const shot = project.screenshots?.[0];
  const caption = label === undefined ? project.category : label;

  /* A real capture always wins. Only when the database has none does the
     project fall back to the drawn plate below. */
  if (shot?.url) {
    return (
      <div className={`visual-frame ${className}`}>
        <img
          src={shot.url}
          alt={shot.caption || `${project.title} — screenshot`}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
        />
        {caption ? (
          <div className="visual-scrim">
            <span className="label-mono">{caption}</span>
          </div>
        ) : null}
      </div>
    );
  }

  const markSize = size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-5xl sm:text-6xl' : 'text-4xl';

  return (
    <div style={plateStyle(project)} className={`plate visual-frame ${className}`}>
      {/* The drawing itself is decoration; the surrounding row already names
          the project, its category and its technologies in text. */}
      <div aria-hidden="true" className="absolute inset-0">
        <ProjectArtwork project={project} fit={fit} />
      </div>

      {/* Monogram sits top-left so it never fights the motif's centre. */}
      <div aria-hidden="true" className="absolute left-4 top-3.5">
        <span
          className={`font-display ${markSize} leading-none text-ink-subtle transition-colors duration-500 ease-smooth group-hover:text-accent`}
        >
          {monogram(project.title)}
        </span>
      </div>

      {caption ? (
        <div className="visual-scrim flex items-end justify-between gap-4">
          <span className="label-mono">{caption}</span>
          {size !== 'sm' ? (
            <span className="label-mono text-ink-subtle">Artwork</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/* --- Shared bits ---------------------------------------------------------- */

export function TechList({ technologies = [], limit = 6, className = '' }) {
  if (!technologies.length) return null;
  const shown = technologies.slice(0, limit);
  const rest = technologies.length - shown.length;

  return (
    <ul className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 ${className}`}>
      {shown.map((tech) => (
        <li key={tech} className="label-mono text-ink-muted">
          {tech}
        </li>
      ))}
      {rest > 0 ? <li className="label-mono">+{rest}</li> : null}
    </ul>
  );
}

function CaseStudyLink({ project, stretch = true, children = 'Read case study' }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      aria-label={`Read the case study for ${project.title}`}
      className={`link-arrow inline-flex items-center gap-2 text-small font-medium text-ink transition-colors duration-200 ease-smooth group-hover:text-accent ${
        stretch ? "after:absolute after:inset-0 after:content-['']" : ''
      }`}
    >
      <span className="link-underline">{children}</span>
      <Arrow />
    </Link>
  );
}

function StatusMark({ status }) {
  if (!status) return null;
  return (
    <span className="label-mono flex items-center gap-2">
      <span aria-hidden="true" className="inline-block h-1 w-1 rounded-full bg-accent" />
      {status}
    </span>
  );
}

/* --- Featured spread ------------------------------------------------------ *
 * No enclosing card: a hairline above, generous air, and alternating sides.  */
export function FeaturedProject({ project, index, revealIndex }) {
  const flip = index % 2 === 1;
  const status = projectStatus(project);

  return (
    <article
      data-reveal=""
      data-reveal-index={revealIndex}
      className="group hairline-t relative grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-2 lg:gap-16"
    >
      <Parallax className={flip ? 'lg:order-2' : ''}>
        <ProjectPlate
          project={project}
          size="lg"
          priority={index === 0}
          className="aspect-[16/11] w-full"
        />
      </Parallax>

      <div className={flip ? 'lg:order-1' : ''}>
        <div className="flex items-center gap-4">
          <span className="index-mono text-accent">{projectNumber(project, index)}</span>
          <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
          <span className="label-mono">Featured</span>
        </div>

        <h3 className="mt-5 text-h2 text-ink transition-colors duration-300 ease-smooth group-hover:text-accent">
          {project.title}
        </h3>

        {project.category ? (
          <p className="mt-2 text-small text-ink-subtle">{project.category}</p>
        ) : null}

        {project.shortDescription ? (
          <p className="mt-5 measure text-body text-ink-muted">{project.shortDescription}</p>
        ) : null}

        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
          {project.role ? (
            <div>
              <dt className="label-mono">Role</dt>
              <dd className="mt-1 text-small text-ink">{project.role}</dd>
            </div>
          ) : null}
          {status ? (
            <div>
              <dt className="label-mono">Status</dt>
              <dd className="mt-1 text-small text-ink">{status}</dd>
            </div>
          ) : null}
        </dl>

        <TechList technologies={project.technologies} limit={8} className="mt-6" />

        <div className="mt-8">
          <CaseStudyLink project={project} />
        </div>
      </div>
    </article>
  );
}

/* --- Archive row ---------------------------------------------------------- *
 * A ruled index entry. Deliberately not a card: the archive should read like
 * a contents page, so nothing here looks like filler next to the spreads.    */
export function ProjectIndexRow({ project, index, revealIndex }) {
  const status = projectStatus(project);

  return (
    <article
      data-reveal=""
      data-reveal-index={revealIndex}
      className="group hairline-t relative transition-colors duration-300 ease-smooth"
    >
      <div className="grid gap-5 py-8 sm:grid-cols-[auto_10rem_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[auto_13rem_minmax(0,1fr)]">
        <span className="index-mono pt-1 text-ink-subtle transition-colors duration-300 ease-smooth group-hover:text-accent">
          {projectNumber(project, index)}
        </span>

        <ProjectPlate
          project={project}
          size="sm"
          label={null}
          className="aspect-[16/9] w-full sm:aspect-[4/3]"
        />

        <div>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="text-h3 text-ink transition-colors duration-300 ease-smooth group-hover:text-accent">
              {project.title}
            </h3>
            {project.category ? (
              <span className="label-mono">{project.category}</span>
            ) : null}
          </div>

          {project.shortDescription ? (
            <p className="mt-3 measure text-small text-ink-muted">{project.shortDescription}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2">
            {project.role ? (
              <span className="label-mono">
                Role — <span className="text-ink-muted">{project.role}</span>
              </span>
            ) : null}
            <StatusMark status={status} />
          </div>

          <TechList technologies={project.technologies} limit={6} className="mt-4" />

          <div className="mt-5">
            <CaseStudyLink project={project} />
          </div>
        </div>
      </div>
    </article>
  );
}

/* --- Compact row ---------------------------------------------------------- *
 * Used on the home page beneath the featured spreads: title, category and an
 * arrow, nothing else. Keeps the route to all 16 projects one click away.    */
export function ProjectCompactRow({ project, index, revealIndex }) {
  return (
    <li data-reveal="" data-reveal-index={revealIndex} className="hairline-t">
      <Link
        to={`/projects/${project.slug}`}
        className="group flex items-baseline gap-4 py-4 transition-colors duration-200 ease-smooth sm:gap-6"
      >
        <span className="index-mono text-ink-subtle transition-colors duration-200 ease-smooth group-hover:text-accent">
          {projectNumber(project, index)}
        </span>

        <span className="min-w-0 flex-1">
          <span className="link-underline text-body text-ink transition-colors duration-200 ease-smooth group-hover:text-accent">
            {project.title}
          </span>
          {project.category ? (
            <span className="mt-1 block label-mono sm:mt-0 sm:ml-4 sm:inline">
              {project.category}
            </span>
          ) : null}
        </span>

        <Arrow className="shrink-0 text-ink-subtle transition-colors duration-200 ease-smooth group-hover:text-accent" />
      </Link>
    </li>
  );
}
