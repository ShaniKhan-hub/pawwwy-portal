import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

/**
 * Card for a single team member.
 *
 * Hierarchy inverts the landing page's module-first composition: here the
 * member's NAME is the visual anchor (Fraunces, large, tight), with the
 * module they built sitting under it as supporting context. The whole card
 * is a link to that member's module — `Team` doubles as a second route map.
 */
export function MemberCard({ member, module: m, index }) {
  const num = String(index + 1).padStart(2, '0');

  // If the member's module wasn't found (shouldn't happen, but safety), fall
  // back to a non-link card rather than a broken Link.
  const Wrapper = m ? Link : 'div';
  const wrapperProps = m ? { to: `/play/${m.slug}` } : {};

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Wrapper
        {...wrapperProps}
        className="card-minimal block p-6 sm:p-7 group relative h-full overflow-hidden"
      >
        {/* Thin accent bar on the left edge — module's color */}
        {m && (
          <span
            aria-hidden="true"
            className="
              absolute left-0 top-6 bottom-6 w-px
              opacity-60 group-hover:opacity-100 transition-opacity duration-300
            "
            style={{ backgroundColor: m.accentColor }}
          />
        )}

        <div className="flex items-start justify-between mb-7">
          <span
            className="font-display italic font-light text-2xl text-ink-faint group-hover:text-ink transition-colors duration-200 tabular-nums leading-none"
            aria-hidden="true"
          >
            {num}
          </span>
          {m && (
            <ArrowUpRight
              size={16}
              strokeWidth={1.5}
              className="text-ink-faint group-hover:text-accent transition-colors duration-200"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Name — the hero of the card */}
        <p className="font-display tracking-tightest text-2xl sm:text-[1.75rem] leading-[1.1] text-ink font-medium mb-1">
          {member.name}
        </p>

        {/* Module + role row */}
        {m && (
          <p className="font-display italic text-base text-ink-muted mb-5">
            {m.name}
          </p>
        )}

        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          {member.role}
        </p>
      </Wrapper>
    </motion.li>
  );
}

export default MemberCard;
