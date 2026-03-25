require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function resetAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const hashed = await bcrypt.hash('Admin1234!', 10);
  await User.deleteOne({ email: 'admin@golfsystem.com' });
  await User.collection.insertOne({
    name: 'Admin',
    email: 'admin@golfsystem.com',
    password: hashed,
    role: 'admin',
    subscriptionStatus: 'active',
    charityPercentage: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log('✅ Admin user reset: admin@golfsystem.com / Admin1234!');
  mongoose.disconnect();
}

resetAdmin().catch(console.error);
