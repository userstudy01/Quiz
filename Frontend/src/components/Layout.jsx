import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Loader } from './ui';
import { getProfile } from '../lib/api';
import { trackPageView } from '../lib/analytics';
import useRequest from '../lib/useRequest';

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

export default function Layout() {
  const { data: profile } = useRequest(getProfile, []);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar profile={profile} />
      <main className="flex-1 pb-16 pt-10 sm:pt-14">
        <Suspense fallback={<div className="container-page"><Loader /></div>}>
          <Outlet context={{ profile }} />
        </Suspense>
      </main>
      <Footer profile={profile} />
    </div>
  );
}
