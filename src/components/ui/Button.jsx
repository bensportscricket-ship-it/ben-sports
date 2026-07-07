import { Link } from 'react-router-dom'

const VARIANTS = {
  primary:
    'bg-pitch text-bg hover:bg-pitch-bright hover:shadow-glow',
  secondary:
    'bg-transparent text-ink border border-line hover:border-bail hover:text-bail',
  ghost:
    'bg-transparent text-ink-muted hover:text-ink',
}

/**
 * Shared button. Renders a <Link> when `to` is provided, otherwise a <button>.
 */
export default function Button({
  children,
  to,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-200 ${VARIANTS[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
