import { motion, useMotionValue, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

function randomPoint(pad = 90) {
  return {
    x: pad + Math.random() * (window.innerWidth  - pad * 2),
    y: pad + Math.random() * (window.innerHeight - pad * 2),
  }
}

function BeeSVG({ size = 56 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"
      width={size} height={size} aria-hidden="true">
      <defs>
        <radialGradient id="bodyGrad" cx="35%" cy="28%" r="65%">
          <stop offset="0%"   stopColor="#FDE68A"/>
          <stop offset="55%"  stopColor="#F59E0B"/>
          <stop offset="100%" stopColor="#92400E"/>
        </radialGradient>
        <radialGradient id="headGrad" cx="38%" cy="28%" r="60%">
          <stop offset="0%"   stopColor="#FDE68A"/>
          <stop offset="100%" stopColor="#D97706"/>
        </radialGradient>
        <radialGradient id="stripeGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#374151"/>
          <stop offset="100%" stopColor="#030712"/>
        </radialGradient>
        <filter id="bShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5"
            floodColor="#451a03" floodOpacity="0.4"/>
        </filter>
        <filter id="wingShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1"
            floodColor="#93c5fd" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* ── Left wings (rotate from attachment point ~26,28) ── */}
      <g className="bee-wing-left">
        <ellipse cx="14" cy="19" rx="13.5" ry="6"
          fill="rgba(224,242,254,0.88)" stroke="rgba(125,211,252,0.65)" strokeWidth="0.5"
          transform="rotate(-32 14 19)" filter="url(#wingShadow)"/>
        {/* vein */}
        <line x1="26" y1="26" x2="8"  y2="13" stroke="rgba(147,197,253,0.55)" strokeWidth="0.5"/>
        <line x1="26" y1="26" x2="12" y2="22" stroke="rgba(147,197,253,0.4)"  strokeWidth="0.4"/>

        <ellipse cx="16" cy="31" rx="8.5" ry="3.8"
          fill="rgba(224,242,254,0.72)" stroke="rgba(125,211,252,0.5)" strokeWidth="0.5"
          transform="rotate(-16 16 31)" filter="url(#wingShadow)"/>
        <line x1="26" y1="30" x2="12" y2="31" stroke="rgba(147,197,253,0.4)" strokeWidth="0.4"/>
      </g>

      {/* ── Right wings (rotate from attachment point ~38,28) ── */}
      <g className="bee-wing-right">
        <ellipse cx="50" cy="19" rx="13.5" ry="6"
          fill="rgba(224,242,254,0.88)" stroke="rgba(125,211,252,0.65)" strokeWidth="0.5"
          transform="rotate(32 50 19)" filter="url(#wingShadow)"/>
        <line x1="38" y1="26" x2="56" y2="13" stroke="rgba(147,197,253,0.55)" strokeWidth="0.5"/>
        <line x1="38" y1="26" x2="52" y2="22" stroke="rgba(147,197,253,0.4)"  strokeWidth="0.4"/>

        <ellipse cx="48" cy="31" rx="8.5" ry="3.8"
          fill="rgba(224,242,254,0.72)" stroke="rgba(125,211,252,0.5)" strokeWidth="0.5"
          transform="rotate(16 48 31)" filter="url(#wingShadow)"/>
        <line x1="38" y1="30" x2="52" y2="31" stroke="rgba(147,197,253,0.4)" strokeWidth="0.4"/>
      </g>

      {/* ── Body ── */}
      <g filter="url(#bShadow)">
        <ellipse cx="32" cy="38" rx="10.5" ry="15.5" fill="url(#bodyGrad)"/>
        {/* stripes */}
        <ellipse cx="32" cy="31.5" rx="10.5" ry="4.2" fill="url(#stripeGrad)"/>
        <ellipse cx="32" cy="40"   rx="10.5" ry="4.2" fill="url(#stripeGrad)"/>
        {/* specular sheen */}
        <ellipse cx="28" cy="29.5" rx="2"  ry="5.5" fill="rgba(255,255,255,0.24)"
          transform="rotate(-8 28 29.5)"/>
        <ellipse cx="30" cy="36"   rx="1.2" ry="3.5" fill="rgba(255,255,255,0.14)"/>
        {/* stinger */}
        <ellipse cx="32" cy="53.5" rx="2.6" ry="4.5" fill="#92400E"/>
        <ellipse cx="32" cy="53"   rx="1"   ry="2"   fill="#B45309"/>
      </g>

      {/* ── Head ── */}
      <g filter="url(#bShadow)">
        <circle cx="32" cy="18" r="9.5" fill="url(#headGrad)"/>
        {/* sheen */}
        <ellipse cx="29.5" cy="13.5" rx="2.2" ry="3.2" fill="rgba(255,255,255,0.28)"
          transform="rotate(-18 29.5 13.5)"/>
        {/* eyes */}
        <ellipse cx="29" cy="17.5" rx="2.5" ry="2.7" fill="#0f172a"/>
        <circle  cx="28.2" cy="16.5" r="0.9" fill="white"/>
        <circle  cx="28.8" cy="18.3" r="0.4" fill="rgba(255,255,255,0.4)"/>
        <ellipse cx="37.5" cy="17.5" rx="2.5" ry="2.7" fill="#0f172a"/>
        <circle  cx="36.7" cy="16.5" r="0.9" fill="white"/>
        <circle  cx="37.3" cy="18.3" r="0.4" fill="rgba(255,255,255,0.4)"/>
        {/* smile */}
        <path d="M28.5 21.5 Q32 25 35.5 21.5"
          stroke="#92400E" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      </g>

      {/* ── Antennae ── */}
      <path d="M28 10 Q23 4 19 2"
        stroke="#1C1917" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <circle cx="19" cy="2" r="2.4" fill="#1C1917"/>
      <circle cx="19" cy="2" r="1.1" fill="#FCD34D"/>

      <path d="M36 10 Q41 4 45 2"
        stroke="#1C1917" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <circle cx="45" cy="2" r="2.4" fill="#1C1917"/>
      <circle cx="45" cy="2" r="1.1" fill="#FCD34D"/>
    </svg>
  )
}

export default function FloatingBee() {
  const beeX = useMotionValue(-70)
  const beeY = useMotionValue(window.innerHeight * 0.35)
  const rotZ = useMotionValue(90)   // bee SVG head points up → offset +90° so it faces travel dir
  const rotY = useMotionValue(0)    // banking (CSS 3D perspective tilt)
  const op   = useMotionValue(0)

  const pausedRef  = useRef(false)
  const cancelRef  = useRef(null)
  const aliveRef   = useRef(true)
  const [wanderKey, setWanderKey] = useState(0)
  const [hovered,   setHovered]   = useState(false)

  useEffect(() => {
    aliveRef.current  = true
    pausedRef.current = false

    async function wander() {
      animate(op, 1, { duration: 1.2, delay: 1 })

      while (aliveRef.current) {
        if (pausedRef.current) {
          await new Promise(r => setTimeout(r, 100))
          continue
        }

        const to   = randomPoint()
        const dx   = to.x - beeX.get()
        const dy   = to.y - beeY.get()
        const dist = Math.sqrt(dx * dx + dy * dy)

        // direction bee should face
        const travelAngle = Math.atan2(dy, dx) * (180 / Math.PI)
        const faceAngle   = travelAngle + 90

        // banking: tilt away from horizontal direction (like a real flying insect)
        const bank = (dx / dist) * 28

        const dur = Math.max(dist / 85, 3)

        animate(rotZ, faceAngle, { duration: 0.85, ease: 'easeInOut' })
        animate(rotY, bank,      { duration: 0.75, ease: 'easeInOut' })

        const ax = animate(beeX, to.x, { duration: dur, ease: [0.42, 0, 0.58, 1] })
        const ay = animate(beeY, to.y, { duration: dur, ease: [0.42, 0, 0.58, 1] })
        cancelRef.current = () => { ax.stop(); ay.stop() }

        await Promise.all([ax, ay])
        if (!aliveRef.current) break

        // settle: level out
        animate(rotY, 0, { duration: 0.6 })
        await new Promise(r => setTimeout(r, 350 + Math.random() * 1100))
      }
    }

    wander()
    return () => { aliveRef.current = false; cancelRef.current?.() }
  }, [wanderKey]) // eslint-disable-line react-hooks/exhaustive-deps

  function onHoverStart() {
    setHovered(true)
    pausedRef.current = true
    cancelRef.current?.()
    animate(rotZ, [rotZ.get(), rotZ.get() + 25, rotZ.get() - 25, rotZ.get()],
      { duration: 0.65 })
    animate(rotY, 0, { duration: 0.3 })
  }

  function onHoverEnd() {
    setHovered(false)
    pausedRef.current = false
    setWanderKey(k => k + 1)
  }

  return (
    <div style={{ perspective: 600 }}
      className="pointer-events-none fixed inset-0 z-40">
      <motion.div
        style={{ x: beeX, y: beeY, rotateZ: rotZ, rotateY: rotY, opacity: op }}
        className="pointer-events-auto absolute top-0 left-0
                   -translate-x-1/2 -translate-y-1/2 cursor-default select-none"
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        aria-hidden="true"
      >
        <BeeSVG size={54} />

        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full
                       bg-amber-100 px-2.5 py-0.5 text-[10px] font-medium text-amber-700 shadow-sm
                       dark:bg-amber-950/70 dark:text-amber-400"
          >
            bzz bzz ✦
          </motion.span>
        )}
      </motion.div>
    </div>
  )
}
