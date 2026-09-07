/**
 * Hairline divider — replaces cards/box-shadows as the way sections and
 * list rows separate from each other. A 1px element scaled to 50% renders
 * a crisper true-hairline across devices than a 0.5px border-width, which
 * some browsers just round back up to 1px.
 */
export default function HairlineRule({ orientation = 'horizontal', className = '', ...rest }) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`w-px self-stretch scale-x-50 bg-rule ${className}`}
        {...rest}
      />
    )
  }

  return <hr className={`m-0 h-px w-full border-0 scale-y-50 bg-rule ${className}`} {...rest} />
}
