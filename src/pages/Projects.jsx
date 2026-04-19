import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchProjects } from '../shared/projects'
import ProjectCardVSCode from '../components/ProjectCardVSCode'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white/90 dark:border-neutral-800 dark:bg-neutral-900/70 animate-pulse">
      <div className="flex items-center gap-2 border-b border-neutral-200/80 px-3 py-2.5 dark:border-neutral-800/80">
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <span className="ml-2 h-4 w-32 rounded bg-neutral-100 dark:bg-neutral-800" />
      </div>
      <div className="space-y-2 p-4">
        <div className="h-3 w-3/4 rounded bg-neutral-100 dark:bg-neutral-800" />
        <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
        <div className="h-3 w-5/6 rounded bg-neutral-100 dark:bg-neutral-800" />
        <div className="h-3 w-2/3 rounded bg-neutral-100 dark:bg-neutral-800" />
      </div>
      <div className="flex gap-2 border-t border-neutral-200/80 p-3 dark:border-neutral-800/80">
        <span className="h-5 w-14 rounded-full bg-neutral-100 dark:bg-neutral-800" />
        <span className="h-5 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800" />
        <span className="h-5 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800" />
      </div>
    </div>
  )
}

export default function Projects() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const items = await fetchProjects()
        setItems(items)
      } catch {
        setError('Failed to load projects.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <section className="relative overflow-hidden px-4 py-16">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10
        bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_60%)]
        dark:bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.15),transparent_70%)]" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-5xl mb-10"
      >
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-300">
              Things I've built — full-stack apps, tools, and experiments.
            </p>
          </div>
          {!loading && items.length > 0 && (
            <span className="text-sm text-neutral-400 dark:text-neutral-500">
              {items.length} project{items.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </motion.div>

      <div className="mx-auto w-full max-w-5xl">
        {loading && (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700
                          dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && (
          <motion.div
            className="grid gap-8 sm:grid-cols-1 md:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {items.map((p) => (
              <motion.div key={p.slug} variants={itemVariants}>
                <ProjectCardVSCode project={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
