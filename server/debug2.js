require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function debug() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const user = await db.collection('users').findOne({ email: 'admin@golfsystem.com' });
  if (!user) return console.log('❌ User not found');
  console.log('✅ User found in DB');
  console.log('Stored password hash:', user.password);
  const match = await bcrypt.compare('Admin1234!', user.password);
  console.log('Password match:', match ? '✅ YES' : '❌ NO');
  mongoose.disconnect();
}

debug().catch(console.error);
