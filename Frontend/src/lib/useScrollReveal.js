import { useEffect } from 'react';

/**
 * Reveals `[data-reveal]` elements inside `containerRef` as they scroll into
 * view, with an index-based stagger.
 *
 * One observer per container rather than one per card, and each element is
 * unobserved after it fires, so scrolling costs nothing once a project has
 * appeared.
 *
 * Falls back to revealing everything immediately when the user prefers reduced
 * motion or IntersectionObserver is unavailable.
 *
 * @param containerRef ref to the element wrapping the reveal targets
 * @param deps         re-run when the rendered list changes (filters, search)
 * @param step         stagger between siblings, in ms
 */
export default function useScrollReveal(containerRef, deps = [], { step = 70, max = 420 } = {}) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const targets = Array.from(root.querySelectorAll('[data-reveal]'));
    if (!targets.length) return undefined;

    const revealAll = () => targets.forEach((el) => el.classList.add('is-revealed'));

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || typeof IntersectionObserver === 'undefined') {
      revealAll();
      return undefined;
    }

    // Reset so a filter change replays the entrance.
    targets.forEach((el) => el.classList.remove('is-revealed'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const index = Number(el.dataset.revealIndex || 0);
          el.style.setProperty('--reveal-delay', `${Math.min(index * step, max)}ms`);
          el.classList.add('is-revealed');
          observer.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
