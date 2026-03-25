const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  website: String,
  logo: String,
  active: { type: Boolean, default: true },
}, { timestamps: true });

charitySchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Charity', charitySchema);
