import HairlineRule from './HairlineRule'

/**
 * Editorial section header: numbered marker + eyebrow, title, optional
 * lead paragraph, hairline rule underneath. `as` picks the heading level
 * so callers can keep their page's heading order correct — this component
 * never assumes it's an h2.
 */
export default function SectionHeader({ number, eyebrow, title, action, as: Heading = 'h2', className = '', children }) {
  return (
    <header className={className}>
      {(number != null || eyebrow) && (
        <div className="mb-3 flex items-baseline gap-3 font-display text-ed-sm tracking-ed-wide text-accent">
          {number != null && (
            <span className="tabular-nums" aria-hidden="true">
              {String(number).padStart(2, '0')}
            </span>
          )}
          {eyebrow && <span className="uppercase">{eyebrow}</span>}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <Heading className="font-display text-ed-2xl leading-tight tracking-ed-tight text-ink sm:text-ed-3xl">
          {title}
        </Heading>
        {action && <div className="shrink-0 pb-1">{action}</div>}
      </div>

      {children && (
        <p className="mt-3 max-w-prose text-ed-md leading-normal text-ink-muted">{children}</p>
      )}

      <HairlineRule className="mt-6" />
    </header>
  )
}
