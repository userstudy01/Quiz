import { Link, useOutletContext } from 'react-router-dom';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import { ButtonLink, EmptyState, Loader, Section, SectionHeading } from '../components/ui';
import { getExperience, getFeaturedProjects, getSkills } from '../lib/api';
import useRequest from '../lib/useRequest';
import useSeo from '../lib/useSeo';

export default function Home() {
  const { profile } = useOutletContext();
  const { data: featured, loading: loadingFeatured } = useRequest(() => getFeaturedProjects(6), []);
  const { data: skills } = useRequest(getSkills, []);
  const { data: experience } = useRequest(getExperience, []);

  useSeo({
    title: profile?.name ? `${profile.name} — ${profile.title || 'Developer'}` : 'Home',
    description:
      profile?.tagline || profile?.bio || 'Personal developer portfolio: projects, skills and experience.',
    image: profile?.profileImage,
  });

  const skillGroups = skills?.groups || [];
  const recentExperience = (experience || []).slice(0, 3);

  return (
    <>
      <Hero profile={profile} />

      {/* Introduction */}
      {profile?.bio ? (
        <Section className="pb-16">
          <SectionHeading eyebrow="Introduction" title="About my work" />
          <p className="mt-6 max-w-3xl whitespace-pre-line text-ink-muted">{profile.bio}</p>
        </Section>
      ) : null}

      {/* Featured projects */}
      <Section className="pb-16">
        <SectionHeading
          eyebrow="Selected work"
          title="Featured projects"
          action={
            <Link to="/projects" className="text-sm font-medium hover:underline">
              All projects →
            </Link>
          }
        />

        {loadingFeatured ? (
          <Loader />
        ) : featured?.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState
              title="No featured projects yet"
              description="Mark projects as featured in the admin panel to show them here."
            />
          </div>
        )}
      </Section>

      {/* Skills preview */}
      {skillGroups.length ? (
        <Section className="pb-16">
          <SectionHeading
            eyebrow="Toolkit"
            title="Skills"
            action={
              <Link to="/skills" className="text-sm font-medium hover:underline">
                All skills →
              </Link>
            }
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.slice(0, 3).map((group) => (
              <div key={group.category} className="rounded-xl border border-line bg-surface p-5">
                <p className="text-sm font-semibold">{group.category}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.slice(0, 10).map((skill) => (
                    <li
                      key={skill._id}
                      className="rounded-md border border-line px-2 py-0.5 text-xs text-ink-muted"
                    >
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Experience preview */}
      {recentExperience.length ? (
        <Section className="pb-16">
          <SectionHeading
            eyebrow="Background"
            title="Experience"
            action={
              <Link to="/experience" className="text-sm font-medium hover:underline">
                Full timeline →
              </Link>
            }
          />
          <ul className="mt-8 divide-y divide-line rounded-xl border border-line bg-surface">
            {recentExperience.map((item) => (
              <li key={item._id} className="flex flex-col gap-1 p-5 sm:flex-row sm:justify-between">
                <div>
                  <p className="font-medium">{item.role}</p>
                  <p className="text-sm text-ink-muted">{item.company}</p>
                </div>
                <p className="text-sm text-ink-muted">
                  {[item.startDate, item.current ? 'Present' : item.endDate].filter(Boolean).join(' — ')}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* CTA */}
      <Section>
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-line bg-surface p-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Have a project in mind?</h2>
            <p className="mt-1 text-ink-muted">Send a message and I will get back to you.</p>
          </div>
          <ButtonLink to="/contact">Contact me</ButtonLink>
        </div>
      </Section>
    </>
  );
}
