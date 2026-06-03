import { Outlet, useLocation } from 'react-router-dom';
import { TopNav } from '../components/TopNav.jsx';
import { Footer } from '../components/Footer.jsx';

/**
 * App-wide shell.
 *
 * Footer is hidden inside the module viewer (/play/*) because the viewer takes
 * over the full viewport.
 */
export function AppLayout() {
  const { pathname } = useLocation();
  const isPlaying = pathname.startsWith('/play/');

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <TopNav />
      <main className={`flex-1 ${isPlaying ? '' : 'pt-2'}`}>
        <Outlet />
      </main>
      {!isPlaying && <Footer />}
    </div>
  );
}

export default AppLayout;
