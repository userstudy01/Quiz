import { useEffect, useRef } from 'react';
import { ButtonLink } from './ui';

/* ==========================================================================
   Home hero.

   Everything visual comes from the Step 4 design system — tokens, glow
   utilities, easings and the hero keyframes in index.css. No animation
   library, no canvas, no images beyond the profile photo the API already
   returns.

   Content rule: only real profile data is rendered. Fields the API has not
   filled in are omitted rather than invented; the heading keeps the existing
   "Developer Portfolio" placeholder.
   ========================================================================== */

/* Abstract node field — the hero's one "engineering" visual. Coordinates are
   hand-placed in a 320×320 viewBox, decorative only, hidden from a11y tree. */
const NODES = [
  { cx: 40, cy: 58, delay: 0 },
  { cx: 132, cy: 30, delay: 0.9 },
  { cx: 250, cy: 66, delay: 1.7 },
  { cx: 292, cy: 150, delay: 0.5 },
  { cx: 226, cy: 236, delay: 2.2 },
  { cx: 118, cy: 284, delay: 1.2 },
  { cx: 30, cy: 196, delay: 2.6 },
  { cx: 96, cy: 150, delay: 0.3 },
  { cx: 186, cy: 128, delay: 1.5 },
  { cx: 160, cy: 208, delay: 2.0 },
];

const LINKS = [
  'M40,58 L132,30 L250,66',
  'M250,66 L292,150 L226,236',
  'M226,236 L118,284 L30,196 L40,58',
  'M96,150 L186,128 L160,208 Z',
  'M96,150 L40,58',
  'M186,128 L292,150',
  'M160,208 L118,284',
];

function NodeField({ profile }) {
  return (
    <div className="relative aspect-square w-full max-w-[22rem]">
      {/* Accent bloom sitting behind the panel */}
      <div aria-hidden="true" className="hero-bloom pointer-events-none absolute inset-6" />

      <svg
        viewBox="0 0 320 320"
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 h-full w-full"
      >
        <g stroke="var(--color-accent)" fill="none" strokeWidth="0.75" opacity="0.42">
          {LINKS.map((d, i) => (
            <path
              key={d}
              d={d}
              pathLength="1"
              strokeDasharray="1"
              style={{
                '--trace-length': 1,
                animation: `hero-link-trace 1400ms var(--ease-entrance) ${600 + i * 130}ms both`,
              }}
            />
          ))}
        </g>

        <g style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          {NODES.map((node) => (
            <circle
              key={`${node.cx}-${node.cy}`}
              cx={node.cx}
              cy={node.cy}
              r="3"
              fill="var(--color-accent)"
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                animation: `hero-node-pulse 5200ms var(--ease-smooth) ${node.delay}s infinite`,
              }}
            />
          ))}
        </g>
      </svg>

      {/* The profile photo becomes the centre node when one exists. */}
      {profile?.profileImage ? (
        <div className="absolute inset-0 grid place-items-center">
          <img
            src={profile.profileImage}
            alt={profile.name ? `Portrait of ${profile.name}` : 'Profile photo'}
            loading="lazy"
            decoding="async"
            className="glow-md h-36 w-36 rounded-full border border-line object-cover lg:h-44 lg:w-44"
          />
        </div>
      ) : null}
    </div>
  );
}

export default function Hero({ profile }) {
  const rootRef = useRef(null);

  /* Pointer parallax.
     Desktop pointers only, skipped entirely under reduced motion. The handler
     stores the latest position on a ref and a single rAF frame writes two CSS
     custom properties — no React state, so the hero never re-renders on move. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const finePointer = window.matchMedia('(pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reduced.matches) return undefined;

    let frame = 0;
    let pending = null;

    const apply = () => {
      frame = 0;
      if (!pending) return;
      root.style.setProperty('--hero-mx', pending.x.toFixed(3));
      root.style.setProperty('--hero-my', pending.y.toFixed(3));
    };

    const onMove = (event) => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // Normalised to -1…1 around the centre of the hero.
      pending = {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
      };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      pending = { x: 0, y: 0 };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave, { passive: true });

    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const name = profile?.name || 'Developer Portfolio';
  const strengths = (profile?.strengths || []).slice(0, 3);
  const hasMeta = Boolean(profile?.location) || strengths.length > 0;

  return (
    <section
      ref={rootRef}
      className="relative isolate overflow-hidden pb-16 pt-10 sm:pt-16 lg:pb-24 lg:pt-24"
    >
      {/* --- Ambient background ------------------------------------------- *
       * Two slow accent orbs. Each has an outer parallax wrapper and an inner
       * drifting element, so the two transforms never fight. Hidden below the
       * md breakpoint, where a single static wash is enough.                */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="hero-parallax absolute -left-24 -top-32 hidden h-[36rem] w-[36rem] md:block"
          style={{ '--hero-depth': '14px' }}
        >
          <div className="hero-orb-a h-full w-full" />
        </div>

        <div
          className="hero-parallax absolute -right-32 top-10 hidden h-[30rem] w-[30rem] md:block"
          style={{ '--hero-depth': '-10px' }}
        >
          <div className="hero-orb-b h-full w-full" />
        </div>

        {/* Mobile/tablet: one static wash instead of two animated orbs. */}
        <div className="hero-wash absolute -top-24 left-1/2 h-80 w-[36rem] -translate-x-1/2 md:hidden" />
      </div>

      <div className="container-page">
        <div className="grid items-center gap-12 md:grid-cols-[1.35fr_1fr] md:gap-10">
          {/* --- Copy ----------------------------------------------------- */}
          <div>
            {profile?.title ? (
              <p className="hero-rise label-mono text-accent">{profile.title}</p>
            ) : null}

            <h1 className="hero-rise mt-4 text-hero text-ink" style={{ animationDelay: '90ms' }}>
              {name}
            </h1>

            {profile?.tagline ? (
              <p
                className="hero-rise mt-5 max-w-reading text-body-lg text-ink-muted"
                style={{ animationDelay: '180ms' }}
              >
                {profile.tagline}
              </p>
            ) : null}

            {hasMeta ? (
              <div
                className="hero-rise mt-7 flex flex-wrap items-center gap-x-5 gap-y-2"
                style={{ animationDelay: '250ms' }}
              >
                {profile?.location ? (
                  <span className="label-mono flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
                    />
                    {profile.location}
                  </span>
                ) : null}
                {strengths.map((strength) => (
                  <span key={strength} className="label-mono">
                    {strength}
                  </span>
                ))}
              </div>
            ) : null}

            <div
              className="hero-rise mt-9 flex flex-wrap gap-3"
              style={{ animationDelay: '320ms' }}
            >
              <ButtonLink to="/projects">
                View My Work
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
              </ButtonLink>

              <ButtonLink to="/contact" variant="secondary">
                Let&apos;s Talk
              </ButtonLink>

              {profile?.resumeUrl ? (
                <ButtonLink href={profile.resumeUrl} variant="ghost">
                  Résumé
                </ButtonLink>
              ) : null}
            </div>
          </div>

          {/* --- Node field ------------------------------------------------ *
           * Hidden below md: on phones it would compete with the copy for
           * very little payoff.                                             */}
          <div className="hero-rise hidden md:block" style={{ animationDelay: '260ms' }}>
            {/* Separate element for the parallax transform: hero-rise animates
                `transform` too, and one element cannot hold both. */}
            <div
              className="hero-parallax flex justify-end"
              style={{ '--hero-depth': '6px' }}
            >
              <NodeField profile={profile} />
            </div>
          </div>

          {/* Phones keep the portrait, without the node field around it. */}
          {profile?.profileImage ? (
            <div className="hero-rise -order-1 md:hidden" style={{ animationDelay: '60ms' }}>
              <img
                src={profile.profileImage}
                alt={profile.name ? `Portrait of ${profile.name}` : 'Profile photo'}
                loading="lazy"
                decoding="async"
                className="h-28 w-28 rounded-full border border-line object-cover"
              />
            </div>
          ) : null}
        </div>

        {/* --- Scroll cue ------------------------------------------------- */}
        <div
          className="hero-rise mt-16 hidden items-center gap-3 md:flex"
          style={{ animationDelay: '460ms' }}
        >
          <span className="label-mono">Scroll</span>
          <span
            aria-hidden="true"
            className="relative block h-10 w-px overflow-hidden bg-line"
          >
            <span className="hero-scroll-dot absolute inset-x-0 top-0 block h-4 bg-accent" />
          </span>
        </div>
      </div>
    </section>
  );
}
