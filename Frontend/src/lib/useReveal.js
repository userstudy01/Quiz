import { useEffect, useRef } from 'react';

// Adds `is-visible` to any element carrying the `reveal` class once it scrolls
// into view. One shared observer per mounted hook; unobserves after reveal.
export default function useReveal({ threshold = 0.14, once = true } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const targets = root.classList?.contains('reveal')
      ? [root, ...root.querySelectorAll('.reveal')]
      : root.querySelectorAll('.reveal');

    if (!targets.length) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [threshold, once]);

  return ref;
}
