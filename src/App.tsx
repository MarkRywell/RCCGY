import { Route, Routes, Outlet } from 'react-router-dom';
import { lazy, Suspense} from 'react';

import Header from './layout/Header.tsx';
import Nav from './layout/Nav.tsx';
import Footer from './layout/Footer.tsx';
import Loader from './components/Loader.tsx';
import AdminGuard from './components/AdminGuard.tsx';
import MemberGuard from './components/MemberGuard.tsx';

const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const Partners = lazy(() => import('./pages/Partners'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const MemberProfile = lazy(() => import('./pages/MemberProfile'));
const MemberMe = lazy(() => import('./pages/MemberMe'));
const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));
const SetPassword = lazy(() => import('./pages/SetPassword'));


  function PublicLayout() {
    // move all your hideHeader state + scroll useEffect here

    return (
      <div className="min-h-dvh w-full">
        <div className="sticky top-0 z-50">
          <Header />
          <Nav />
        </div>
        <Outlet />   {/* ← child routes render here */}
        <Footer />
      </div>
    );
  }


function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public shell */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/member/me" element={<MemberGuard><MemberMe /></MemberGuard>} />
          <Route path="/member/:slug" element={<MemberProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin shell — no Header/Nav/Footer */}
        <Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />
      </Routes>
    </Suspense>
  );
}

export default App;
