import { Link as RouterLink } from 'react-router-dom'

const TONES = {
  // On paper background.
  default:
    'text-ink decoration-rule hover:text-accent hover:decoration-accent ' +
    'focus-visible:text-accent focus-visible:decoration-accent focus-visible:outline-accent',
  // On the indigo hero, or any other dark/filled surface. Uses hero.accent,
  // not the general accent token — accent is tuned for contrast on paper,
  // which fails against the hero's indigo in light mode (~1.7:1).
  inverted:
    'text-hero-fg decoration-hero-rule hover:text-hero-accent hover:decoration-hero-accent ' +
    'focus-visible:text-hero-accent focus-visible:decoration-hero-accent focus-visible:outline-hero-fg',
}

/**
 * Text link primitive — colour + underline shift only, no pill/button
 * chrome. The focus-visible outline is a11y, not decoration, so it stays
 * even though the brief bans decorative borders/shadows.
 */
export default function EditorialLink({ to, href, tone = 'default', className = '', children, ...rest }) {
  const classes = [
    'font-display underline decoration-1 underline-offset-4 transition-colors',
    'focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4',
    TONES[tone],
    className,
  ].join(' ')

  if (to != null) {
    return (
      <RouterLink to={to} className={classes} {...rest}>
        {children}
      </RouterLink>
    )
  }

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  )
}
