import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './context.js'
import { connectDB } from './db.js'
import { adminAuth } from './middleware/adminAuth.js'
import contactRoutes from './routes/contacts.js'
import listRoutes from './routes/lists.js'
import templateRoutes from './routes/templates.js'
import campaignRoutes from './routes/campaigns.js'
import scraperRoutes from './routes/scraper.js'
import Contact from './models/Contact.js'
import { verifyToken } from './shared/unsubscribeToken.js'

const app = express()
const PORT = process.env.PORT || 4001

// CORS — allow portfolio origin + local dev
const allowedOrigins = [
  'https://bluenwhite.co.uk',
  'https://www.bluenwhite.co.uk',
  'http://localhost:5173',
  'http://localhost:4173',
]
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true)
    else cb(new Error('Not allowed by CORS'))
  },
}))

app.use(express.json({ limit: '16kb' }))

// Rate limit: 20 requests per IP per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please try again later.' },
})
app.use('/api/chat', limiter)

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' })
  }

  // Limit conversation history to last 10 messages to control costs
  const history = messages.slice(-10).map(m => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: String(m.content).slice(0, 1000), // cap message length
  }))

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: history,
    })

    res.json({ reply: response.content[0].text })
  } catch (err) {
    console.error('Anthropic error:', err.message)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
})

app.use('/api/admin/contacts', adminAuth, contactRoutes)
app.use('/api/admin/lists', adminAuth, listRoutes)
app.use('/api/admin/campaigns', adminAuth, campaignRoutes)
app.use('/api/admin/scraper', adminAuth, scraperRoutes)
// Template listing + preview are read-only and not sensitive — no auth needed
app.use('/api/admin/templates', adminAuth, templateRoutes) // kept for existing API calls
app.use('/api/templates', templateRoutes)                  // public — used by preview iframes

// Public unsubscribe — linked from every email footer
app.get('/unsubscribe', async (req, res) => {
  const { id, token } = req.query
  if (!id || !token) return res.status(400).send('Invalid unsubscribe link.')

  try {
    if (!verifyToken(id, token)) return res.status(403).send('Invalid or expired link.')

    await Contact.findByIdAndUpdate(id, { unsubscribed: true })

    res.send(`<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;text-align:center;padding:60px;">
      <h2 style="color:#1d4ed8;">You've been unsubscribed.</h2>
      <p style="color:#6b7280;">You won't receive any more emails from Birash Thing.</p>
    </body></html>`)
  } catch {
    res.status(500).send('Something went wrong. Please try again.')
  }
})

app.get('/health', (_req, res) => res.json({ ok: true }))

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Chat API running on port ${PORT}`)))
  .catch(err => { console.error('DB connection failed:', err.message); process.exit(1) })
