import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiGithub, FiLinkedin, FiSend, FiCheckCircle } from 'react-icons/fi'
import api from '../shared/api'

const socials = [
  { icon: FiGithub,   label: 'GitHub',   href: 'https://github.com/yourname' },
  { icon: FiLinkedin, label: 'LinkedIn',  href: 'https://linkedin.com/in/yourname' },
  { icon: FiMail,     label: 'Email',     href: 'mailto:you@email.com' },
]

const inputBase =
  'w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 ' +
  'placeholder:text-neutral-400 outline-none transition ' +
  'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ' +
  'dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 ' +
  'dark:focus:border-primary-400 dark:focus:ring-primary-400/20'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/contact', form)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden px-4 py-16">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10
        bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_60%)]
        dark:bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.15),transparent_70%)]" />

      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Get in Touch</h1>
          <p className="mt-2 max-w-xl text-neutral-600 dark:text-neutral-300">
            I'm currently open to new opportunities. Whether you have a project in mind
            or just want to say hi — my inbox is open.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto]">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {sent ? (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6
                              dark:border-emerald-800 dark:bg-emerald-950/40">
                <FiCheckCircle className="shrink-0 text-2xl text-emerald-500" />
                <div>
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">Message sent!</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">Thanks for reaching out — I'll get back to you soon.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Name</label>
                    <input
                      id="contact-name"
                      required
                      placeholder="Birash Thing"
                      className={inputBase}
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="birash@email.com"
                      className={inputBase}
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Message</label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    required
                    placeholder="Tell me about your project or opportunity…"
                    className={`${inputBase} resize-none`}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <button
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 font-medium
                             text-white transition hover:bg-primary-700 disabled:opacity-50"
                >
                  <FiSend size={15} />
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Side panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-4 md:w-56"
          >
            <div className="rounded-2xl border bg-white/70 p-5 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">Find me on</p>
              <div className="flex flex-col gap-3">
                {socials.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 text-sm text-neutral-700 transition
                               hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-lg border bg-white shadow-sm
                                     dark:border-neutral-700 dark:bg-neutral-800">
                      <Icon size={15} />
                    </span>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-white/70 p-5 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60">
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-neutral-500">Status</p>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1
                              dark:bg-emerald-950/40">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Open to work</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
