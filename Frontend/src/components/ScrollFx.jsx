import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

/* ==========================================================================
   Scroll-linked motion — the one layer the CSS system can't do.

   Both effects are decorative and driven purely by scroll position (no timers,
   no mouse tracking), use GPU-friendly transform/scale only, and switch off
   entirely under prefers-reduced-motion.
   ========================================================================== */

const MotionDiv = motion.div;

/* A hairline accent bar across the very top of the page that fills as the
   document is read. Aria-hidden — it is pure ornament over real content. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  if (reduce) return null;
  return (
    <MotionDiv
      aria-hidden="true"
      style={{ scaleX: scrollYProgress, transformOrigin: '0% 50%' }}
      className="fixed inset-x-0 top-0 z-[70] h-0.5 bg-accent"
    />
  );
}

/* Translates its children a few pixels against the scroll as the block passes
   through the viewport — the quiet depth cue behind the featured covers. The
   movement is small (default ±22px) so it never opens a gap between sections,
   and the effect is removed under reduced motion. */
export function Parallax({ children, amount = 22, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <MotionDiv style={{ y, willChange: 'transform' }}>{children}</MotionDiv>
    </div>
  );
}
