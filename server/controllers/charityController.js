const Charity = require('../models/Charity');
const User = require('../models/User');

const getCharities = async (req, res) => {
  const { search } = req.query;
  const query = { active: true };
  if (search) query.$text = { $search: search };
  const charities = await Charity.find(query).limit(50);
  res.json(charities);
};

const selectCharity = async (req, res) => {
  const { charityId, percentage } = req.body;
  if (percentage < 10) return res.status(400).json({ message: 'Minimum 10% required' });
  const charity = await Charity.findById(charityId);
  if (!charity) return res.status(404).json({ message: 'Charity not found' });
  await User.findByIdAndUpdate(req.user._id, { selectedCharity: charityId, charityPercentage: percentage });
  res.json({ message: 'Charity updated' });
};

// Admin: create charity
const createCharity = async (req, res) => {
  const charity = await Charity.create(req.body);
  res.status(201).json(charity);
};

module.exports = { getCharities, selectCharity, createCharity };
