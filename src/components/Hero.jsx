import { motion } from 'framer-motion'
import Container from './ui/Container'
import HairlineRule from './ui/HairlineRule'
import EditorialLink from './ui/EditorialLink'

/**
 * Full-bleed black-and-white hero. The portrait (public/headshot) is
 * rendered through a grayscale+contrast filter to read as monochrome
 * editorial photography rather than a casual colour snapshot, paired with
 * his name in vertical katakana (ビラシュ・シング — his own confirmed
 * reading; kanji isn't used since it's a foreign name, not a native
 * Japanese word). The image's native ratio is 3:4 (450x600), matched
 * exactly by the container so object-cover never crops it.
 * The `left-1/2 right-1/2 mx-[-50vw] w-screen` combo is the standard
 * full-bleed-inside-a-constrained-parent breakout; it only works because
 * nothing between here and the viewport clips overflow (Home.jsx keeps
 * this section outside the `overflow-hidden` wrapper for that reason).
 */
export default function Hero() {
  return (
    <section className="relative left-1/2 right-1/2 -mt-8 w-screen mx-[-50vw] overflow-hidden bg-hero-bg text-hero-fg">
      <Container grid className="items-center gap-y-12 py-20 sm:py-28 lg:py-32">
        <div className="col-span-4 sm:col-span-8 lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-ed-sm uppercase tracking-ed-wide text-hero-fg/70"
          >
            Full-Stack Engineer
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 max-w-2xl font-display text-ed-3xl leading-tight tracking-ed-tight sm:text-ed-4xl lg:text-ed-5xl"
          >
            Birash Thing builds production web apps —{' '}
            <span className="text-hero-accent">and ships them fast.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-6 max-w-md text-ed-md leading-normal text-hero-fg/80"
          >
            6+ years across enterprise Java, MERN SaaS, and production infrastructure. I build the
            full stack myself — architecture, auth, payments, deployment — and use AI tooling
            deliberately to move faster without cutting corners on code quality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 flex items-center gap-2 text-ed-sm text-hero-fg/80"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-hero-accent" aria-hidden="true" />
            Open to work — Aldershot, UK · Remote
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-8"
          >
            <EditorialLink to="/projects" tone="inverted">View My Work</EditorialLink>
            <EditorialLink to="/contact" tone="inverted">Let’s Connect</EditorialLink>
          </motion.div>
        </div>

        <div className="col-span-4 sm:col-span-8 lg:col-span-5 lg:col-start-8 flex items-center justify-center gap-6 lg:justify-end">
          <div className="aspect-[3/4] w-48 shrink-0 overflow-hidden sm:w-64 lg:w-72">
            <img
              src="/headshot/IMG_1847.JPG"
              alt="Birash Thing"
              className="h-full w-full object-cover grayscale contrast-125"
            />
          </div>
          <p
            lang="ja"
            aria-hidden="true"
            className="hidden [writing-mode:vertical-rl] font-display text-ed-base text-hero-fg/50 lg:block"
          >
            ビラシュ・シング
          </p>
        </div>
      </Container>

      <HairlineRule className="bg-hero-rule" />
    </section>
  )
}
