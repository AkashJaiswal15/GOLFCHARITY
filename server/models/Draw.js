const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  winningNumbers: [{ type: Number }], // 5 numbers drawn
  jackpotAmount: { type: Number, default: 0 },
  jackpotRolledOver: { type: Boolean, default: false },
  prizePool: {
    fiveMatch: Number,   // 40% + jackpot
    fourMatch: Number,   // 35%
    threeMatch: Number,  // 25%
  },
  winners: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tier: { type: String, enum: ['5-match', '4-match', '3-match'] },
    prize: Number,
    proofUrl: String,
  }],
  totalPool: Number,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Draw', drawSchema);
