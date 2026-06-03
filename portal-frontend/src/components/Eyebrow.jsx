/**
 * Tracked uppercase section eyebrow.
 *
 * Used to anchor sections quietly without using a loud heading.
 */
export function Eyebrow({ children, as: Tag = 'p', className = '' }) {
  return (
    <Tag className={`text-[11px] uppercase tracking-[0.22em] text-ink-faint font-medium ${className}`}>
      {children}
    </Tag>
  );
}

export default Eyebrow;
