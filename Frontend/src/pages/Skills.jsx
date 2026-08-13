import { EmptyState, ErrorState, Loader, Section, SectionHeading } from '../components/ui';
import { getSkills } from '../lib/api';
import useRequest from '../lib/useRequest';
import useSeo from '../lib/useSeo';

export default function Skills() {
  const { data, loading, error, reload } = useRequest(getSkills, []);

  useSeo({
    title: 'Skills',
    description: 'Technical skills grouped by category.',
  });

  const groups = data?.groups || [];

  return (
    <Section>
      <SectionHeading eyebrow="Toolkit" title="Skills" description="Grouped by category." />

      <div className="mt-8">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : groups.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <section key={group.category} className="rounded-xl border border-line bg-surface p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  {group.category}
                </h2>
                <ul className="mt-4 space-y-2">
                  {group.items.map((skill) => (
                    <li key={skill._id} className="flex items-center justify-between text-sm">
                      <span>{skill.name}</span>
                      {skill.level ? <span className="text-ink-muted">{skill.level}</span> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState title="No skills added yet" description="Add skills from the admin panel." />
        )}
      </div>
    </Section>
  );
}
