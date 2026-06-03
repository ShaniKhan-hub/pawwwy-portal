import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewerTopBar } from './viewer/ViewerTopBar.jsx';
import { IframeRenderer } from './viewer/IframeRenderer.jsx';
import { DropInPlaceholder } from './viewer/DropInPlaceholder.jsx';

/**
 * Full-viewport shell for one module.
 *
 * <p>Two modes, dispatched on {@code module.dropIn}:
 * <ul>
 *   <li><b>iframe</b> — {@link IframeRenderer} embeds the deployed module URL,
 *       with phased loading messages and an error/retry path.</li>
 *   <li><b>drop-in</b> — renders {@code children} (the React component for the
 *       module) directly. Phase 6 fills this with PawPlan.</li>
 * </ul>
 *
 * <p>Same chrome in both cases: slim top bar, full-bleed body, ESC-to-exit.
 */
export function ModuleViewer({ module: m, children }) {
  const navigate = useNavigate();

  // ESC returns to home from anywhere inside the viewer.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex flex-col bg-canvas">
      <ViewerTopBar module={m} />
      {m.dropIn ? (
        <div className="relative flex-1 overflow-y-auto bg-surface">
          {children ?? <DropInPlaceholder module={m} />}
        </div>
      ) : (
        <IframeRenderer module={m} />
      )}
    </div>
  );
}

export default ModuleViewer;
