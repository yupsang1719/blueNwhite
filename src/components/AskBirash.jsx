import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSend, FiZap } from 'react-icons/fi'

const API_URL = import.meta.env.VITE_CHAT_API_URL || 'https://bluenwhite.co.uk/api/chat'

const SUGGESTED = [
  "Is he available now?",
  "What has he built?",
  "What's his strongest skill?",
  "Has he worked in a team?",
]

const GREETING = {
  role: 'assistant',
  content: "Hi! I'm an AI assistant for Birash's portfolio. I can answer questions about his experience, projects, availability, and skills — instantly.",
}

export default function AskBirash() {
  const [open, setOpen]         = useState(false)
  const [visible, setVisible]   = useState(false)   // delayed appearance
  const [expanded, setExpanded] = useState(true)    // pill vs icon
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef  = useRef(null)
  const inputRef   = useRef(null)

  // Slide in after 3s, collapse pill to icon after 8s
  useEffect(() => {
    const showTimer     = setTimeout(() => setVisible(true),    3000)
    const collapseTimer = setTimeout(() => setExpanded(false),  8000)
    return () => { clearTimeout(showTimer); clearTimeout(collapseTimer) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
  }, [open])

  function handleOpen() {
    setOpen(true)
    setExpanded(false) // collapse pill once clicked
  }

  async function send(text) {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput('')

    const next = [...messages, { role: 'user', content: userMsg }]
    setMessages(next)
    setLoading(true)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next
            .filter(m => !(m.role === 'assistant' && m === GREETING))
            .slice(-10)
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply || data.error || 'Sorry, something went wrong.',
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error — please try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const showSuggestions = messages.length === 1

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {visible && !open && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={handleOpen}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            aria-label="Ask about Birash"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 overflow-hidden
              rounded-full bg-primary-600 text-white shadow-lg shadow-primary-600/30
              transition-all duration-300 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/40"
            style={{ padding: expanded ? '0.625rem 1.25rem' : '0.875rem' }}
          >
            <FiZap size={18} className="shrink-0" />
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap text-sm font-medium overflow-hidden"
                >
                  Ask about Birash
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 flex w-[calc(100vw-3rem)] max-w-sm flex-col
              overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl
              dark:border-neutral-700 dark:bg-neutral-900"
            style={{ maxHeight: '72vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-primary-700 bg-primary-600 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <FiZap size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Ask about Birash</p>
                  <p className="text-[11px] text-primary-200">AI assistant · answers instantly</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-7 w-7 place-items-center rounded-lg text-primary-200
                  transition hover:bg-white/10 hover:text-white"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed
                    ${m.role === 'user'
                      ? 'rounded-br-sm bg-primary-600 text-white'
                      : 'rounded-bl-sm bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                    }`}>
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested questions */}
              {showSuggestions && !loading && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTED.map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-[11px]
                        font-medium text-primary-700 transition hover:bg-primary-100
                        dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-400 dark:hover:bg-primary-950/70"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t p-3 dark:border-neutral-700">
              <form
                onSubmit={e => { e.preventDefault(); send() }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask anything about Birash…"
                  disabled={loading}
                  className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm
                    outline-none transition placeholder:text-neutral-400
                    focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20
                    disabled:opacity-50
                    dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-600 text-white
                    transition hover:bg-primary-700 disabled:opacity-40"
                  aria-label="Send"
                >
                  <FiSend size={15} />
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] text-neutral-400 dark:text-neutral-600">
                Powered by Claude AI · For professional enquiries only
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
