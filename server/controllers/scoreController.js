const Score = require('../models/Score');

// Add score — rolling 5 enforced by post-save hook
const addScore = async (req, res) => {
  const { value } = req.body;
  if (!value || value < 1 || value > 45) return res.status(400).json({ message: 'Score must be between 1 and 45' });
  const score = await Score.create({ user: req.user._id, value });
  res.status(201).json(score);
};

// Get latest 5 scores in reverse chronological order
const getMyScores = async (req, res) => {
  const scores = await Score.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5);
  res.json(scores);
};

const deleteScore = async (req, res) => {
  const score = await Score.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!score) return res.status(404).json({ message: 'Score not found' });
  res.json({ message: 'Deleted' });
};

module.exports = { addScore, getMyScores, deleteScore };
