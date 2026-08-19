import { useRef } from 'react';
import { Arrow, ButtonLink, ErrorState, Loader, PageHeader, Section } from '../components/ui';
import { getExperience } from '../lib/api';
import useRequest from '../lib/useRequest';
import useScrollReveal from '../lib/useScrollReveal';
import useSeo from '../lib/useSeo';

/* ==========================================================================
   Experience.

   A ruled timeline driven entirely by the experience collection. When that
   collection is empty the page says so plainly and points at the work — it
   never fabricates a role, a company or a date.
   ========================================================================== */

export default function Experience() {
  const { data, loading, error, reload } = useRequest(getExperience, []);
  const items = data || [];

  const bodyRef = useRef(null);
  useScrollReveal(bodyRef, [items.length]);

  useSeo({
    title: 'Experience',
    description: 'Professional experience timeline.',
  });

  return (
    <Section>
      <PageHeader
        eyebrow="Background"
        title="Experience"
        lede="Roles, engagements and the work each one covered."
        meta={items.length ? `${items.length} Entr${items.length === 1 ? 'y' : 'ies'}` : undefined}
      />

      <div ref={bodyRef} className="mt-12">
        {loading ? (
          <Loader label="Loading experience…" />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : items.length ? (
          <ol className="relative">
            {/* The rule the timeline hangs from. Drawn on entry, decorative. */}
            <span
              aria-hidden="true"
              className="timeline-rule absolute left-[3px] top-2 hidden h-[calc(100%-1rem)] w-px bg-line sm:block"
            />

            {items.map((item, index) => (
              <li
                key={item._id}
                data-reveal=""
                data-reveal-index={index}
                className="relative sm:pl-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-9 hidden h-[7px] w-[7px] rounded-full border border-line-strong bg-canvas sm:block"
                />

                <article className="hairline-t py-8">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <h2 className="text-h2 text-ink">{item.role}</h2>
                      {item.company ? (
                        <p className="mt-1.5 text-body text-ink-muted">{item.company}</p>
                      ) : null}
                    </div>

                    <p className="label-mono shrink-0 sm:text-right">
                      {[item.startDate, item.current ? 'Present' : item.endDate]
                        .filter(Boolean)
                        .join(' — ')}
                    </p>
                  </div>

                  {item.location || item.employmentType ? (
                    <p className="mt-3 label-mono">
                      {[item.location, item.employmentType].filter(Boolean).join(' · ')}
                    </p>
                  ) : null}

                  {item.summary ? (
                    <p className="mt-5 measure whitespace-pre-line text-body text-ink-muted">
                      {item.summary}
                    </p>
                  ) : null}

                  {item.highlights?.length ? (
                    <ul className="mt-6 measure">
                      {item.highlights.map((highlight, i) => (
                        <li
                          key={i}
                          className="flex gap-4 border-b border-line py-3 text-small text-ink-muted last:border-0"
                        >
                          <span className="index-mono shrink-0 pt-0.5 text-ink-subtle">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {item.technologies?.length ? (
                    <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                      {item.technologies.map((tech) => (
                        <li key={tech} className="label-mono text-ink-muted">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        ) : (
          <div className="hairline-t pt-16 text-center sm:pt-24">
            <p className="mx-auto measure font-display text-h2 text-ink">
              The timeline is not published yet.
            </p>
            <p className="mx-auto mt-4 max-w-md text-body text-ink-muted">
              Roles and engagements are added from the admin panel. In the meantime, the delivered
              work speaks for itself.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink to="/projects">
                View Projects
                <Arrow />
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
