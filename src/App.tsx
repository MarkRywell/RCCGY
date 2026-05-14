import { Route, Routes, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';

import Header from './layout/Header.tsx';
import Nav from './layout/Nav.tsx';
import Footer from './layout/Footer.tsx';
import Loader from './components/Loader.tsx';

const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const Partners = lazy(() => import('./pages/Partners'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const MemberProfile = lazy(() => import('./pages/MemberProfile'));
const Login = lazy(() => import('./pages/Login'));


function App() {
  const location = useLocation();
  const [hideHeader, setHideHeader] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Home | RCCGY',
      '/events': 'Events | RCCGY',
      '/partners': 'Partners | RCCGY',
      '/about': 'About | RCCGY',
      '/contact': 'Contact | RCCGY',
      '/login': 'Login | RCCGY'
    };

    const isMemberRoute = location.pathname.startsWith('/member/');

    const title = isMemberRoute
      ? 'Member Profile | RCCGY'
      : (titles[location.pathname] ?? 'Page Not Found | RCCGY');

    document.title = title;
  }, [location.pathname]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const lastY = lastScrollYRef.current;
        const delta = currentY - lastY;

        // Near the top, always show the header.
        if (currentY <= 8) {
          setHideHeader(false);
        } else if (Math.abs(delta) > 4) {
          // Scroll direction: down hides, up shows.
          if (delta > 0) setHideHeader(true);
          else setHideHeader(false);
        }

        lastScrollYRef.current = currentY;
        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="min-h-dvh w-full overflow-x-hidden">
        {/* Sticky stack: Header collapses, Nav stays visible */}
        <div className="sticky top-0 z-50">
          <Header hidden={hideHeader} />
          <Nav />
        </div>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/member/:slug" element={<MemberProfile />} />
            <Route path="/login" element={<Login />} />

            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </>
  );
}

export default App;
