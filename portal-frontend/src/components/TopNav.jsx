import { Link, NavLink, useLocation } from 'react-router-dom';
import { CatLogo } from './CatLogo.jsx';
import { Wordmark } from './Wordmark.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';

const NAV_ITEMS = [
  { to: '/',     label: 'Home' },
  { to: '/team', label: 'Team' },
];

export function TopNav() {
  const { pathname } = useLocation();
  // Hide nav while inside the module viewer — the viewer has its own slim top bar.
  const isPlaying = pathname.startsWith('/play/');
  if (isPlaying) return null;

  return (
    <header className="border-b border-line/60 bg-canvas/80 backdrop-blur-md sticky top-0 z-30">
      <div className="container-page flex h-14 items-center justify-between">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 text-ink hover:text-accent transition-colors duration-200"
          aria-label="Pawwwy — home"
        >
          <CatLogo size={22} strokeWidth={1.75} className="text-accent" />
          <Wordmark sizeClass="text-xl" />
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `
                px-3 py-1.5 text-sm rounded-md transition-colors duration-200
                ${isActive
                  ? 'text-ink'
                  : 'text-ink-muted hover:text-ink'}
              `}
            >
              {item.label}
            </NavLink>
          ))}
          <span className="mx-2 h-5 w-px bg-line" aria-hidden="true" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export default TopNav;
