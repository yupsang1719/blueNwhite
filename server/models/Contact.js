import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  name:         { type: String, trim: true },
  company:      { type: String, trim: true },
  location:     { type: String, trim: true },
  tags:         { type: [String], default: [] },
  source:       { type: String, default: 'manual' }, // 'manual' | 'import' | 'scraper'
  unsubscribed: { type: Boolean, default: false },
}, { timestamps: true })

contactSchema.index({ location: 1 })
contactSchema.index({ tags: 1 })

export default mongoose.model('Contact', contactSchema)
