import { EmptyState, ErrorState, Loader, Section, SectionHeading } from '../components/ui';
import { getExperience } from '../lib/api';
import useRequest from '../lib/useRequest';
import useSeo from '../lib/useSeo';

export default function Experience() {
  const { data, loading, error, reload } = useRequest(getExperience, []);

  useSeo({
    title: 'Experience',
    description: 'Professional experience timeline.',
  });

  const items = data || [];

  return (
    <Section>
      <SectionHeading eyebrow="Background" title="Experience" />

      <div className="mt-8">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : items.length ? (
          <ol className="relative space-y-6 border-l border-line pl-6">
            {items.map((item) => (
              <li key={item._id} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.9rem] top-2 h-2.5 w-2.5 rounded-full border border-line bg-surface"
                />
                <article className="rounded-xl border border-line bg-surface p-6">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h2 className="font-semibold">
                      {item.role}
                      <span className="font-normal text-ink-muted"> · {item.company}</span>
                    </h2>
                    <p className="text-sm text-ink-muted">
                      {[item.startDate, item.current ? 'Present' : item.endDate]
                        .filter(Boolean)
                        .join(' — ')}
                    </p>
                  </div>

                  {item.location || item.employmentType ? (
                    <p className="mt-1 text-sm text-ink-muted">
                      {[item.location, item.employmentType].filter(Boolean).join(' · ')}
                    </p>
                  ) : null}

                  {item.summary ? (
                    <p className="mt-3 whitespace-pre-line text-sm text-ink-muted">{item.summary}</p>
                  ) : null}

                  {item.highlights?.length ? (
                    <ul className="mt-4 space-y-2">
                      {item.highlights.map((highlight, index) => (
                        <li key={index} className="flex gap-3 text-sm text-ink-muted">
                          <span
                            aria-hidden="true"
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40"
                          />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {item.technologies?.length ? (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {item.technologies.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-md border border-line px-2 py-0.5 text-xs text-ink-muted"
                        >
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
          <EmptyState title="No experience added yet" description="Add entries from the admin panel." />
        )}
      </div>
    </Section>
  );
}
