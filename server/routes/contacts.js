import { Router } from 'express'
import Contact from '../models/Contact.js'

const router = Router()

// POST /api/admin/contacts — add single contact
router.post('/', async (req, res) => {
  const { email, name, company, location, tags, source } = req.body
  if (!email) return res.status(400).json({ error: 'email is required' })

  try {
    const contact = await Contact.create({ email, name, company, location, tags, source })
    res.status(201).json(contact)
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Email already exists' })
    res.status(500).json({ error: err.message })
  }
})

// POST /api/admin/contacts/import — bulk import
router.post('/import', async (req, res) => {
  const { contacts, source = 'import' } = req.body
  if (!Array.isArray(contacts) || contacts.length === 0) {
    return res.status(400).json({ error: 'contacts array is required' })
  }

  const docs = contacts.map(c => ({ ...c, source }))

  try {
    const result = await Contact.insertMany(docs, { ordered: false })
    res.json({ inserted: result.length })
  } catch (err) {
    // ordered: false — partial success still resolves, duplicates thrown in writeErrors
    const inserted = err.result?.insertedCount ?? 0
    const skipped = err.writeErrors?.length ?? 0
    res.status(207).json({ inserted, skipped, message: 'Partial import — duplicates skipped' })
  }
})

// GET /api/admin/contacts — list with optional filters
router.get('/', async (req, res) => {
  const { location, tag, search, page = 1, limit = 50 } = req.query
  const filter = {}

  if (location) filter.location = { $regex: location, $options: 'i' }
  if (tag) filter.tags = tag
  if (search) filter.$or = [
    { email: { $regex: search, $options: 'i' } },
    { name: { $regex: search, $options: 'i' } },
    { company: { $regex: search, $options: 'i' } },
  ]

  try {
    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Contact.countDocuments(filter),
    ])
    res.json({ contacts, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/admin/contacts/:id
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) return res.status(404).json({ error: 'Contact not found' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/admin/contacts/:id — update editable fields
router.patch('/:id', async (req, res) => {
  const { name, email, company, location, tags } = req.body
  const update = {}
  if (name !== undefined) update.name = name
  if (email !== undefined) update.email = email.toLowerCase().trim()
  if (company !== undefined) update.company = company
  if (location !== undefined) update.location = location
  if (tags !== undefined) update.tags = tags

  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
    if (!contact) return res.status(404).json({ error: 'Contact not found' })
    res.json(contact)
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'That email is already used by another contact' })
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/admin/contacts/:id/unsubscribe
router.patch('/:id/unsubscribe', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { unsubscribed: true },
      { new: true }
    )
    if (!contact) return res.status(404).json({ error: 'Contact not found' })
    res.json(contact)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
