import { SiReact, SiNodedotjs, SiExpress, SiMongodb, SiTailwindcss, SiFramer, SiGithub, SiDocker, SiRedis, SiMongoose, SiVite } from 'react-icons/si'
import Container from './ui/Container'

const skills = [
  { icon: SiReact,       label: 'React' },
  { icon: SiVite,        label: 'Vite' },
  { icon: SiTailwindcss, label: 'Tailwind' },
  { icon: SiFramer,      label: 'Framer Motion' },
  { icon: SiNodedotjs,   label: 'Node.js' },
  { icon: SiExpress,     label: 'Express' },
  { icon: SiMongodb,     label: 'MongoDB' },
  { icon: SiMongoose,    label: 'Mongoose' },
  { icon: SiRedis,       label: 'Redis' },
  { icon: SiDocker,      label: 'Docker' },
  { icon: SiGithub,      label: 'GitHub' },
]

export default function SkillsMarquee() {
  const row = [...skills, ...skills]

  return (
    <section className="border-y border-rule py-10">
      <Container>
        <h2 className="text-center font-display text-ed-xs uppercase tracking-ed-wide text-ink-muted">
          Stack
        </h2>

        <div className="group mt-6 overflow-hidden">
          <div className="flex animate-marquee gap-10 [animation-duration:35s] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {row.map((s, i) => (
              <Logo key={`${s.label}-${i}`} Icon={s.icon} label={s.label} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function Logo({ Icon, label }) {
  return (
    <div className="group/logo flex min-w-fit cursor-default items-center gap-2">
      <span className="text-ed-2xl text-ink-muted transition-colors duration-200 group-hover/logo:text-accent md:text-ed-3xl">
        <Icon title={label} aria-label={label} />
      </span>
      <span className="hidden text-ed-sm text-ink-muted transition-colors duration-200 group-hover/logo:text-accent md:inline">
        {label}
      </span>
    </div>
  )
}
