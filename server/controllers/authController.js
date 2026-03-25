const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create({ name, email: normalizedEmail, password });
    res.status(201).json({ token: generateToken(user._id), user: { id: user._id, name, email: normalizedEmail, role: user.role } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'No account found with that email' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });
    res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email, role: user.role, subscriptionStatus: user.subscriptionStatus } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('selectedCharity', 'name logo');
  res.json(user);
};

module.exports = { register, login, getMe };
