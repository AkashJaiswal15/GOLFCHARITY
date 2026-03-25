require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function debug() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: 'admin@golfsystem.com' });
  if (!user) return console.log('❌ Admin user NOT found in database');
  console.log('✅ User found:', user.email, '| role:', user.role);
  const match = await bcrypt.compare('Admin1234!', user.password);
  console.log('Password match:', match ? '✅ YES' : '❌ NO');
  mongoose.disconnect();
}

debug().catch(console.error);
