import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

/**
 * One module, presented as an editorial list row.
 *
 * Layout (desktop):
 *   01    [name + tagline + description]                  [author / role]   ↗
 *
 * Layout (mobile): stacked, same hierarchy.
 *
 * The whole row is a single anchor — large hit-target, clearly clickable.
 */
export function ModuleRow({ module: m, index, isLast }) {
  // 01, 02, 03, 04 — leading zero, italic serif, used as the editorial signature
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={isLast ? '' : 'border-b border-line'}
    >
      <Link
        to={`/play/${m.slug}`}
        className="
          group relative grid
          grid-cols-[auto_1fr] sm:grid-cols-[5rem_1fr_auto_2.5rem]
          gap-x-5 sm:gap-x-8
          gap-y-3 sm:gap-y-0
          py-7 sm:py-9
          items-start
          transition-colors duration-200
        "
      >
        {/* Hover accent — full-bleed soft tint pulled from the module's color */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-x-[-1.5rem] inset-y-0
            opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300
          "
          style={{ backgroundColor: m.accentColor }}
        />

        {/* Hover accent — thin vertical bar on the very left */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none absolute left-[-1.5rem] inset-y-0 w-px
            opacity-0 group-hover:opacity-100 transition-opacity duration-300
          "
          style={{ backgroundColor: m.accentColor }}
        />

        {/* 01 — italic serif numeral */}
        <span
          className="
            relative font-display italic font-light
            text-3xl sm:text-4xl
            text-ink-faint group-hover:text-ink
            transition-colors duration-200
            tabular-nums
            leading-none pt-1
          "
          aria-hidden="true"
        >
          {num}
        </span>

        {/* Name + tagline + description */}
        <div className="relative min-w-0">
          <h3 className="font-display tracking-tightest text-3xl sm:text-[2.25rem] leading-[1.05] text-ink font-medium mb-2">
            {m.name}
          </h3>
          <p className="font-display italic text-base sm:text-lg text-ink-muted mb-3">
            {m.tagline}
          </p>
          <p className="text-sm text-ink-muted/90 max-w-[44ch] leading-relaxed">
            {m.description}
          </p>
        </div>

        {/* Author + role — right column on desktop, below on mobile */}
        <div className="relative col-span-2 sm:col-span-1 sm:text-right pt-1 sm:pt-2">
          <p className="text-sm text-ink font-medium leading-snug">{m.author}</p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint mt-1">
            {m.role}
          </p>
        </div>

        {/* Arrow affordance — desktop only */}
        <span
          className="
            relative hidden sm:flex h-10 w-10 items-center justify-center
            rounded-full border border-line text-ink-faint
            group-hover:border-line-strong group-hover:text-ink
            transition-all duration-300
            self-center
            justify-self-end
          "
          aria-hidden="true"
        >
          <ArrowUpRight
            size={16}
            strokeWidth={1.75}
            className="group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-transform duration-300"
          />
        </span>
      </Link>
    </motion.li>
  );
}

export default ModuleRow;
