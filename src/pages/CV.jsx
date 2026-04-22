import { useRef, useState } from 'react'
import { FiDownload, FiMail, FiGithub, FiLinkedin, FiGlobe, FiLoader } from 'react-icons/fi'
import ReactGA from 'react-ga4'
import { Helmet } from 'react-helmet-async'

const contact = [
  { icon: FiMail,     label: 'thenngbirash124@gmail.com', href: 'mailto:thenngbirash124@gmail.com' },
  { icon: FiLinkedin, label: 'linkedin.com/in/yupsang',   href: 'https://linkedin.com/in/yupsang' },
  { icon: FiGithub,   label: 'github.com/yupsang1719',    href: 'https://github.com/yupsang1719' },
  { icon: FiGlobe,    label: 'bluenwhite.co.uk',          href: 'https://bluenwhite.co.uk' },
]

const experience = [
  {
    role: 'Web Developer & Marketing Manager',
    company: 'Griash23 Ltd',
    location: 'Aldershot, UK',
    period: 'Sep 2024 – Present',
    points: [
      'Built and maintain full-stack MERN websites for two pub venues — events, menus, galleries, and hosting.',
      'Manage all digital marketing end-to-end: social media, photography, videography, short-form video (reels), graphic design (Adobe/Canva), and copywriting.',
      'Coordinate photoshoots, design print assets (posters, menus, flyers), and grow online communities across both brands.',
    ],
  },
  {
    role: 'MIS Officer & Web Technology Lecturer',
    company: 'Hetauda School of Management',
    location: 'Hetauda, Nepal',
    period: 'Feb 2021 – Feb 2024',
    points: [
      'Implemented Moodle LMS during the pandemic — enabled remote teaching with insight dashboards for management decision-making.',
      'Managed the MIS system, a key factor in achieving UGC institutional certification.',
      'Developed and delivered a web technologies curriculum (PHP, Java); mentored students on real-world projects.',
    ],
  },
  {
    role: 'Lead Developer (Contract)',
    company: 'Softweb Developers',
    location: 'Remote',
    period: 'Jun 2020 – Dec 2020',
    points: [
      'Led development of a web app for an insurance agency to digitalise documentation and e-signature workflows.',
      'Implemented multi-role access (company, agent, client) using Spring Boot. Delivered on schedule.',
    ],
  },
  {
    role: 'CTO',
    company: 'Autar Fresh Pvt Ltd',
    location: 'Hetauda, Nepal',
    period: 'Apr 2019 – May 2020',
    points: [
      'Led technology for a multi-franchise green vegetable retail chain — implemented POS, networking, and hardware across all sites.',
    ],
  },
  {
    role: 'Java Developer',
    company: 'Investfly',
    location: 'Remote (US-based startup)',
    period: 'Feb 2018 – Mar 2019',
    points: [
      'Built backend features for a stock-trading automation platform using Spring Boot and REST APIs.',
    ],
  },
]

const projects = [
  {
    name: 'BarBooks',
    url: null,
    desc: 'SaaS pub finance platform — P&L reports, expense tracking, financial dashboards, PDF exports. 2 live paying clients. Built for HMRC Making Tax Digital compliance (Apr 2026).',
    tech: 'React 19, TanStack Query, Recharts, jsPDF, Express v5, MongoDB, JWT, AWS S3, Zod',
  },
  {
    name: 'Tracks Venue',
    url: 'tracksaldershot.co.uk',
    desc: 'Full-stack event venue platform with Stripe ticketing, PDF ticket generation, JWT auth, and email confirmations.',
    tech: 'React, Node.js, Express, MongoDB, Stripe, Nodemailer, Multer',
  },
  {
    name: 'Bull & Barkham',
    url: null,
    desc: 'Bar and events venue site with Stripe reservations, Zustand cart state, JWT auth, and event photo gallery.',
    tech: 'React, Node.js, Express, MongoDB, Stripe, Zustand',
  },
  {
    name: 'BlueNwhite Portfolio',
    url: 'bluenwhite.co.uk',
    desc: 'This portfolio — React 19 SPA with Framer Motion, dark mode, AI chat assistant (Claude API), deployed on VPS with NGINX and Certbot SSL.',
    tech: 'React 19, Vite, Tailwind CSS, Framer Motion, NGINX, EmailJS',
  },
]

const skills = [
  { label: 'Frontend',          value: 'React 19, Vite, Tailwind CSS, Framer Motion, React Router' },
  { label: 'Backend',           value: 'Node.js, Express, MongoDB, Mongoose, JWT/Auth, Stripe, AWS S3' },
  { label: 'DevOps',            value: 'NGINX, VPS/Linux (Ubuntu), Docker, Vercel, Render' },
  { label: 'Tools',             value: 'Git, Postman, VS Code, Spring Boot' },
  { label: 'Content & Design',  value: 'Adobe Creative Suite, Canva, Social Media, Photography, Videography' },
  { label: 'Prior Experience',  value: 'Java, Spring Boot, PHP, MySQL' },
]

export default function CV() {
  const cvRef = useRef(null)
  const [generating, setGenerating] = useState(false)

  async function downloadPDF() {
    if (generating) return
    setGenerating(true)
    ReactGA.event({ category: 'CV', action: 'download_pdf', label: 'CV PDF Download' })
    try {
      const html2pdf = (await import('html2pdf.js')).default
      await html2pdf()
        .set({
          margin: [12, 14, 12, 14],
          filename: 'Birash-Thing-CV.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(cvRef.current)
        .save()
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
    <Helmet>
      <title>CV — Birash Thing</title>
      <meta name="description" content="CV of Birash Thing — Full-Stack MERN Developer. 6+ years experience. Right to work in the UK. Download PDF CV." />
    </Helmet>
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">

      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-white/80 px-8 py-3 backdrop-blur
                      dark:border-neutral-800 dark:bg-neutral-900/80">
        <span className="flex-1 text-sm text-neutral-500 dark:text-neutral-400">
          Birash Thing — CV
        </span>
        <button
          onClick={downloadPDF}
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2 text-sm font-medium
                     text-white transition hover:bg-primary-700 disabled:opacity-60"
        >
          {generating
            ? <><FiLoader size={14} className="animate-spin" /> Generating…</>
            : <><FiDownload size={14} /> Download PDF</>
          }
        </button>
      </div>

      {/* CV content — captured for PDF (always light background) */}
      <div ref={cvRef} className="mx-auto max-w-3xl bg-white px-8 py-10">

        {/* Header */}
        <div className="mb-8 border-b pb-6 border-neutral-200dark:border-neutral-800">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white text-neutral-900">
            Birash Thing
          </h1>
          <p className="mt-1 text-lg text-primary-600 dark:text-primary-400 text-blue-700">
            Full-Stack Web Developer
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 text-neutral-700">
            Building BarBooks — a live SaaS with 2 paying UK pub clients — while working as Full-Stack Developer
            & Marketing Manager at a hospitality group in Aldershot. 6+ years across enterprise Java, education
            tech, and modern MERN SaaS. Open to full-stack, web developer, or hybrid technical/marketing roles.
          </p>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 text-neutral-500">
            Right to work in the UK · Spouse visa (unrestricted) · No sponsorship required
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {contact.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-primary-600 dark:text-neutral-400 text-neutral-700">
                <Icon size={12} /> {label}
              </a>
            ))}
          </div>
        </div>

        {/* Experience */}
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 text-neutral-500">
            Experience
          </h2>
          <div className="space-y-5">
            {experience.map((xp, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto] gap-x-4">
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white text-neutral-900">{xp.role}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 text-neutral-600">
                    {xp.company} · {xp.location}
                  </p>
                  <ul className="mt-2 space-y-1 pl-4 text-sm text-neutral-700 dark:text-neutral-300 text-neutral-700">
                    {xp.points.map((p, j) => (
                      <li key={j} className="relative before:absolute before:-left-3 before:top-[0.55em] before:h-1 before:w-1 before:rounded-full before:bg-neutral-400">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="shrink-0 text-right text-xs text-neutral-400 text-neutral-500">{xp.period}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 text-neutral-500">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((p, i) => (
              <div key={i}>
                <div className="flex items-baseline gap-2">
                  <p className="font-semibold text-neutral-900 dark:text-white text-neutral-900">{p.name}</p>
                  {p.url && (
                    <a href={`https://${p.url}`} target="_blank" rel="noreferrer"
                      className="text-xs text-primary-600 hover:underline text-blue-700">
                      {p.url}
                    </a>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-300 text-neutral-700">{p.desc}</p>
                <p className="mt-1 text-xs text-neutral-400 text-neutral-500">{p.tech}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 text-neutral-500">
            Skills
          </h2>
          <div className="space-y-2">
            {skills.map(s => (
              <div key={s.label} className="flex gap-3 text-sm">
                <span className="w-36 shrink-0 font-medium text-neutral-700 dark:text-neutral-300 text-neutral-700">{s.label}</span>
                <span className="text-neutral-600 dark:text-neutral-400 text-neutral-600">{s.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 text-neutral-500">
            Education
          </h2>
          <div className="grid grid-cols-[1fr_auto] gap-x-4">
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white text-neutral-900">
                Bachelor's Degree in Information Technology
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-neutral-600">
                College of Information and Technology · Kathmandu, Tinkune, Nepal
              </p>
            </div>
            <p className="shrink-0 text-right text-xs text-neutral-400 text-neutral-500">Feb 2015 – Apr 2019</p>
          </div>
        </section>

        {/* Footer note */}
        <p className="text-center text-xs text-neutral-400 text-neutral-500">
          References available on request · Aldershot, UK · Open to remote and on-site roles
        </p>
      </div>
    </div>
    </>
  )
}
