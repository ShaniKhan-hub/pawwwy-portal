/**
 * Pawwwy cat mark.
 *
 * Single continuous-feeling line-art cat — geometric, restrained, monochrome.
 * Inherits color from `currentColor` so it themes automatically.
 */
export function CatLogo({ size = 28, strokeWidth = 1.5, className = '', title = 'Pawwwy' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{title}</title>
      {/* Head — soft rounded triangle */}
      <path d="M10 22
               C 10 14, 16 9, 24 9
               C 32 9, 38 14, 38 22
               C 38 30, 32 36, 24 36
               C 16 36, 10 30, 10 22 Z" />

      {/* Left ear */}
      <path d="M12 16 L 9 6 L 18 13" />
      {/* Right ear */}
      <path d="M36 16 L 39 6 L 30 13" />

      {/* Eyes — small geometric marks */}
      <line x1="19" y1="22" x2="19" y2="24" />
      <line x1="29" y1="22" x2="29" y2="24" />

      {/* Nose */}
      <path d="M23 27 L 24 28 L 25 27" />

      {/* Whiskers — three short strokes, kept asymmetric for character */}
      <line x1="14" y1="26" x2="18" y2="27" />
      <line x1="14" y1="29" x2="18" y2="29" />
      <line x1="34" y1="26" x2="30" y2="27" />
      <line x1="34" y1="29" x2="30" y2="29" />
    </svg>
  );
}

export default CatLogo;
