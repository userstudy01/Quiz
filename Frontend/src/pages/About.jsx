import { useOutletContext } from 'react-router-dom';
import { EmptyState, Loader, Section, SectionHeading } from '../components/ui';
import { getExperience } from '../lib/api';
import useRequest from '../lib/useRequest';
import useSeo from '../lib/useSeo';

export default function About() {
  const { profile } = useOutletContext();
  const { data: experience, loading } = useRequest(getExperience, []);

  useSeo({
    title: 'About',
    description: profile?.bio?.slice(0, 160) || 'Professional introduction, experience and engineering strengths.',
    image: profile?.profileImage,
  });

  const strengths = profile?.strengths || [];

  return (
    <>
      <Section className="pb-14">
        <SectionHeading eyebrow="About" title={profile?.name || 'About me'} description={profile?.title} />

        {profile?.bio ? (
          <p className="mt-8 max-w-3xl whitespace-pre-line text-ink-muted">{profile.bio}</p>
        ) : (
          <div className="mt-8">
            <EmptyState
              title="Profile not filled in yet"
              description="Add your professional introduction from the admin panel."
            />
          </div>
        )}
      </Section>

      <Section className="pb-14">
        <SectionHeading eyebrow="Career" title="Experience" />
        {loading ? (
          <Loader />
        ) : experience?.length ? (
          <ol className="mt-8 space-y-5">
            {experience.map((item) => (
              <li key={item._id} className="rounded-xl border border-line bg-surface p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-semibold">
                    {item.role}
                    <span className="font-normal text-ink-muted"> · {item.company}</span>
                  </h3>
                  <p className="text-sm text-ink-muted">
                    {[item.startDate, item.current ? 'Present' : item.endDate].filter(Boolean).join(' — ')}
                  </p>
                </div>
                {item.summary ? (
                  <p className="mt-3 whitespace-pre-line text-sm text-ink-muted">{item.summary}</p>
                ) : null}
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-8">
            <EmptyState title="No experience entries yet" />
          </div>
        )}
      </Section>

      {strengths.length ? (
        <Section>
          <SectionHeading eyebrow="Strengths" title="Engineering strengths" />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {strengths.map((strength) => (
              <li key={strength} className="rounded-xl border border-line bg-surface p-5 text-sm">
                {strength}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
