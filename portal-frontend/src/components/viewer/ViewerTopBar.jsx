import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Slim top bar shown inside the module viewer.
 *
 * Left:    [← Back]
 * Center:  [● Module name]    (subtle wordmark of the module)
 * Right:   [Role tag · author initials]
 *
 * Designed to be visually quiet — most of the screen real estate is given to
 * the module itself.
 */
export function ViewerTopBar({ module: m }) {
  const navigate = useNavigate();

  // First initials of the author — quiet visual signature in the corner
  const initials = m.author
    .split(' ')
    .map((s) => s[0])
    .slice(0, 3)
    .join('');

  return (
    <header
      className="
        flex items-center justify-between h-12
        px-4 sm:px-6
        border-b border-line
        bg-canvas/85 backdrop-blur-md
        relative z-10
      "
    >
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="
          inline-flex items-center gap-2 text-sm text-ink-muted
          hover:text-ink transition-colors duration-200
          -ml-1.5 px-1.5 py-1 rounded
        "
        aria-label="Back to portal"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Module identity */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className="h-1.5 w-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: m.accentColor }}
          aria-hidden="true"
        />
        <span className="font-display tracking-tightest text-ink text-base truncate">
          {m.name}
        </span>
      </div>

      {/* Right side: role + initials. On mobile show only initials. */}
      <div className="flex items-center gap-3 text-xs text-ink-faint">
        <span className="hidden sm:inline uppercase tracking-[0.16em]">{m.role}</span>
        <span className="hidden sm:inline h-3 w-px bg-line" aria-hidden="true" />
        <span className="font-mono tracking-tight">{initials}</span>
      </div>
    </header>
  );
}

export default ViewerTopBar;
