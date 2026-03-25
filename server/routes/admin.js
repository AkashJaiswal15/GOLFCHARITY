const router = require('express').Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/users', async (req, res) => {
  const users = await User.find().select('-password').populate('selectedCharity', 'name');
  res.json(users);
});

router.patch('/users/:id', async (req, res) => {
  const { subscriptionStatus, role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { subscriptionStatus, role }, { new: true }).select('-password');
  res.json(user);
});

router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;
