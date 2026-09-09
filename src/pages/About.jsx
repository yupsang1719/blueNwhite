import { motion } from 'framer-motion'
import { FiDownload, FiArrowRight, FiCode } from 'react-icons/fi'
import { Helmet } from 'react-helmet-async'
import {
  SiReact, SiVite, SiTailwindcss, SiFramer,
  SiNodedotjs, SiExpress, SiMongodb, SiMongoose, SiJsonwebtokens,
  SiStripe, SiAmazons3,
  SiDocker, SiNginx, SiLinux, SiVercel,
  SiGit, SiPostman, SiSpring,
} from 'react-icons/si'
import ExperienceSection from '../components/ExperienceSection'
import SkillPill from '../components/SkillPill'
import Container from '../components/ui/Container'
import SectionHeader from '../components/ui/SectionHeader'
import HairlineRule from '../components/ui/HairlineRule'
import EditorialLink from '../components/ui/EditorialLink'

const CATEGORY_META = {
  Frontend: { label: 'What users see' },
  Backend:  { label: 'What powers it' },
  DevOps:   { label: 'How it ships' },
  Tools:    { label: 'How I work' },
}

const skills = {
  Frontend: [
    { name: 'React',         level: 5, icon: SiReact },
    { name: 'Vite',          level: 4, icon: SiVite },
    { name: 'Tailwind CSS',  level: 5, icon: SiTailwindcss },
    { name: 'Framer Motion', level: 4, icon: SiFramer },
    { name: 'React Router',  level: 5, icon: SiReact },
  ],
  Backend: [
    { name: 'Node.js',  level: 5, icon: SiNodedotjs },
    { name: 'Express',  level: 5, icon: SiExpress },
    { name: 'MongoDB',  level: 5, icon: SiMongodb },
    { name: 'Mongoose', level: 4, icon: SiMongoose },
    { name: 'JWT/Auth', level: 5, icon: SiJsonwebtokens },
    { name: 'Stripe',   level: 4, icon: SiStripe },
    { name: 'AWS S3',   level: 3, icon: SiAmazons3 },
  ],
  DevOps: [
    { name: 'NGINX',           level: 4, icon: SiNginx },
    { name: 'VPS / Linux',     level: 4, icon: SiLinux },
    { name: 'Docker',          level: 3, icon: SiDocker },
    { name: 'Vercel / Render', level: 3, icon: SiVercel },
  ],
  Tools: [
    { name: 'Git',         level: 5, icon: SiGit },
    { name: 'Postman',     level: 4, icon: SiPostman },
    { name: 'VS Code',     level: 5, icon: FiCode },
    { name: 'Spring Boot', level: 4, icon: SiSpring },
  ],
}

const stats = [
  { value: '6+',  label: 'Years experience' },
  { value: '4+',  label: 'Production apps' },
  { value: '2',   label: 'Paying SaaS clients' },
  { value: '3',   label: 'Countries worked' },
]

const looking = [
  { title: 'Role type',   body: 'Full-stack developer, web developer, or hybrid technical/marketing roles.' },
  { title: 'Work style',  body: 'Remote-first or hybrid. Comfortable working independently and in teams.' },
  { title: 'Environment', body: 'Product-driven teams where I can contribute across the stack and see the impact of my work.' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }

export default function About() {
  return (
    <>
    <Helmet>
      <title>About — Birash Thing</title>
      <meta name="description" content="About Birash Thing — MERN developer with 6+ years experience across SaaS, education tech, and hospitality. Based in Aldershot, UK. Right to work, no sponsorship needed." />
      <link rel="canonical" href="https://bluenwhite.co.uk/about" />
      <meta property="og:title" content="About — Birash Thing" />
      <meta property="og:description" content="MERN developer with 6+ years experience. Based in Aldershot, UK. Right to work, no sponsorship needed." />
      <meta property="og:url" content="https://bluenwhite.co.uk/about" />
    </Helmet>

    {/* ===== Header ===== */}
    <Container as="section" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HairlineRule className="mb-10" />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-6">
            <div className="aspect-[4/5] w-24 shrink-0 overflow-hidden sm:w-28">
              <img
                src="/headshot/IMG_1193.JPG"
                alt="Birash Thing"
                className="h-full w-full object-cover grayscale contrast-125"
              />
            </div>
            <div>
              <p className="font-display text-ed-sm uppercase tracking-ed-wide text-ink-muted">About</p>
              <h1 className="mt-1 font-ed-serif font-black text-ed-3xl leading-tight tracking-ed-tight text-ink">
                Birash Thing
              </h1>
              <p className="mt-2 text-ed-sm text-ink-muted">Full-Stack Web Developer · Aldershot, UK</p>
              <p className="mt-3 flex items-center gap-1.5 text-ed-sm text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                Open to work
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            <EditorialLink to="/cv">
              <FiDownload size={14} className="mr-1.5 inline" aria-hidden="true" /> Resume
            </EditorialLink>
            <EditorialLink to="/projects">
              My Work <FiArrowRight size={14} className="ml-1.5 inline" aria-hidden="true" />
            </EditorialLink>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-8 max-w-2xl space-y-4 text-ed-base leading-normal text-ink-muted">
          <p>
            Birash currently builds and maintains the website platform for Octavia Dental — a
            multi-branch dental company — while also leading marketing for the company. Alongside that, he's
            building BarBooks, a live SaaS with 2 paying UK pub clients, giving him an unusually grounded
            view of how software actually fits into a running business.
          </p>
          <p>
            His background spans enterprise Java at a US fintech startup, contract development for an insurance
            platform, three years building an LMS and teaching web technologies at a Nepali university, and now
            shipping production MERN SaaS. Outside development, he is currently enrolled in the NEBDN Level 3
            Diploma in Dental Nursing — a reflection of a genuinely curious, multi-track professional.
          </p>
        </div>

        <p className="mt-4 flex items-center gap-1.5 text-ed-sm text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Right to work in the UK · Spouse visa (unrestricted) · No sponsorship required
        </p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 sm:gap-x-10"
        >
          {stats.map(s => (
            <div key={s.label}>
              <p className="font-ed-serif font-black text-ed-2xl text-ink">{s.value}</p>
              <p className="mt-1 text-ed-xs uppercase tracking-ed-wide text-ink-muted">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </Container>

    {/* ===== Currently Building ===== */}
    <Container as="section" className="pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader number={1} eyebrow="Now" title="Currently Building" />

        <div className="flex flex-wrap items-center gap-3">
          <p className="font-ed-serif font-bold text-ed-lg text-ink">BarBooks</p>
          <span className="flex items-center gap-1.5 text-ed-xs uppercase tracking-ed-wide text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            Live · 2 paying clients
          </span>
        </div>
        <p className="mt-2 max-w-prose text-ed-base leading-normal text-ink-muted">
          SaaS pub finance platform for UK pubs — P&L reports, expense tracking, financial dashboards, and PDF exports.
          Built for HMRC's Making Tax Digital mandate (April 2026), targeting the UK's ~19,500 independent pubs at £20–30/month.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-ed-xs uppercase tracking-ed-wide text-ink-muted">
          {['React 19', 'TanStack Query', 'Express v5', 'MongoDB', 'AWS S3', 'Recharts', 'Zod'].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </motion.div>
    </Container>

    {/* ===== Looking For ===== */}
    <Container as="section" className="pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader number={2} eyebrow="Fit" title="What I'm Looking For" />

        <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-3">
          {looking.map(c => (
            <div key={c.title}>
              <p className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">{c.title}</p>
              <p className="mt-1.5 text-ed-base leading-normal text-ink-muted">{c.body}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </Container>

    {/* ===== Skills ===== */}
    <Container as="section" className="pb-12">
      <SectionHeader
        number={3}
        eyebrow="Toolkit"
        title="Skills"
        action={<span className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">Self-rated · 1–5</span>}
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid gap-x-10 gap-y-8 md:grid-cols-2"
      >
        {Object.entries(skills).map(([group, list]) => {
          const meta = CATEGORY_META[group]
          return (
            <motion.div key={group} variants={item}>
              <div className="mb-3 flex items-baseline justify-between border-b border-rule pb-2">
                <h3 className="font-display text-ed-sm font-semibold text-ink">{group}</h3>
                <span className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">{meta.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-6">
                {list.map(s => (
                  <SkillPill key={s.name} name={s.name} level={s.level} icon={s.icon} />
                ))}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </Container>

    {/* ===== Experience ===== */}
    <ExperienceSection types={['dev']} number={4} eyebrow="Career" />

    {/* ===== Education ===== */}
    <Container as="section" className="pb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader number={5} eyebrow="Study" title="Education" />

        <div>
          <div className="grid grid-cols-4 gap-x-10 gap-y-2 py-6 sm:grid-cols-8 lg:grid-cols-12">
            <div className="col-span-4 sm:col-span-3 lg:col-span-3">
              <p className="font-display text-ed-sm tabular-nums text-ink-muted">Feb 2015 – Apr 2019</p>
            </div>
            <div className="col-span-4 sm:col-span-5 lg:col-span-9">
              <p className="font-ed-serif font-bold text-ed-md text-ink">Bachelor's Degree in Information Technology</p>
              <p className="mt-1 text-ed-sm text-ink-muted">College of Information and Technology · Kathmandu, Nepal</p>
            </div>
          </div>
          <HairlineRule />

          <div className="grid grid-cols-4 gap-x-10 gap-y-2 py-6 sm:grid-cols-8 lg:grid-cols-12">
            <div className="col-span-4 sm:col-span-3 lg:col-span-3">
              <p className="font-display text-ed-sm tabular-nums text-ink-muted">Jan 2026 – Present</p>
            </div>
            <div className="col-span-4 sm:col-span-5 lg:col-span-9">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-ed-serif font-bold text-ed-md text-ink">Level 3 Diploma in Dental Nursing (NEBDN)</p>
                <span className="flex items-center gap-1.5 text-ed-xs uppercase tracking-ed-wide text-ink-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  Enrolled
                </span>
              </div>
              <p className="mt-1 text-ed-sm text-ink-muted">Everest Education · UK</p>
            </div>
          </div>
          <HairlineRule />
        </div>
      </motion.div>
    </Container>
    </>
  )
}
