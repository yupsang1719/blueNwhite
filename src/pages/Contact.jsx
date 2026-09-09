import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiGithub, FiLinkedin, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import emailjs from '@emailjs/browser'
import ReactGA from 'react-ga4'
import { Helmet } from 'react-helmet-async'
import Container from '../components/ui/Container'
import SectionHeader from '../components/ui/SectionHeader'
import HairlineRule from '../components/ui/HairlineRule'

const socials = [
  { icon: FiGithub,   label: 'GitHub',   href: 'https://github.com/yupsang1719' },
  { icon: FiLinkedin, label: 'LinkedIn',  href: 'https://linkedin.com/in/yupsang' },
  { icon: FiMail,     label: 'Email',     href: 'mailto:thenngbirash124@gmail.com' },
]

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const inputBase =
  'w-full border-0 border-b border-rule bg-transparent px-0 py-2.5 text-ed-base text-ink ' +
  'placeholder:text-ink-muted/50 outline-none transition-colors focus:border-accent'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, message: form.message },
        { publicKey: PUBLIC_KEY },
      )
      setSent(true)
      setForm({ name: '', email: '', message: '' })
      ReactGA.event({ category: 'Contact', action: 'form_submit', label: 'Contact Form' })
    } catch {
      setError('Something went wrong. Please email me directly at thenngbirash124@gmail.com')
      ReactGA.event({ category: 'Contact', action: 'form_error', label: 'Contact Form Failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <Helmet>
      <title>Contact — Birash Thing</title>
      <meta name="description" content="Get in touch with Birash Thing — open to full-stack developer roles in the UK. Send a message or connect on GitHub and LinkedIn." />
      <link rel="canonical" href="https://bluenwhite.co.uk/contact" />
      <meta property="og:title" content="Contact — Birash Thing" />
      <meta property="og:description" content="Get in touch with Birash Thing — open to full-stack developer roles in the UK." />
      <meta property="og:url" content="https://bluenwhite.co.uk/contact" />
    </Helmet>
    <Container as="section" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader as="h1" eyebrow="Contact" title="Get in Touch with Birash Thing">
          Currently open to full-stack developer roles in the UK. Whether you have a project
          in mind or just want to say hi — my inbox is open.
        </SectionHeader>
      </motion.div>

      <div className="mt-12 grid grid-cols-4 gap-x-10 gap-y-10 sm:grid-cols-8 lg:grid-cols-12">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="col-span-4 sm:col-span-8 lg:col-span-8"
        >
          {sent ? (
            <div className="flex items-center gap-3 border-t border-rule pt-6">
              <FiCheckCircle className="shrink-0 text-2xl text-accent" aria-hidden="true" />
              <div>
                <p className="font-ed-serif font-bold text-ed-md text-ink">Message sent!</p>
                <p className="text-ed-sm text-ink-muted">Thanks for reaching out — I'll get back to you soon.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">Name</label>
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
                  <label htmlFor="contact-email" className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">Email</label>
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
                <label htmlFor="contact-message" className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">Message</label>
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
              {error && (
                <div className="flex items-start gap-2 border-t border-rule pt-4 text-ed-sm text-ink-muted">
                  <FiAlertCircle className="mt-0.5 shrink-0" aria-hidden="true" />
                  {error}
                </div>
              )}
              <button
                disabled={loading}
                className="inline-flex items-center gap-2 bg-accent px-6 py-3 font-display text-ed-sm uppercase tracking-ed-wide text-accent-ink transition-colors hover:bg-ink disabled:opacity-50"
              >
                <FiSend size={14} aria-hidden="true" />
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
          className="col-span-4 sm:col-span-8 lg:col-span-4"
        >
          <div>
            <p className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">Find me on</p>
            <div className="mt-4 flex flex-col gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-ed-sm text-ink-muted transition-colors hover:text-accent"
                >
                  <Icon size={15} aria-hidden="true" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          <HairlineRule className="my-6" />

          <div>
            <p className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">Status</p>
            <span className="mt-3 flex items-center gap-1.5 text-ed-sm text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              Open to work
            </span>
          </div>
        </motion.div>
      </div>
    </Container>
    </>
  )
}
