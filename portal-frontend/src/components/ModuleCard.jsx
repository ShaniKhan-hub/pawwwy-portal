import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

/**
 * Half-width horizontal module card — 2 cards per row on desktop.
 *
 * Internal layout:
 *   [01]   Module name              ↗
 *          Italic tagline
 *          AUTHOR · ROLE
 *
 * Card background is a soft tint of the module's accent colour (~8%) so
 * each card has its own quiet identity without screaming for attention.
 */
export function ModuleCard({ module: m, index }) {
  const num = String(index + 1).padStart(2, '0');

  // 8-char hex `#RRGGBBAA` for tints.
  const restingTint = `${m.accentColor}14`;   //  8%
  const hoverTint   = `${m.accentColor}22`;   // 13%

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        to={`/play/${m.slug}`}
        className="
          group relative block h-full
          rounded-2xl border border-line
          px-6 py-6
          transition-all duration-300
          hover:border-line-strong
          hover:-translate-y-[2px]
        "
        style={{ backgroundColor: restingTint }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hoverTint; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = restingTint; }}
      >
        <div className="grid grid-cols-[3rem_1fr_2rem] gap-4 items-start">
          {/* Big accent-coloured numeral */}
          <span
            className="font-display italic font-light text-4xl leading-none tabular-nums"
            style={{ color: m.accentColor }}
            aria-hidden="true"
          >
            {num}
          </span>

          {/* Content stack */}
          <div className="min-w-0">
            <h3 className="font-display tracking-tightest font-medium text-xl sm:text-[1.4rem] text-ink leading-tight">
              {m.name}
            </h3>
            <p className="font-display italic text-sm text-ink-muted mt-1.5">
              {m.tagline}
            </p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-ink-faint mt-3">
              <span className="text-ink-muted normal-case tracking-normal text-xs font-medium">
                {m.author}
              </span>
              <span className="mx-1.5 opacity-60">·</span>
              {m.role}
            </p>
          </div>

          {/* Arrow indicator */}
          <span
            className="
              inline-flex h-8 w-8 items-center justify-center
              rounded-full border border-line text-ink-faint
              group-hover:border-line-strong group-hover:text-ink
              transition-all duration-300
            "
            aria-hidden="true"
          >
            <ArrowUpRight
              size={13}
              strokeWidth={1.75}
              className="group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-transform duration-300"
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default ModuleCard;
