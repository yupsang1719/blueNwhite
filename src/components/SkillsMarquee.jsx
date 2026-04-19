import { useState } from 'react'
import { SiReact, SiNodedotjs, SiExpress, SiMongodb, SiTailwindcss, SiFramer, SiGithub, SiDocker, SiRedis, SiMongoose, SiVite } from 'react-icons/si'

const skills = [
  { icon: SiReact,       label: 'React',         color: '#61DAFB' },
  { icon: SiVite,        label: 'Vite',           color: '#646CFF' },
  { icon: SiTailwindcss, label: 'Tailwind',       color: '#38BDF8' },
  { icon: SiFramer,      label: 'Framer Motion',  color: '#BB4EFF' },
  { icon: SiNodedotjs,   label: 'Node.js',        color: '#68A063' },
  { icon: SiExpress,     label: 'Express',        color: '#888888' },
  { icon: SiMongodb,     label: 'MongoDB',        color: '#47A248' },
  { icon: SiMongoose,    label: 'Mongoose',       color: '#880000' },
  { icon: SiRedis,       label: 'Redis',          color: '#FF4438' },
  { icon: SiDocker,      label: 'Docker',         color: '#2496ED' },
  { icon: SiGithub,      label: 'GitHub',         color: '#AAAAAA' },
]

export default function SkillsMarquee() {
  const row = [...skills, ...skills]

  return (
    <section className="relative mx-auto w-full max-w-6xl py-10">
      <h2 className="mb-6 text-center text-2xl font-semibold">Skills</h2>

      <div className="group relative overflow-hidden rounded-2xl border bg-white/70 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/50">
        {/* edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent dark:from-neutral-900" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent dark:from-neutral-900" />

        {/* marquee track */}
        <div className="flex animate-marquee gap-10 px-6 py-6 [animation-duration:35s] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row.map((s, i) => (
            <Logo key={`${s.label}-${i}`} Icon={s.icon} label={s.label} color={s.color} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Logo({ Icon, label, color }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="flex min-w-fit items-center gap-2 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="text-3xl md:text-4xl transition-all duration-200"
        style={{
          color: hovered ? color : undefined,
          transform: hovered ? 'scale(1.15)' : 'scale(1)',
          filter: hovered ? `drop-shadow(0 0 6px ${color}55)` : 'none',
        }}
      >
        <Icon title={label} aria-label={label} />
      </span>
      <span
        className="hidden text-sm md:inline transition-colors duration-200"
        style={{ color: hovered ? color : undefined }}
      >
        {label}
      </span>
    </div>
  )
}
