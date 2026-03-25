const Draw = require('../models/Draw');
const Score = require('../models/Score');
const User = require('../models/User');

// Generate 5 unique random numbers 1-45
const drawNumbers = () => {
  const nums = new Set();
  while (nums.size < 5) nums.add(Math.floor(Math.random() * 45) + 1);
  return [...nums];
};

const countMatches = (userScores, winningNums) =>
  userScores.filter(s => winningNums.includes(s.value)).length;

const triggerDraw = async (req, res) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const existing = await Draw.findOne({ month, year });
  if (existing?.status === 'completed') return res.status(400).json({ message: 'Draw already completed for this month' });

  // Get last completed draw for jackpot rollover
  const lastDraw = await Draw.findOne({ status: 'completed' }).sort({ createdAt: -1 });
  const rolledJackpot = lastDraw?.jackpotRolledOver ? lastDraw.prizePool.fiveMatch : 0;

  // Count active subscribers
  const activeUsers = await User.find({ subscriptionStatus: 'active' });
  const monthlyFee = 10; // £10/month base
  const totalPool = activeUsers.length * monthlyFee;

  const prizePool = {
    fiveMatch: Math.round(totalPool * 0.4) + rolledJackpot,
    fourMatch: Math.round(totalPool * 0.35),
    threeMatch: Math.round(totalPool * 0.25),
  };

  const winningNumbers = drawNumbers();

  // Match each active user's latest 5 scores
  const winners = [];
  for (const user of activeUsers) {
    const scores = await Score.find({ user: user._id }).sort({ createdAt: -1 }).limit(5);
    const matches = countMatches(scores, winningNumbers);
    if (matches >= 3) {
      const tier = matches === 5 ? '5-match' : matches === 4 ? '4-match' : '3-match';
      winners.push({ user: user._id, tier, prize: 0 });
    }
  }

  // Distribute prizes
  const fiveWinners = winners.filter(w => w.tier === '5-match');
  const fourWinners = winners.filter(w => w.tier === '4-match');
  const threeWinners = winners.filter(w => w.tier === '3-match');

  const jackpotRolledOver = fiveWinners.length === 0;

  if (fiveWinners.length) fiveWinners.forEach(w => w.prize = Math.round(prizePool.fiveMatch / fiveWinners.length));
  if (fourWinners.length) fourWinners.forEach(w => w.prize = Math.round(prizePool.fourMatch / fourWinners.length));
  if (threeWinners.length) threeWinners.forEach(w => w.prize = Math.round(prizePool.threeMatch / threeWinners.length));

  const draw = await Draw.create({
    month, year, winningNumbers, jackpotAmount: prizePool.fiveMatch,
    jackpotRolledOver, prizePool, winners: [...fiveWinners, ...fourWinners, ...threeWinners],
    totalPool, status: 'completed',
  });

  res.status(201).json(draw);
};

const getDraws = async (req, res) => {
  const draws = await Draw.find({ status: 'completed' })
    .sort({ createdAt: -1 })
    .limit(12)
    .populate('winners.user', 'name email');
  res.json(draws);
};

const uploadWinnerProof = async (req, res) => {
  const { drawId, winnerId, proofUrl } = req.body;
  const draw = await Draw.findById(drawId);
  if (!draw) return res.status(404).json({ message: 'Draw not found' });
  const winner = draw.winners.id(winnerId);
  if (!winner) return res.status(404).json({ message: 'Winner not found' });
  winner.proofUrl = proofUrl;
  await draw.save();
  res.json({ message: 'Proof uploaded' });
};

module.exports = { triggerDraw, getDraws, uploadWinnerProof };
