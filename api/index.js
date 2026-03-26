require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Stripe webhook needs raw body
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

// Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/scores', require('../server/routes/scores'));
app.use('/api/charities', require('../server/routes/charities'));
app.use('/api/draws', require('../server/routes/draws'));
app.use('/api/subscriptions', require('../server/routes/subscriptions'));
app.use('/api/admin', require('../server/routes/admin'));
app.use('/api/webhook', require('../server/routes/webhook'));

// MongoDB connection (keep persistent across function invocations)
let mongoConnected = false;

const connectDB = async () => {
  if (mongoConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    mongoConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

module.exports = app;
