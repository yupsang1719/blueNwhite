export const projects = [
  {
    slug: 'barbooks',
    githubRepo: null, // private repo
    title: 'BarBooks',
    summary: 'SaaS pub finance platform for UK pubs — P&L reports, expense tracking, financial dashboards, and PDF exports. Live with 2 paying clients.',
    problem:
      'UK pub operators manage finances through spreadsheets or expensive generic tools like Xero that don\'t understand pub-specific income (AWP machines, guest ales, cellar costs, tied tenant payments). With HMRC\'s Making Tax Digital mandate hitting from April 2026, pubs urgently need affordable, pub-specific finance software.',
    solution:
      'Built a multi-tenant SaaS application with a React 19 + TanStack Query frontend delivering real-time P&L dashboards (Recharts), PDF financial reports (jsPDF), and form-validated data entry (React Hook Form + Zod). The Express v5 + MongoDB backend uses JWT auth with httpOnly cookies, AWS S3 for document storage, Helmet security headers, and rate limiting. Priced at £20–30/month to sit between free spreadsheets and enterprise software.',
    impact:
      '2 live paying UK pub clients. Targeting a £5,000 MRR opportunity across the UK\'s ~19,500 independent pubs ahead of the April 2026 HMRC Making Tax Digital compliance deadline.',
    type: 'SaaS Product',
    status: 'Live',
    timeline: '2025–Present',
    role: 'Solo Full-Stack Developer',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS S3', 'JWT'],
    repoUrl: null, // private
    liveUrl: null,
    features: [
      'Multi-tenant architecture with manager accounts per pub',
      'Real-time P&L and financial dashboards with Recharts',
      'PDF financial report generation with jsPDF + autotable',
      'React Hook Form + Zod for validated data entry',
      'TanStack React Query for server state and caching',
      'AWS S3 for document and receipt storage via multer-s3',
      'JWT auth with httpOnly cookies, Helmet, and rate limiting',
      'Pub-specific income categories (draught, AWP, events, accommodation)',
      'HMRC MTD-ready architecture for April 2026 compliance deadline',
    ],
  },

  {
    slug: 'tracks-web',
    githubRepo: 'tracksWeb',
    title: 'Tracks Venue',
    summary: 'Full-stack event venue platform with Stripe ticketing, PDF generation, image uploads, and JWT auth.',
    problem:
      'Tracks, a live-event venue, had no digital platform for selling tickets, managing events, or keeping attendees informed. Everything was handled manually, creating friction for both staff and customers.',
    solution:
      'Built a full-stack MERN application with Stripe checkout for ticket purchases, jsPDF for instant PDF ticket generation sent via Nodemailer, Multer for event image uploads, JWT + bcrypt for secure auth, and a React countdown timer for upcoming events.',
    impact:
      'Eliminated manual ticketing workflows, enabled online payments, and gave the venue a professional digital presence with automated email confirmations.',
    type: 'Client Project',
    status: 'Completed',
    timeline: '2025–2026',
    role: 'Full-Stack Developer',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT'],
    repoUrl: 'https://github.com/yupsang1719/tracksWeb',
    liveUrl: null,
    features: [
      'Stripe checkout for ticket purchases',
      'PDF ticket generation with jsPDF + auto-table',
      'Email confirmations via Nodemailer',
      'Event image uploads with Multer',
      'JWT authentication with bcrypt',
      'Countdown timer for upcoming events',
      'React Router multi-page navigation',
    ],
  },

  {
    slug: 'bull-barkham',
    githubRepo: 'bullBarkham',
    title: 'Bull & Barkham',
    summary: 'Full-stack venue website with Stripe reservations, Zustand cart state, JWT auth, and event gallery.',
    problem:
      'Bull & Barkham, a bar and events venue, needed an online presence with a smooth reservation and payment flow, plus a gallery to showcase their events.',
    solution:
      'Built a full-stack MERN app with Stripe for reservation payments, Zustand for client-side cart and booking state, JWT + bcrypt for auth, Nodemailer for booking confirmations, and a photo gallery of venue events.',
    impact:
      'Gave the venue a professional web presence, enabled online reservations, and reduced manual booking overhead with automated email confirmations.',
    type: 'Client Project',
    status: 'Completed',
    timeline: '2025–2026',
    role: 'Full-Stack Developer',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT'],
    repoUrl: 'https://github.com/yupsang1719/bullBarkham',
    liveUrl: null,
    features: [
      'Stripe checkout for reservations and payments',
      'Zustand for global cart and booking state',
      'JWT authentication with bcrypt password hashing',
      'Email booking confirmations via Nodemailer',
      'Event photo gallery (grand opening, comedy nights)',
      'React Router multi-page SPA',
    ],
  },
]
