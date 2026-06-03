import { motion } from 'framer-motion';
import { Component } from 'lucide-react';

/**
 * Placeholder shown for drop-in modules until Phase 6 swaps in the real one
 * (PawPlan, Faran's self-contained React component).
 *
 * Phase 6 will replace `<DropInPlaceholder slug="pawplan" />` with the actual
 * import + render of PawPlan, keyed by slug.
 */
export function DropInPlaceholder({ module: m }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 grid place-items-center bg-surface"
    >
      <div className="text-center max-w-prose-tight px-6">
        <Component
          size={32}
          strokeWidth={1.5}
          className="text-ink-faint mx-auto mb-5"
          aria-hidden="true"
        />
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink-faint mb-3">
          Drop-in module · Phase 6 will mount the real component here
        </p>
        <h2 className="font-display text-display-md text-ink tracking-tightest mb-3">
          {m.name}
        </h2>
        <p className="font-display italic text-ink-muted mb-1">{m.tagline}</p>
        <p className="text-sm text-ink-faint mt-4">by {m.author}</p>
      </div>
    </motion.div>
  );
}

export default DropInPlaceholder;
