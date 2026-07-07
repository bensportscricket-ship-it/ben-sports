/**
 * Signature element: a cricket-ball seam, rendered as a stitched divider
 * between page sections instead of a plain hairline.
 */
export default function SeamDivider({ className = '' }) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`seam-divider w-full ${className}`}
    />
  )
}
