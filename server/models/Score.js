const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, required: true, min: 1, max: 45 },
}, { timestamps: true });

// After saving, enforce rolling 5 — keep only latest 5 scores per user
scoreSchema.post('save', async function () {
  const Score = this.constructor;
  const scores = await Score.find({ user: this.user }).sort({ createdAt: -1 });
  if (scores.length > 5) {
    const toDelete = scores.slice(5).map(s => s._id);
    await Score.deleteMany({ _id: { $in: toDelete } });
  }
});

module.exports = mongoose.model('Score', scoreSchema);
