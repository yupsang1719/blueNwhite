import { Router } from 'express'
import List from '../models/List.js'

const router = Router()

// GET /api/admin/lists — all lists with contact count
router.get('/', async (_req, res) => {
  try {
    const lists = await List.find().sort({ createdAt: -1 }).lean()
    const withCount = lists.map(l => ({ ...l, contactCount: l.contactIds.length }))
    res.json(withCount)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/admin/lists — create list
router.post('/', async (req, res) => {
  const { name, description } = req.body
  if (!name) return res.status(400).json({ error: 'name is required' })

  try {
    const list = await List.create({ name, description })
    res.status(201).json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/admin/lists/:id — single list with contacts
router.get('/:id', async (req, res) => {
  try {
    const list = await List.findById(req.params.id).populate('contactIds').lean()
    if (!list) return res.status(404).json({ error: 'List not found' })
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/admin/lists/:id/contacts — add contacts to list
// body: { contactIds: [...] }
router.post('/:id/contacts', async (req, res) => {
  const { contactIds } = req.body
  if (!Array.isArray(contactIds) || contactIds.length === 0) {
    return res.status(400).json({ error: 'contactIds array is required' })
  }

  try {
    const list = await List.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { contactIds: { $each: contactIds } } },
      { new: true }
    )
    if (!list) return res.status(404).json({ error: 'List not found' })
    res.json({ ok: true, contactCount: list.contactIds.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/admin/lists/:id/contacts — remove contacts from list
// body: { contactIds: [...] }
router.delete('/:id/contacts', async (req, res) => {
  const { contactIds } = req.body
  if (!Array.isArray(contactIds) || contactIds.length === 0) {
    return res.status(400).json({ error: 'contactIds array is required' })
  }

  try {
    const list = await List.findByIdAndUpdate(
      req.params.id,
      { $pull: { contactIds: { $in: contactIds } } },
      { new: true }
    )
    if (!list) return res.status(404).json({ error: 'List not found' })
    res.json({ ok: true, contactCount: list.contactIds.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/admin/lists/:id — delete list
router.delete('/:id', async (req, res) => {
  try {
    const list = await List.findByIdAndDelete(req.params.id)
    if (!list) return res.status(404).json({ error: 'List not found' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
