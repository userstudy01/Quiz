import { Link, useOutletContext } from 'react-router-dom';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import { ButtonLink, EmptyState, Loader, Section, SectionHeading } from '../components/ui';
import {
  getExperience,
  getFeaturedProjects,
  getProjectFilters,
  getProjects,
  getSkills,
} from '../lib/api';
import useRequest from '../lib/useRequest';
import useReveal from '../lib/useReveal';
import useSeo from '../lib/useSeo';

function Stat({ value, label }) {
  return (
    <div className="reveal">
      <p className="text-3xl font-bold tracking-tight sm:text-4xl">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">{label}</p>
    </div>
  );
}

export default function Home() {
  const { profile } = useOutletContext();
  const { data: featured, loading: loadingFeatured } = useRequest(() => getFeaturedProjects(6), []);
  const { data: allProjects } = useRequest(() => getProjects({ limit: 1 }), []);
  const { data: meta } = useRequest(getProjectFilters, []);
  const { data: skills } = useRequest(getSkills, []);
  const { data: experience } = useRequest(getExperience, []);
  const revealRef = useReveal();

  useSeo({
    title: profile?.name ? `${profile.name} — ${profile.title || 'Developer'}` : 'Home',
    description:
      profile?.tagline || profile?.bio || 'Personal developer portfolio: projects, skills and experience.',
    image: profile?.profileImage,
  });

  const skillGroups = skills?.groups || [];
  const recentExperience = (experience || []).slice(0, 3);
  const totalProjects = allProjects?.total ?? 0;
  const totalCategories = (meta?.categories || []).length;
  const totalTech = (meta?.technologies || []).length;

  return (
    <div ref={revealRef}>
      {/* ---------- Hero ---------- */}
      <div className="relative overflow-hidden">
        {/* animated backdrop */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-grid opacity-60" />
          <div
            className="aurora animate-float-slow left-[-8%] top-[-20%] h-[26rem] w-[26rem]"
            style={{ background: 'radial-gradient(circle, var(--hero-glow-1), transparent 70%)' }}
          />
          <div
            className="aurora animate-float-slower right-[-10%] top-[-10%] h-[24rem] w-[24rem]"
            style={{ background: 'radial-gradient(circle, var(--hero-glow-2), transparent 70%)' }}
          />
          <div
            className="aurora animate-float-slow bottom-[-30%] left-[30%] h-[22rem] w-[22rem]"
            style={{ background: 'radial-gradient(circle, var(--hero-glow-3), transparent 70%)' }}
          />
        </div>

        <Section className="relative pb-16 pt-10 sm:pt-16">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <p className="reveal inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-xs font-medium text-ink-muted backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {profile?.title || 'Full-Stack Developer'}
                {profile?.location ? ` · ${profile.location}` : ''}
              </p>

              <h1
                className="reveal mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
                style={{ '--reveal-delay': '80ms' }}
              >
                {profile?.name || 'Developer Portfolio'}
                <span className="mt-2 block text-gradient">Building real products.</span>
              </h1>

              <p
                className="reveal mt-5 max-w-xl text-lg leading-relaxed text-ink-muted"
                style={{ '--reveal-delay': '160ms' }}
              >
                {profile?.tagline ||
                  'A developer who ships. Explore real, delivered projects across web platforms, portals and product builds.'}
              </p>

              <div
                className="reveal mt-8 flex flex-wrap gap-3"
                style={{ '--reveal-delay': '240ms' }}
              >
                <ButtonLink to="/projects">View Projects</ButtonLink>
                <ButtonLink to="/contact" variant="secondary">
                  Get in Touch
                </ButtonLink>
                {profile?.resumeUrl ? (
                  <ButtonLink href={profile.resumeUrl} variant="secondary">
                    Résumé
                  </ButtonLink>
                ) : null}
              </div>

              {/* stats */}
              <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
                <Stat value={totalProjects || '16'} label="Projects" />
                <Stat value={totalCategories || '—'} label="Domains" />
                <Stat value={totalTech || '—'} label="Technologies" />
              </div>
            </div>

            {profile?.profileImage ? (
              <div className="reveal justify-self-start md:justify-self-end" style={{ '--reveal-delay': '160ms' }}>
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute -inset-3 rounded-[2rem] opacity-40 blur-2xl"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#0ea5e9)' }}
                  />
                  <img
                    src={profile.profileImage}
                    alt={profile.name ? `Portrait of ${profile.name}` : 'Profile photo'}
                    loading="lazy"
                    decoding="async"
                    className="relative h-52 w-52 rounded-[1.75rem] border border-line object-cover shadow-[var(--shadow-lift)] sm:h-64 sm:w-64"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </Section>
      </div>

      {/* ---------- Featured projects (the hero of the portfolio) ---------- */}
      <Section className="py-16">
        <SectionHeading
          eyebrow="Selected work"
          title="Featured projects"
          description="Real, delivered work — from client platforms to internal portals."
          action={
            <Link
              to="/projects"
              className="text-sm font-semibold text-accent transition-colors hover:text-ink"
            >
              All projects →
            </Link>
          }
        />

        {loadingFeatured ? (
          <Loader />
        ) : featured?.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, i) => (
              <div key={project._id} className="reveal" style={{ '--reveal-delay': `${i * 70}ms` }}>
                <ProjectCard project={project} index={i} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="No featured projects yet"
              description="Mark projects as featured in the admin panel to show them here."
            />
          </div>
        )}
      </Section>

      {/* ---------- Skills preview ---------- */}
      {skillGroups.length ? (
        <Section className="pb-16">
          <SectionHeading
            eyebrow="Toolkit"
            title="Skills"
            action={
              <Link to="/skills" className="text-sm font-semibold text-accent hover:text-ink">
                All skills →
              </Link>
            }
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.slice(0, 3).map((group) => (
              <div
                key={group.category}
                className="reveal rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-soft)]"
              >
                <p className="text-sm font-semibold">{group.category}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.slice(0, 10).map((skill) => (
                    <li
                      key={skill._id}
                      className="rounded-md border border-line bg-canvas px-2 py-0.5 text-xs text-ink-muted"
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

      {/* ---------- Experience preview ---------- */}
      {recentExperience.length ? (
        <Section className="pb-16">
          <SectionHeading
            eyebrow="Background"
            title="Experience"
            action={
              <Link to="/experience" className="text-sm font-semibold text-accent hover:text-ink">
                Full timeline →
              </Link>
            }
          />
          <ul className="reveal mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-soft)]">
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

      {/* ---------- CTA ---------- */}
      <Section className="pb-8">
        <div className="reveal relative overflow-hidden rounded-3xl border border-line p-8 shadow-[var(--shadow-soft)] sm:p-10">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.07]"
            style={{ background: 'linear-gradient(120deg,#4f46e5,#7c3aed,#0ea5e9)' }}
          />
          <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Have a project in mind?</h2>
              <p className="mt-1 text-ink-muted">Send a message and I will get back to you.</p>
            </div>
            <ButtonLink to="/contact">Contact me</ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  );
}
