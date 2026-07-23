export const projects = [
  {
    slug: 'octavia-dental',
    githubRepo: 'octavia-Ae',
    title: 'Octavia Dental Group — Multi-Branch Platform',
    summary:
      'Templated website platform + internal operations system for a growing UK dental group — 3 live branch sites on one codebase, plus a CQC-standard stock/inventory, equipment, and patient visit logging system shared across all locations.',
    problem:
      'A private dental and facial aesthetics group needed a new practice website every time it opened or rebranded a branch, without paying full price in dev time each time. It also needed to replace manual spreadsheets for stock control, equipment upkeep, and patient visit records with something that holds up to CQC inspection standards — consistently, across every branch.',
    solution:
      'Built a single React 19 + Vite codebase (Tailwind CSS, Framer Motion, Tiptap rich-text blog editor, React Hook Form + Zod) that renders a distinct branded site per branch — own logo, colour theme, copy, and NHS/private treatment mix — from shared components, backed by one Express + MongoDB Atlas API deployed as separate client (Vercel) and server (Railway) services. Spinning up a new branch site is a config/content change, not a rebuild. A JWT-authenticated admin area shared across branches adds a CQC-standard stock/inventory module (items, goods-in, transfers, stock counts, expiry watch), an equipment & facilities log, and patient visit tracking — giving the group an auditable trail for CQC compliance instead of paper logs.',
    impact:
      '3 live branch sites running today — octavia-dental.co.uk (Godalming, private + facial aesthetics), octaviahousedentalpractice.co.uk (Godalming, NHS & private), newoctaviadentalsurgery.com (Hindhead) — each on its own domain and brand identity, all served from one template. New branches roll out in a few clicks instead of a new build, and stock/equipment/visit records across all locations meet CQC record-keeping standards.',
    screenshots: [
      '/screenshots/octavia-1.png',
      '/screenshots/octavia-2.png',
      '/screenshots/octavia-3.png',
    ],
    type: 'Client Project',
    status: 'Live',
    timeline: '2025–Present',
    role: 'Solo Full-Stack Developer',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Tailwind CSS', 'Vite'],
    repoUrl: 'https://github.com/yupsang1719/octavia-Ae',
    liveUrl: 'https://octavia-dental.co.uk',
    features: [
      'One codebase, many brands — per-branch logo, theme, copy, and NHS/private treatment config',
      'New branch sites deployed in a few clicks as the group opens new locations',
      'CQC-standard stock/inventory system — items, goods-in, transfers, stock counts, expiry watch',
      'Equipment & facilities logging built to CQC record-keeping standards',
      'Patient visit tracking and metrics, shared across all branches',
      'JWT-authenticated admin panel for staff',
      'Enquiry capture via contact forms, WhatsApp, and online booking',
      'Blog with rich-text editing (Tiptap), categories, and SEO metadata',
      'Before/after gallery and patient reviews',
      'Location-targeted landing pages for local SEO (Godalming, Guildford, Haslemere, Farnham, Cranleigh, Hampshire)',
      'Deployed as separate client (Vercel) and server (Railway) services',
    ],
  },

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
    screenshots: [
      '/screenshots/barbooks-1.png',
      '/screenshots/barbooks-2.png',
      '/screenshots/barbooks-3.png',
    ],
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
    slug: 'bluenwhite-portfolio',
    githubRepo: 'blueNwhite',
    title: 'BlueNwhite — Portfolio',
    summary: 'Personal developer portfolio built with React 19, Vite, and Tailwind CSS. Live at bluenwhite.co.uk — deployed on a VPS with NGINX and Certbot SSL.',
    problem:
      'Needed a professional portfolio that goes beyond a template — one that accurately represents my stack, showcases real projects with context, and gives recruiters a fast, clear picture of what I build and how I think.',
    solution:
      'Built a React 19 SPA with Vite for instant builds, Tailwind CSS for utility-first styling, and Framer Motion for smooth page transitions and scroll animations. Mock Service Worker (MSW) handles API-style data in development while static imports serve production. EmailJS powers the contact form without a backend. Deployed on a Ubuntu VPS with NGINX serving the SPA and Certbot providing HTTPS.',
    impact:
      'Live portfolio at bluenwhite.co.uk — used actively in job applications. Demonstrates full-stack thinking, deployment confidence, and attention to UI/UX detail.',
    screenshots: [
      '/screenshots/portfolio-1.png',
      '/screenshots/portfolio-2.png',
    ],
    type: 'Personal Project',
    status: 'Live',
    timeline: '2025',
    role: 'Solo Full-Stack Developer',
    tech: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'NGINX'],
    repoUrl: 'https://github.com/yupsang1719/blueNwhite',
    liveUrl: 'https://bluenwhite.co.uk',
    features: [
      'React 19 SPA with Vite and hot module replacement',
      'Tailwind CSS dark mode with localStorage + system preference',
      'Framer Motion page animations and staggered card reveals',
      'EmailJS contact form — no backend required',
      'MSW mock data layer with static import fallback for production',
      'GitHub API integration for live repo stats (stars, forks, language)',
      'Deployed on Ubuntu VPS with NGINX and Certbot SSL',
      'Fully responsive across mobile, tablet, and desktop',
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
    screenshots: [
      '/screenshots/tracks-1.png',
      '/screenshots/tracks-2.png',
      '/screenshots/tracks-3.png',
    ],
    type: 'Client Project',
    status: 'Completed',
    timeline: '2025–2026',
    role: 'Full-Stack Developer',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT'],
    repoUrl: 'https://github.com/yupsang1719/tracksWeb',
    liveUrl: 'https://tracksaldershot.co.uk',
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
    screenshots: [
      '/screenshots/bull-1.png',
      '/screenshots/bull-2.png',
    ],
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
