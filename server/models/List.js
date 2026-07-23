import mongoose from 'mongoose'

const listSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  contactIds:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
}, { timestamps: true })

export default mongoose.model('List', listSchema)
