import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';

/**
 * Iframe renderer with phased loading messaging.
 *
 * <p>Render's free tier sleeps a service after ~15 minutes of no traffic and
 * cold-starts can take 30–50 seconds. We can't directly observe the embedded
 * site's readiness (cross-origin), but the iframe's {@code load} event fires
 * when the navigation finishes. We use that, plus a timeline of escalating
 * messages, to give the user something honest to look at while they wait.
 *
 * Timeline:
 *   0–6s    "Loading the module…"          (just a spinner)
 *   6–18s   "Still connecting…"            (waking up hint)
 *  18–35s   "Backend is waking up…"        (explicit cold-start explanation)
 *   35s+    Error state with a Retry button.
 *
 * The iframe stays in the DOM the whole time. As soon as {@code load} fires,
 * the overlay fades and the module is revealed.
 */

const PHASES = [
  { at:     0, message: 'Loading the module…' },
  { at:  6000, message: 'Still connecting — first visits can be slow.' },
  { at: 18000, message: "The module's backend may be waking up from sleep. This can take 30–45 seconds on Render's free tier." },
];
const TIMEOUT_MS = 35000;

export function IframeRenderer({ module: m }) {
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Reset state when reloadKey bumps (Retry pressed).
  useEffect(() => {
    setReady(false);
    setTimedOut(false);
    setPhase(0);

    const phaseTimers = PHASES.slice(1).map((p, i) =>
      setTimeout(() => setPhase(i + 1), p.at)
    );
    const timeoutTimer = setTimeout(() => setTimedOut(true), TIMEOUT_MS);

    return () => {
      phaseTimers.forEach(clearTimeout);
      clearTimeout(timeoutTimer);
    };
  }, [reloadKey]);

  const onLoad = () => {
    setReady(true);
    setTimedOut(false);
  };

  const retry = () => setReloadKey((k) => k + 1);

  const showOverlay = !ready && !timedOut;
  const showError   = !ready && timedOut;

  return (
    <div className="relative flex-1 bg-surface">
      <iframe
        key={reloadKey}
        src={m.iframeUrl}
        title={m.name}
        onLoad={onLoad}
        allow="fullscreen; clipboard-read; clipboard-write"
        className="absolute inset-0 w-full h-full border-0"
        // No sandbox attribute — these are trusted, group-owned modules.
        // We deliberately want them to have full DOM/storage/JS access.
      />

      <AnimatePresence>
        {showOverlay && (
          <LoadingOverlay key="loading" phase={phase} accent={m.accentColor} />
        )}
        {showError && (
          <ErrorOverlay key="error" module={m} onRetry={retry} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------------------------------------- Loading UI -- */

function LoadingOverlay({ phase, accent }) {
  const message = PHASES[phase].message;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      className="absolute inset-0 grid place-items-center bg-canvas/95 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-5 max-w-prose-tight px-6 text-center">
        <div className="relative">
          <Loader2
            size={28}
            strokeWidth={1.5}
            className="animate-spin"
            style={{ color: accent }}
          />
        </div>

        {/* Crossfade between phase messages */}
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-ink-muted leading-relaxed"
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------ Error UI -- */

function ErrorOverlay({ module: m, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      className="absolute inset-0 grid place-items-center bg-canvas/95 backdrop-blur-sm"
      role="alert"
    >
      <div className="max-w-prose-tight px-6 text-center">
        <AlertTriangle
          size={32}
          strokeWidth={1.5}
          className="text-ink-faint mx-auto mb-5"
          aria-hidden="true"
        />
        <h3 className="font-display text-2xl tracking-tightest text-ink mb-3">
          {m.name} didn't load
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed mb-2">
          The module's backend didn't respond within 35 seconds.
          On Render's free tier, services sleep after 15 minutes of inactivity and can take
          a while to wake up.
        </p>
        <p className="text-xs text-ink-faint font-mono mb-7 break-all">
          {m.iframeUrl}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="
              inline-flex items-center gap-2 text-sm
              px-4 py-2 rounded border border-line-strong
              text-ink hover:bg-elevated transition-colors
            "
          >
            <RefreshCw size={14} strokeWidth={1.75} />
            <span>Try again</span>
          </button>
          <a
            href={m.iframeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2 text-sm
              px-4 py-2 rounded
              text-ink-muted hover:text-ink hover:bg-elevated
              transition-colors
            "
          >
            <ExternalLink size={14} strokeWidth={1.75} />
            <span>Open directly</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default IframeRenderer;
