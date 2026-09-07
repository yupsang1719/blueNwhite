import HairlineRule from './HairlineRule'

/**
 * Editorial section header: hairline rule leading into a numbered marker +
 * eyebrow, title, optional lead paragraph — the rule marks where each
 * section starts (poster reference: a rule divides one section from the
 * next, read as "section begins here" rather than "previous one ended").
 * `as` picks the heading level so callers can keep their page's heading
 * order correct — this component never assumes it's an h2.
 */
export default function SectionHeader({ number, eyebrow, title, action, as: Heading = 'h2', className = '', children }) {
  return (
    <header className={className}>
      <HairlineRule className="mb-6" />

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
        <Heading className="font-ed-serif font-bold text-ed-2xl leading-[1.02] tracking-ed-tight text-ink sm:text-ed-3xl">
          {title}
        </Heading>
        {action && <div className="shrink-0 pb-1">{action}</div>}
      </div>

      {children && (
        <p className="mt-3 max-w-prose text-ed-md leading-normal text-ink-muted">{children}</p>
      )}
    </header>
  )
}
