/**
 * A single paw print, scaled to currentColor so it themes with the page.
 * Designed as a flat silhouette — works at any size.
 */
export function PawPrint({ size = 24, className = '', style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {/* Paw pad */}
      <ellipse cx="12" cy="16" rx="5" ry="4" />
      {/* Toes — top row */}
      <ellipse cx="5"  cy="11" rx="2.2" ry="2.6" transform="rotate(-15 5 11)" />
      <ellipse cx="19" cy="11" rx="2.2" ry="2.6" transform="rotate(15 19 11)" />
      {/* Toes — upper pair */}
      <ellipse cx="8.5" cy="5.5" rx="1.9" ry="2.3" transform="rotate(-8 8.5 5.5)" />
      <ellipse cx="15.5" cy="5.5" rx="1.9" ry="2.3" transform="rotate(8 15.5 5.5)" />
    </svg>
  );
}

export default PawPrint;
