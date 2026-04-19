import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './context.js'

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

app.get('/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log(`Chat API running on port ${PORT}`))
