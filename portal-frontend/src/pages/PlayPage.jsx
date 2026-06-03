import { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { fetchModules } from '../api/client.js';
import { ModuleViewer } from '../components/ModuleViewer.jsx';

/**
 * Drop-in module components, lazy-loaded so they only ship when needed.
 *
 * Each entry is keyed by the module's `slug` from the backend's
 * {@code /api/modules} response. Add a new entry here whenever a future
 * drop-in module is added.
 */
const DROP_IN_COMPONENTS = {
  pawplan: lazy(() => import('../modules/PawPlan.jsx')),
};

/**
 * Routes `/play/:slug` to the right module.
 *
 * Looks the slug up in /api/modules (so the backend stays the single source
 * of truth) and hands the metadata to {@link ModuleViewer}, which dispatches
 * to iframe or drop-in based on `module.dropIn`.
 */
export function PlayPage() {
  const { slug } = useParams();
  const [modules, setModules] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    fetchModules({ signal: ac.signal })
      .then(setModules)
      .catch((err) => err.name !== 'AbortError' && setError(err));
    return () => ac.abort();
  }, []);

  if (error) {
    return (
      <div className="container-page py-16">
        <div role="alert" className="card-minimal p-6 text-sm max-w-prose-tight mx-auto">
          <p className="font-medium text-ink mb-1">Couldn't reach the portal backend.</p>
          <p className="text-ink-muted">
            {error.message} Make sure the Spring Boot service is running on port 8090.
          </p>
        </div>
      </div>
    );
  }

  if (!modules) {
    return (
      <div className="grid place-items-center min-h-[60vh] text-ink-faint" role="status" aria-live="polite">
        <Loader2 size={20} className="animate-spin" />
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  const module_ = modules.find((m) => m.slug === slug);
  if (!module_) return <Navigate to="/" replace />;

  // Drop-in module: lazy-load the component, render it inside the viewer shell.
  if (module_.dropIn) {
    const DropInComponent = DROP_IN_COMPONENTS[module_.slug];
    if (!DropInComponent) {
      // Configured as drop-in but no component registered — fall back to placeholder.
      return <ModuleViewer module={module_} />;
    }
    return (
      <ModuleViewer module={module_}>
        <Suspense fallback={<DropInLoading />}>
          <DropInComponent />
        </Suspense>
      </ModuleViewer>
    );
  }

  // Iframe module: viewer handles everything itself.
  return <ModuleViewer module={module_} />;
}

function DropInLoading() {
  return (
    <div className="grid place-items-center min-h-[60vh] text-ink-faint" role="status" aria-live="polite">
      <Loader2 size={20} className="animate-spin" />
      <span className="sr-only">Loading module…</span>
    </div>
  );
}

export default PlayPage;
