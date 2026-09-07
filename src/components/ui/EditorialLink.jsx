import { Link as RouterLink } from 'react-router-dom'

/**
 * Text link primitive — colour + underline shift only, no pill/button
 * chrome. The focus-visible outline is a11y, not decoration, so it stays
 * even though the brief bans decorative borders/shadows.
 */
export default function EditorialLink({ to, href, className = '', children, ...rest }) {
  const classes = [
    'font-display text-ink underline decoration-rule decoration-1 underline-offset-4',
    'transition-colors hover:text-accent hover:decoration-accent',
    'focus-visible:text-accent focus-visible:decoration-accent focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-accent',
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
