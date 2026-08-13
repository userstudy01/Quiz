import { ButtonLink, Section } from '../components/ui';
import useSeo from '../lib/useSeo';

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'This page does not exist.' });

  return (
    <Section className="py-24 text-center">
      <p className="text-sm uppercase tracking-[0.18em] text-ink-muted">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-ink-muted">The page you are looking for does not exist.</p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink to="/">Back home</ButtonLink>
        <ButtonLink to="/projects" variant="secondary">
          Browse projects
        </ButtonLink>
      </div>
    </Section>
  );
}
