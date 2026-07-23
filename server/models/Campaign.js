import mongoose from 'mongoose'

const campaignSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  subject:    { type: String, required: true, trim: true },
  templateId: { type: String, required: true }, // matches template filename
  listIds:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
  status:     { type: String, enum: ['draft', 'sending', 'sent', 'failed'], default: 'draft' },
  sentAt:     { type: Date },
  stats: {
    total:  { type: Number, default: 0 },
    sent:   { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
  },
  sentEmails: [{
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    email:     { type: String },
    name:      { type: String },
    company:   { type: String },
    location:  { type: String },
    status:    { type: String, enum: ['sent', 'failed'] },
    resendId:  { type: String },
    error:     { type: String },
  }],
}, { timestamps: true })

export default mongoose.model('Campaign', campaignSchema)
