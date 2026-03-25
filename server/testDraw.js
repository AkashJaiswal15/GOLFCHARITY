require('dotenv').config();
const mongoose = require('mongoose');
const Draw = require('./models/Draw');
const Score = require('./models/Score');
const User = require('./models/User');

const countMatches = (userScores, winningNums) =>
  userScores.filter(s => winningNums.includes(s.value)).length;

async function testDraw() {
  await mongoose.connect(process.env.MONGO_URI);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Use Akash's exact scores as winning numbers
  const winningNumbers = [33, 6, 5, 23, 32];

  const activeUsers = await User.find({ subscriptionStatus: 'active' });
  const totalPool = activeUsers.length * 10;

  const prizePool = {
    fiveMatch: Math.round(totalPool * 0.4),
    fourMatch: Math.round(totalPool * 0.35),
    threeMatch: Math.round(totalPool * 0.25),
  };

  const winners = [];
  for (const user of activeUsers) {
    const scores = await Score.find({ user: user._id }).sort({ createdAt: -1 }).limit(5);
    const matches = countMatches(scores, winningNumbers);
    console.log(`${user.name}: ${matches} matches — scores: ${scores.map(s => s.value).join(', ')}`);
    if (matches >= 3) {
      const tier = matches === 5 ? '5-match' : matches === 4 ? '4-match' : '3-match';
      winners.push({ user: user._id, tier, prize: 0 });
    }
  }

  const fiveWinners = winners.filter(w => w.tier === '5-match');
  const fourWinners = winners.filter(w => w.tier === '4-match');
  const threeWinners = winners.filter(w => w.tier === '3-match');

  if (fiveWinners.length) fiveWinners.forEach(w => w.prize = Math.round(prizePool.fiveMatch / fiveWinners.length));
  if (fourWinners.length) fourWinners.forEach(w => w.prize = Math.round(prizePool.fourMatch / fourWinners.length));
  if (threeWinners.length) threeWinners.forEach(w => w.prize = Math.round(prizePool.threeMatch / threeWinners.length));

  const draw = await Draw.create({
    month, year, winningNumbers,
    jackpotAmount: prizePool.fiveMatch,
    jackpotRolledOver: fiveWinners.length === 0,
    prizePool,
    winners: [...fiveWinners, ...fourWinners, ...threeWinners],
    totalPool,
    status: 'completed',
  });

  console.log(`\n✅ Draw created — ${winners.length} winner(s)`);
  winners.forEach(w => console.log(`  ${w.tier} — £${w.prize}`));
  mongoose.disconnect();
}

testDraw().catch(console.error);
