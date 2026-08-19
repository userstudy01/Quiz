import { Arrow, ButtonLink, Section } from '../components/ui';
import useSeo from '../lib/useSeo';

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'This page does not exist.' });

  return (
    <Section className="py-20 sm:py-28">
      <p className="rise label-mono text-accent">Error 404</p>
      <h1 className="rise mt-6 text-h1 text-ink" style={{ animationDelay: '70ms' }}>
        This page does not exist.
      </h1>
      <p
        className="rise mt-6 measure text-body-lg text-ink-muted"
        style={{ animationDelay: '140ms' }}
      >
        The address may have changed, or the page was never here. The work is all in the archive.
      </p>
      <div className="rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: '200ms' }}>
        <ButtonLink to="/projects">
          View Projects
          <Arrow />
        </ButtonLink>
        <ButtonLink to="/" variant="secondary">
          Back home
        </ButtonLink>
      </div>
    </Section>
  );
}
