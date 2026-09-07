/**
 * Editorial layout container. Renders the strict grid (4 cols mobile,
 * 8 tablet, 12 desktop) that asymmetric placements in later steps sit on —
 * children position themselves with col-span and col-start utilities.
 */
export default function Container({ as: Tag = 'div', grid = false, className = '', children, ...rest }) {
  const base = 'mx-auto w-full max-w-[var(--container-max)] px-6 sm:px-8 lg:px-12'
  const gridClasses = grid ? 'grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-x-6' : ''

  return (
    <Tag className={[base, gridClasses, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  )
}
