import { useState } from 'react'
import { FiDownload, FiMail, FiGithub, FiLinkedin, FiGlobe, FiLoader } from 'react-icons/fi'
import ReactGA from 'react-ga4'
import { Helmet } from 'react-helmet-async'

// ─── shared contact ───────────────────────────────────────────────────────────
const contact = [
  { icon: FiMail,     label: 'thenngbirash124@gmail.com', href: 'mailto:thenngbirash124@gmail.com' },
  { icon: FiLinkedin, label: 'linkedin.com/in/yupsang',   href: 'https://linkedin.com/in/yupsang' },
  { icon: FiGithub,   label: 'github.com/yupsang1719',    href: 'https://github.com/yupsang1719' },
  { icon: FiGlobe,    label: 'bluenwhite.co.uk',          href: 'https://bluenwhite.co.uk' },
]

// ─── developer cv data ────────────────────────────────────────────────────────
const devExperience = [
  {
    role: 'Web Developer & Marketing Manager',
    company: 'Griash23 Ltd',
    location: 'Aldershot, UK',
    period: 'Sep 2024 – Present',
    points: [
      'Built and maintain full-stack MERN websites for two pub venues — events, menus, galleries, and hosting.',
      'Manage all digital marketing end-to-end: social media, photography, videography, short-form video (reels), graphic design, and copywriting.',
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

const devSkills = [
  { label: 'Frontend',         value: 'React 19, Vite, Tailwind CSS, Framer Motion, React Router' },
  { label: 'Backend',          value: 'Node.js, Express, MongoDB, Mongoose, JWT/Auth, Stripe, AWS S3' },
  { label: 'DevOps',           value: 'NGINX, VPS/Linux (Ubuntu), Docker, Vercel, Render' },
  { label: 'Tools',            value: 'Git, Postman, VS Code, Spring Boot' },
  { label: 'Content & Design', value: 'Adobe Creative Suite, Canva, Social Media, Photography, Videography' },
  { label: 'Prior',            value: 'Java, Spring Boot, PHP, MySQL' },
]

// ─── all-round cv data ────────────────────────────────────────────────────────
const allExperience = [
  {
    role: 'Web Developer & Marketing Manager',
    company: 'Griash23 Ltd',
    location: 'Aldershot, UK',
    period: 'Sep 2024 – Present',
    points: [
      'Built and maintain full-stack MERN websites for two pub venues — events, menus, galleries, and hosting.',
      'Manage all digital marketing: social media, photography, videography, graphic design, and copywriting.',
      'Design print assets and grow online communities across both brands.',
    ],
  },
  {
    role: 'Admin & Operations',
    company: 'Griash23 Ltd & Green Outline Ltd',
    location: 'Aldershot, UK',
    period: '2024 – Present',
    points: [
      'Handle legal assessments and compliance documentation to keep operations within regulatory requirements.',
      'Manage day-to-day business operations, scheduling, and internal coordination.',
      'Support directors with administrative tasks, record-keeping, and company compliance.',
    ],
    reference: 'Reference: Om Prakesh Gurung, Director',
  },
  {
    role: 'Sales Advisor',
    company: 'Vodafone',
    location: 'Aldershot, UK',
    period: 'Aug 2024 – Nov 2025',
    points: [
      'Delivered face-to-face customer service and handled sensitive data confidentially.',
      'Managed bookings and transactions; worked within a structured team environment to meet targets.',
    ],
  },
  {
    role: 'MIS Officer & Web Technology Lecturer',
    company: 'Hetauda School of Management',
    location: 'Hetauda, Nepal',
    period: 'Feb 2021 – Feb 2024',
    points: [
      'Implemented Moodle LMS during the pandemic; maintained MIS system supporting UGC certification.',
      'Developed and delivered web technologies curriculum; mentored students on real-world projects.',
    ],
  },
  {
    role: 'Lead Developer (Contract)',
    company: 'Softweb Developers',
    location: 'Remote',
    period: 'Jun 2020 – Dec 2020',
    points: [
      'Led development of an insurance agency web app with multi-role access and e-signature workflows.',
    ],
  },
  {
    role: 'CTO',
    company: 'Autar Fresh Pvt Ltd',
    location: 'Hetauda, Nepal',
    period: 'Apr 2019 – May 2020',
    points: [
      'Oversaw technology for a multi-franchise retail chain — POS, networking, and hardware across all sites.',
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

const allSkills = [
  { label: 'Web Development',   value: 'React 19, Node.js, Express, MongoDB, Tailwind CSS, JWT, AWS S3' },
  { label: 'DevOps & Tools',    value: 'NGINX, VPS/Linux, Docker, Git, Postman, VS Code' },
  { label: 'Design & Content',  value: 'Adobe Creative Suite, Canva, Social Media, Photography, Videography' },
  { label: 'Administration',    value: 'Legal Assessments, Compliance, Scheduling, Record Keeping, Operations' },
  { label: 'Customer Service',  value: 'Face-to-face sales, Data handling, Team collaboration' },
  { label: 'Prior Tech',        value: 'Java, Spring Boot, PHP, MySQL' },
]

// ─── dental nursing cv data ──────────────────────────────────────────────────
const dentalProfile = `Motivated and reliable Trainee Dental Nurse, currently enrolled on a Level 3 Diploma in Dental Nursing (NEBDN), seeking a trainee position to gain hands-on practical experience within a dental practice. Although new to the clinical environment, brings strong patient-facing, organisational, and communication skills developed through customer service, administration, and management roles. Highly organised, calm under pressure, and eager to learn, with a genuine commitment to building a long-term career in dental nursing.`

const dentalKeySkills = [
  'Patient Communication & Reassurance',
  'Infection Control Awareness (Training Level)',
  'Confidentiality & Record Keeping',
  'Chairside Assistance (Learning Level)',
  'Appointment Coordination',
  'Teamwork & Professional Manner',
]

const dentalExperience = [
  {
    role: 'Admin & Operations / Marketing Manager',
    company: 'Griash23 Ltd',
    location: 'Aldershot, UK',
    period: 'Oct 2024 – Present',
    note: 'Non-clinical role included to demonstrate ongoing employment and transferable skills.',
    points: [
      'Managed daily operations, scheduling, and confidential information in a fast-paced, people-focused environment.',
      'Handled compliance documentation, record-keeping, and coordination with directors and stakeholders.',
    ],
    reference: 'Reference: Om Prakesh Gurung, Director',
  },
  {
    role: 'Admin & Operations',
    company: 'Green Outline Ltd',
    location: 'Aldershot, UK',
    period: '2024 – Present',
    note: 'Non-clinical role.',
    points: [
      'Assisted with legal assessments and operational compliance.',
      'Handled administrative tasks and maintained communication with directors.',
    ],
    reference: 'Reference: Om Prakesh Gurung, Director',
  },
  {
    role: 'Sales Advisor',
    company: 'Vodafone',
    location: 'Aldershot, UK',
    period: 'Aug 2024 – Nov 2025',
    points: [
      'Delivered face-to-face customer service, handled sensitive data confidentially.',
      'Managed bookings and transactions; worked effectively within a structured team environment.',
    ],
  },
  {
    role: 'MIS Officer',
    company: 'Hetauda School of Management and Social Sciences',
    location: 'Nepal',
    period: '2021 – 2024',
    points: [
      'Maintained confidential records, supported compliance, prepared documentation.',
      'Demonstrated strong organisation and accountability across a large academic institution.',
    ],
  },
]

// ─── pdf builder ─────────────────────────────────────────────────────────────
async function generatePDF(cvType) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

  const ML = 18, MR = 18, MT = 20, MB = 18
  const PW = 210, PH = 297
  const CW = PW - ML - MR
  let y = MT

  function checkPage(needed = 10) {
    if (y + needed > PH - MB) { doc.addPage(); y = MT }
  }
  function nl(n = 4) { y += n }

  function heading1(text) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(15, 15, 15)
    doc.text(text, ML, y)
    nl(7)
  }
  function heading2(text, color = [37, 99, 235]) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(...color)
    doc.text(text, ML, y)
    nl(5)
  }
  function bodyText(text, maxW = CW, color = [50, 50, 50]) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, maxW)
    checkPage(lines.length * 4 + 2)
    doc.text(lines, ML, y)
    nl(lines.length * 4 + 1)
  }
  function smallText(text, color = [100, 100, 100]) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...color)
    doc.text(text, ML, y)
    nl(4)
  }
  function divider(color = [220, 220, 220]) {
    doc.setDrawColor(...color)
    doc.line(ML, y, PW - MR, y)
    nl(4)
  }
  function sectionHead(title) {
    checkPage(12)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(130, 130, 130)
    doc.text(title.toUpperCase(), ML, y)
    nl(2.5)
    doc.setDrawColor(210, 210, 210)
    doc.line(ML, y, PW - MR, y)
    nl(5)
  }
  function expEntry(role, company, period, bullets, note, reference) {
    checkPage(14)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(15, 15, 15)
    doc.text(role, ML, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(130, 130, 130)
    doc.text(period, PW - MR, y, { align: 'right' })
    nl(4.5)
    doc.setFontSize(8.5)
    doc.setTextColor(90, 90, 90)
    doc.text(company, ML, y)
    nl(4.5)
    if (note) {
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.setFont('helvetica', 'italic')
      const noteLines = doc.splitTextToSize(note, CW)
      doc.text(noteLines, ML, y)
      doc.setFont('helvetica', 'normal')
      nl(noteLines.length * 3.5 + 1)
    }
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    bullets.forEach(b => {
      checkPage(7)
      const lines = doc.splitTextToSize(`•  ${b}`, CW - 5)
      doc.text(lines, ML + 4, y)
      nl(lines.length * 4)
    })
    if (reference) {
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.setFont('helvetica', 'italic')
      doc.text(reference, ML + 4, y)
      doc.setFont('helvetica', 'normal')
      nl(4)
    }
    nl(1)
  }
  function skillRow(label, value) {
    checkPage(6)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(60, 60, 60)
    doc.text(label, ML, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    const lines = doc.splitTextToSize(value, CW - 38)
    doc.text(lines, ML + 38, y)
    nl(Math.max(lines.length * 4, 5))
  }
  function projectEntry(name, url, desc, tech) {
    checkPage(14)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(15, 15, 15)
    doc.text(name, ML, y)
    if (url) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(37, 99, 235)
      doc.text(url, ML + doc.getTextWidth(name) + 3, y)
    }
    nl(4.5)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(60, 60, 60)
    const descLines = doc.splitTextToSize(desc, CW)
    doc.text(descLines, ML, y)
    nl(descLines.length * 4)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    const techLines = doc.splitTextToSize(tech, CW)
    doc.text(techLines, ML, y)
    nl(techLines.length * 3.5 + 3)
  }

  // ── build each cv type ───────────────────────────────────────────────────
  if (cvType === 'developer') {
    heading1('Birash Thing')
    heading2('Full-Stack Web Developer')
    bodyText('Building BarBooks — a live SaaS with 2 paying UK pub clients — while working as Full-Stack Developer & Marketing Manager at a hospitality group in Aldershot. 6+ years across enterprise Java, education tech, and modern MERN SaaS. Open to full-stack, web developer, or hybrid technical/marketing roles.')
    smallText('Right to work in the UK · Spouse visa (unrestricted) · No sponsorship required', [130, 130, 130])
    nl(1)
    doc.setFontSize(8.5)
    doc.setTextColor(80, 80, 80)
    doc.text('thenngbirash124@gmail.com  |  linkedin.com/in/yupsang  |  github.com/yupsang1719  |  bluenwhite.co.uk', ML, y)
    nl(4)
    doc.text('Aldershot, GU11 3RJ', ML, y)
    nl(5)
    divider()

    sectionHead('Experience')
    devExperience.forEach(x => expEntry(x.role, `${x.company} · ${x.location}`, x.period, x.points))

    sectionHead('Projects')
    projects.forEach(p => projectEntry(p.name, p.url, p.desc, p.tech))

    sectionHead('Skills')
    devSkills.forEach(s => skillRow(s.label, s.value))

    sectionHead('Education')
    expEntry('Bachelor\'s Degree in Information Technology', 'College of Information and Technology · Kathmandu, Nepal', 'Feb 2015 – Apr 2019', [])
    expEntry('Level 3 Diploma in Dental Nursing (NEBDN)', 'Everest Education · UK  [Currently Enrolled]', 'Jan 2026 – Present', [])

    checkPage(8)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('References available on request · Aldershot, UK · Open to remote and on-site roles', ML, y)

    doc.save('Birash-Thing-Developer-CV.pdf')

  } else if (cvType === 'allround') {
    heading1('Birash Thing')
    heading2('Full-Stack Developer · Admin & Operations · Digital Marketing', [60, 60, 60])
    bodyText('A versatile professional with 6+ years in web development, combined with hands-on experience in business administration, legal compliance, operations, and customer service. Currently building BarBooks SaaS while managing development, marketing, and operational roles across multiple businesses in Aldershot.')
    smallText('Right to work in the UK · Spouse visa (unrestricted) · No sponsorship required', [130, 130, 130])
    nl(1)
    doc.setFontSize(8.5)
    doc.setTextColor(80, 80, 80)
    doc.text('thenngbirash124@gmail.com  |  07778 781635  |  Aldershot, GU11 3RJ', ML, y)
    nl(4)
    doc.text('linkedin.com/in/yupsang  |  bluenwhite.co.uk', ML, y)
    nl(5)
    divider()

    sectionHead('Experience')
    allExperience.forEach(x =>
      expEntry(x.role, `${x.company} · ${x.location}`, x.period, x.points, null, x.reference)
    )

    sectionHead('Skills')
    allSkills.forEach(s => skillRow(s.label, s.value))

    sectionHead('Education')
    expEntry('Level 3 Diploma in Dental Nursing (NEBDN)', 'Everest Education · UK  [Currently Enrolled]', 'Jan 2026 – Present', [])
    expEntry('Bachelor\'s Degree in Information Technology', 'College of Information and Technology · Kathmandu, Nepal', 'Feb 2015 – Apr 2019', [])

    checkPage(8)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('References available on request · Aldershot, UK', ML, y)

    doc.save('Birash-Thing-CV.pdf')

  } else if (cvType === 'dental') {
    heading1('Birash Thing')
    heading2('Trainee Dental Nurse', [120, 60, 160])
    doc.setFontSize(8.5)
    doc.setTextColor(80, 80, 80)
    doc.text('Aldershot, GU11 3RJ  |  07778 781635  |  thenngbirash124@gmail.com', ML, y)
    nl(6)
    divider([200, 180, 220])

    sectionHead('Professional Profile')
    bodyText(dentalProfile)

    sectionHead('Key Skills')
    const colW = CW / 2 - 2
    dentalKeySkills.forEach((skill, i) => {
      const xPos = i % 2 === 0 ? ML : ML + colW + 4
      if (i % 2 === 0) checkPage(6)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(50, 50, 50)
      doc.text(`•  ${skill}`, xPos, y)
      if (i % 2 === 1) nl(5)
    })
    if (dentalKeySkills.length % 2 !== 0) nl(5)
    nl(2)

    sectionHead('Experience')
    dentalExperience.forEach(x =>
      expEntry(x.role, `${x.company} · ${x.location}`, x.period, x.points, x.note, x.reference)
    )

    sectionHead('Education & Training')
    expEntry(
      'Level 3 Diploma in Dental Nursing (NEBDN)',
      'Everest Education · UK',
      'Jan 2026 – Present',
      ['Currently enrolled. Working towards NEBDN qualification and completion of the practical portfolio.']
    )
    expEntry(
      'Bachelor\'s Degree in Information Technology',
      'College of Information and Technology · Kathmandu',
      '2015 – 2019',
      []
    )

    sectionHead('Career Objective')
    bodyText('To secure a Trainee Dental Nurse position where I can gain supervised clinical experience, complete my NEBDN practical portfolio, and qualify as a dental nurse.')

    checkPage(8)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('References available on request', ML, y)

    doc.save('Birash-Thing-Dental-Nursing-CV.pdf')
  }
}

// ─── cv preview components ────────────────────────────────────────────────────
function SectionHead({ children }) {
  return (
    <div className="mb-3 mt-6">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">{children}</h2>
      <div className="mt-1.5 h-px bg-neutral-200" />
    </div>
  )
}

function DeveloperCVPreview() {
  return (
    <div className="mx-auto max-w-3xl bg-white px-8 py-10 text-neutral-900">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Birash Thing</h1>
        <p className="mt-1 text-base font-medium text-blue-700">Full-Stack Web Developer</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-700">
          Building BarBooks — a live SaaS with 2 paying UK pub clients — while working as Full-Stack Developer
          & Marketing Manager at a hospitality group in Aldershot. 6+ years across enterprise Java, education
          tech, and modern MERN SaaS. Open to full-stack, web developer, or hybrid technical/marketing roles.
        </p>
        <p className="mt-1.5 text-xs text-neutral-500">
          Right to work in the UK · Spouse visa (unrestricted) · No sponsorship required
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
          {contact.map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-blue-600">
              <Icon size={11} /> {label}
            </a>
          ))}
        </div>
      </div>

      <SectionHead>Experience</SectionHead>
      <div className="space-y-5">
        {devExperience.map((xp, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] gap-x-4">
            <div>
              <p className="font-semibold">{xp.role}</p>
              <p className="text-sm text-neutral-500">{xp.company} · {xp.location}</p>
              <ul className="mt-1.5 space-y-1 pl-4 text-sm text-neutral-700">
                {xp.points.map((p, j) => (
                  <li key={j} className="relative before:absolute before:-left-3 before:top-[0.55em] before:h-1 before:w-1 before:rounded-full before:bg-neutral-400">{p}</li>
                ))}
              </ul>
            </div>
            <p className="shrink-0 text-right text-xs text-neutral-400">{xp.period}</p>
          </div>
        ))}
      </div>

      <SectionHead>Projects</SectionHead>
      <div className="space-y-4">
        {projects.map((p, i) => (
          <div key={i}>
            <div className="flex items-baseline gap-2">
              <p className="font-semibold">{p.name}</p>
              {p.url && <a href={`https://${p.url}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">{p.url}</a>}
            </div>
            <p className="mt-0.5 text-sm text-neutral-700">{p.desc}</p>
            <p className="mt-0.5 text-xs text-neutral-400">{p.tech}</p>
          </div>
        ))}
      </div>

      <SectionHead>Skills</SectionHead>
      <div className="space-y-1.5">
        {devSkills.map(s => (
          <div key={s.label} className="flex gap-3 text-sm">
            <span className="w-36 shrink-0 font-medium text-neutral-700">{s.label}</span>
            <span className="text-neutral-600">{s.value}</span>
          </div>
        ))}
      </div>

      <SectionHead>Education</SectionHead>
      <div className="space-y-3">
        <div className="grid grid-cols-[1fr_auto] gap-x-4">
          <div>
            <p className="font-semibold">Bachelor's Degree in Information Technology</p>
            <p className="text-sm text-neutral-500">College of Information and Technology · Kathmandu, Nepal</p>
          </div>
          <p className="shrink-0 text-right text-xs text-neutral-400">Feb 2015 – Apr 2019</p>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-x-4">
          <div>
            <p className="font-semibold">Level 3 Diploma in Dental Nursing (NEBDN)</p>
            <p className="text-sm text-neutral-500">Everest Education · UK <span className="text-violet-500 font-medium">[Currently Enrolled]</span></p>
          </div>
          <p className="shrink-0 text-right text-xs text-neutral-400">Jan 2026 – Present</p>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-neutral-400">
        References available on request · Aldershot, UK · Open to remote and on-site roles
      </p>
    </div>
  )
}

function AllRoundCVPreview() {
  return (
    <div className="mx-auto max-w-3xl bg-white px-8 py-10 text-neutral-900">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Birash Thing</h1>
        <p className="mt-1 text-base font-medium text-neutral-600">Full-Stack Developer · Admin & Operations · Digital Marketing</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-700">
          A versatile professional with 6+ years in web development, combined with hands-on experience in
          business administration, legal compliance, operations, and customer service. Currently building
          BarBooks SaaS while managing development, marketing, and operational roles across multiple businesses.
        </p>
        <p className="mt-1.5 text-xs text-neutral-500">
          Right to work in the UK · Spouse visa (unrestricted) · No sponsorship required
        </p>
        <p className="mt-2 text-xs text-neutral-600">
          thenngbirash124@gmail.com · 07778 781635 · Aldershot, GU11 3RJ · linkedin.com/in/yupsang
        </p>
      </div>

      <SectionHead>Experience</SectionHead>
      <div className="space-y-5">
        {allExperience.map((xp, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] gap-x-4">
            <div>
              <p className="font-semibold">{xp.role}</p>
              <p className="text-sm text-neutral-500">{xp.company} · {xp.location}</p>
              <ul className="mt-1.5 space-y-1 pl-4 text-sm text-neutral-700">
                {xp.points.map((p, j) => (
                  <li key={j} className="relative before:absolute before:-left-3 before:top-[0.55em] before:h-1 before:w-1 before:rounded-full before:bg-neutral-400">{p}</li>
                ))}
              </ul>
              {xp.reference && <p className="mt-1 pl-4 text-xs italic text-neutral-400">{xp.reference}</p>}
            </div>
            <p className="shrink-0 text-right text-xs text-neutral-400">{xp.period}</p>
          </div>
        ))}
      </div>

      <SectionHead>Skills</SectionHead>
      <div className="space-y-1.5">
        {allSkills.map(s => (
          <div key={s.label} className="flex gap-3 text-sm">
            <span className="w-40 shrink-0 font-medium text-neutral-700">{s.label}</span>
            <span className="text-neutral-600">{s.value}</span>
          </div>
        ))}
      </div>

      <SectionHead>Education</SectionHead>
      <div className="space-y-3">
        <div className="grid grid-cols-[1fr_auto] gap-x-4">
          <div>
            <p className="font-semibold">Level 3 Diploma in Dental Nursing (NEBDN)</p>
            <p className="text-sm text-neutral-500">Everest Education · UK <span className="text-violet-500 font-medium">[Currently Enrolled]</span></p>
          </div>
          <p className="shrink-0 text-right text-xs text-neutral-400">Jan 2026 – Present</p>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-x-4">
          <div>
            <p className="font-semibold">Bachelor's Degree in Information Technology</p>
            <p className="text-sm text-neutral-500">College of Information and Technology · Kathmandu, Nepal</p>
          </div>
          <p className="shrink-0 text-right text-xs text-neutral-400">Feb 2015 – Apr 2019</p>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-neutral-400">References available on request · Aldershot, UK</p>
    </div>
  )
}

function DentalNursingCVPreview() {
  return (
    <div className="mx-auto max-w-3xl bg-white px-8 py-10 text-neutral-900">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Birash Thing</h1>
        <p className="mt-1 text-base font-medium text-violet-700">Trainee Dental Nurse</p>
        <p className="mt-2 text-xs text-neutral-600">
          Aldershot, GU11 3RJ · 07778 781635 · thenngbirash124@gmail.com
        </p>
      </div>

      <SectionHead>Professional Profile</SectionHead>
      <p className="text-sm leading-relaxed text-neutral-700">{dentalProfile}</p>

      <SectionHead>Key Skills</SectionHead>
      <div className="grid grid-cols-2 gap-1 text-sm text-neutral-700">
        {dentalKeySkills.map(s => (
          <div key={s} className="flex items-start gap-1.5">
            <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
            {s}
          </div>
        ))}
      </div>

      <SectionHead>Experience</SectionHead>
      <div className="space-y-5">
        {dentalExperience.map((xp, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] gap-x-4">
            <div>
              <p className="font-semibold">{xp.role}</p>
              <p className="text-sm text-neutral-500">{xp.company} · {xp.location}</p>
              {xp.note && <p className="mt-0.5 text-xs italic text-neutral-400">{xp.note}</p>}
              <ul className="mt-1.5 space-y-1 pl-4 text-sm text-neutral-700">
                {xp.points.map((p, j) => (
                  <li key={j} className="relative before:absolute before:-left-3 before:top-[0.55em] before:h-1 before:w-1 before:rounded-full before:bg-neutral-400">{p}</li>
                ))}
              </ul>
              {xp.reference && <p className="mt-1 pl-4 text-xs italic text-neutral-400">{xp.reference}</p>}
            </div>
            <p className="shrink-0 text-right text-xs text-neutral-400">{xp.period}</p>
          </div>
        ))}
      </div>

      <SectionHead>Education & Training</SectionHead>
      <div className="space-y-3">
        <div className="grid grid-cols-[1fr_auto] gap-x-4">
          <div>
            <p className="font-semibold">Level 3 Diploma in Dental Nursing (NEBDN)</p>
            <p className="text-sm text-neutral-500">Everest Education · UK</p>
            <p className="mt-0.5 text-xs text-neutral-600">Currently enrolled. Working towards NEBDN qualification and completion of the practical portfolio.</p>
          </div>
          <p className="shrink-0 text-right text-xs text-neutral-400">Jan 2026 – Present</p>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-x-4">
          <div>
            <p className="font-semibold">Bachelor's Degree in Information Technology</p>
            <p className="text-sm text-neutral-500">College of Information and Technology · Kathmandu</p>
          </div>
          <p className="shrink-0 text-right text-xs text-neutral-400">2015 – 2019</p>
        </div>
      </div>

      <SectionHead>Career Objective</SectionHead>
      <p className="text-sm leading-relaxed text-neutral-700">
        To secure a Trainee Dental Nurse position where I can gain supervised clinical experience,
        complete my NEBDN practical portfolio, and qualify as a dental nurse.
      </p>

      <p className="mt-8 text-center text-xs text-neutral-400">References available on request</p>
    </div>
  )
}

// ─── cv type config ───────────────────────────────────────────────────────────
const CV_TYPES = {
  developer: {
    label: 'Full-Stack Developer',
    sub: 'MERN · 6+ years',
    activeClass: 'bg-blue-600 text-white border-blue-600',
    preview: DeveloperCVPreview,
  },
  allround: {
    label: 'All-Round',
    sub: 'Dev · Admin · Sales',
    activeClass: 'bg-emerald-600 text-white border-emerald-600',
    preview: AllRoundCVPreview,
  },
  dental: {
    label: 'Dental Nursing',
    sub: 'NEBDN enrolled',
    activeClass: 'bg-violet-600 text-white border-violet-600',
    preview: DentalNursingCVPreview,
  },
}

// ─── main component ───────────────────────────────────────────────────────────
export default function CV() {
  const [active, setActive] = useState('developer')
  const [generating, setGenerating] = useState(false)

  const config = CV_TYPES[active]
  const Preview = config.preview

  async function handleDownload() {
    if (generating) return
    setGenerating(true)
    ReactGA.event({ category: 'CV', action: 'download_pdf', label: `${active}_cv` })
    try {
      await generatePDF(active)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
    <Helmet>
      <title>CV — Birash Thing</title>
      <meta name="description" content="CV of Birash Thing — Full-Stack MERN Developer. 6+ years experience. Right to work in the UK. Download PDF CV." />
      <link rel="canonical" href="https://bluenwhite.co.uk/cv" />
      <meta property="og:title" content="CV — Birash Thing" />
      <meta property="og:description" content="CV of Birash Thing — Full-Stack MERN Developer. 6+ years experience. Right to work in the UK." />
      <meta property="og:url" content="https://bluenwhite.co.uk/cv" />
    </Helmet>
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">

      {/* Toolbar */}
      <div className="sticky top-0 z-10 border-b bg-white/90 px-4 py-3 backdrop-blur
                      dark:border-neutral-800 dark:bg-neutral-900/90 sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
          {/* CV type selector */}
          <div className="flex flex-1 flex-wrap gap-2">
            {Object.entries(CV_TYPES).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition
                  ${active === key
                    ? cfg.activeClass
                    : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}
              >
                {cfg.label}
                <span className={`ml-1.5 text-[10px] font-normal opacity-70`}>{cfg.sub}</span>
              </button>
            ))}
          </div>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={generating}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-medium text-white transition disabled:opacity-60
              ${active === 'developer' ? 'bg-blue-600 hover:bg-blue-700'
                : active === 'allround' ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-violet-600 hover:bg-violet-700'
              }`}
          >
            {generating
              ? <><FiLoader size={14} className="animate-spin" /> Generating…</>
              : <><FiDownload size={14} /> Download PDF</>
            }
          </button>
        </div>
      </div>

      {/* CV Preview */}
      <div className="py-8">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-white shadow-lg
                        dark:border-neutral-700 dark:bg-white">
          <Preview />
        </div>
      </div>
    </div>
    </>
  )
}
