import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ScrollProgress } from './ScrollFx';
import { Loader } from './ui';
import { getProfile } from '../lib/api';
import { trackPageView } from '../lib/analytics';
import useRequest from '../lib/useRequest';

const MotionDiv = motion.div;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Record an anonymous page view; project detail pages pass their slug.
    const projectMatch = pathname.match(/^\/projects\/([^/]+)$/);
    trackPageView(pathname, projectMatch ? projectMatch[1] : '');
  }, [pathname]);
  return null;
}

/* Short, subtle route transition: each page fades and rises a few pixels as it
   mounts. Keyed by pathname so it replays on navigation but not on in-page
   query changes (e.g. project filters). Enter-only — no exit — so it stays
   robust with lazy routes and never makes navigation feel delayed. Motion is
   removed entirely under prefers-reduced-motion. */
function AnimatedPage({ profile }) {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  return (
    <MotionDiv
      key={pathname}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Outlet context={{ profile }} />
    </MotionDiv>
  );
}

export default function Layout() {
  const { data: profile } = useRequest(getProfile, []);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <ScrollToTop />
      <Navbar profile={profile} />
      <main id="main" className="flex-1 pb-20 pt-10 sm:pt-14">
        <Suspense
          fallback={
            <div className="container-page">
              <Loader />
            </div>
          }
        >
          <AnimatedPage profile={profile} />
        </Suspense>
      </main>
      <Footer profile={profile} />
    </div>
  );
}
