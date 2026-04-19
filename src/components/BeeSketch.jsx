/**
 * BeeSketch — hand-drawn style SVG bee decorations.
 * All elements use a feTurbulence displacement filter to get that
 * pencil-sketch / loose-line feel. Everything is pointer-events-none
 * so they never interfere with the page.
 *
 * Usage:
 *   <BeeDoodle size={80} className="opacity-[0.07] rotate-12" />
 *   <BeeTrail className="opacity-[0.09]" />
 *   <Honeycomb className="opacity-[0.06]" />
 */

/** Shared sketch filter id — unique per instance via a prop */
function SketchFilter({ id, scale = 1.8 }) {
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise"
        scale={scale} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  )
}

/** A small sketchy bee outline — no fill, pencil strokes */
export function BeeDoodle({ size = 72, className = '' }) {
  const id = 'sk-bee'
  return (
    <svg
      viewBox="0 0 72 80"
      width={size} height={size * (80 / 72)}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <defs><SketchFilter id={id} scale={1.6} /></defs>
      <g filter={`url(#${id})`}
        stroke="currentColor" fill="none"
        strokeLinecap="round" strokeLinejoin="round">

        {/* Body oval */}
        <ellipse cx="36" cy="50" rx="12" ry="18" strokeWidth="1.6" />
        {/* Stripes */}
        <path d="M24.5 44 Q36 46 47.5 44" strokeWidth="1.3" />
        <path d="M24.5 52 Q36 54 47.5 52" strokeWidth="1.3" />
        {/* Stinger */}
        <path d="M36 68 Q35 73 36 76" strokeWidth="1.4" />

        {/* Upper wings */}
        <path d="M24 42 Q10 28 16 40" strokeWidth="1.5" />
        <path d="M48 42 Q62 28 56 40" strokeWidth="1.5" />
        {/* Lower wings */}
        <path d="M25 50 Q14 43 20 52" strokeWidth="1.2" />
        <path d="M47 50 Q58 43 52 52" strokeWidth="1.2" />

        {/* Head */}
        <circle cx="36" cy="26" r="10" strokeWidth="1.6" />
        {/* Eyes */}
        <circle cx="32" cy="25" r="2"   strokeWidth="1.2" />
        <circle cx="40" cy="25" r="2"   strokeWidth="1.2" />
        {/* Smile */}
        <path d="M31 30 Q36 34 41 30" strokeWidth="1.2" />

        {/* Antennae */}
        <path d="M32 17 Q28 9 23 6"   strokeWidth="1.4" />
        <circle cx="23" cy="6" r="2"  strokeWidth="1.2" />
        <path d="M40 17 Q44 9 49 6"   strokeWidth="1.4" />
        <circle cx="49" cy="6" r="2"  strokeWidth="1.2" />
      </g>
    </svg>
  )
}

/** A looping dotted flight trail — suggests a bee has just passed */
export function BeeTrail({ width = 260, height = 90, className = '' }) {
  const id = 'sk-trail'
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width} height={height}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <defs><SketchFilter id={id} scale={1.2} /></defs>
      <g filter={`url(#${id})`}>
        {/* Main trail */}
        <path
          d={`M10 ${height * 0.6}
              C 50 ${height * 0.1}, 80 ${height * 0.9}, 130 ${height * 0.3}
              S 210 ${height * 0.8}, ${width - 10} ${height * 0.4}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeDasharray="3 7"
          strokeLinecap="round"
        />
        {/* Small loop in the middle */}
        <path
          d="M 118 38 Q 130 18 142 38 Q 130 56 118 38"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="3 6"
          strokeLinecap="round"
        />
        {/* Tiny diamond dots at start/end */}
        <path d="M10 42 l3-4 3 4-3 4z"  fill="currentColor" opacity="0.6" />
        <path d={`M${width-10} ${height * 0.4 - 4} l3-4 3 4-3 4z`} fill="currentColor" opacity="0.6" />
      </g>
    </svg>
  )
}

/** A single honeycomb hexagon outline */
export function Honeycomb({ size = 48, className = '' }) {
  const id = 'sk-hex'
  const cx = size / 2, cy = size / 2, r = size * 0.42
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
  }).join(' ')
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size} height={size}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <defs><SketchFilter id={id} scale={1.4} /></defs>
      <polygon
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        filter={`url(#${id})`}
      />
    </svg>
  )
}
