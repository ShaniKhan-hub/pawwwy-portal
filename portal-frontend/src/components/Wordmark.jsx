/**
 * Pawwwy wordmark.
 *
 * Fraunces serif at a heavy optical size, with the triple-w typeset slightly
 * tighter than the rest — gives the word a quiet visual signature without
 * being noisy.
 */
export function Wordmark({ as: Tag = 'span', className = '', sizeClass = 'text-2xl' }) {
  return (
    <Tag
      className={`wordmark inline-flex items-baseline gap-0 ${sizeClass} ${className}`}
      aria-label="Pawwwy"
    >
      <span aria-hidden="true">Pa</span>
      <span aria-hidden="true" style={{ letterSpacing: '-0.06em' }}>www</span>
      <span aria-hidden="true">y</span>
    </Tag>
  );
}

export default Wordmark;
