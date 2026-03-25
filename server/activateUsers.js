require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function activateUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await User.updateMany({}, { subscriptionStatus: 'active' });
  console.log(`✅ Activated ${result.modifiedCount} users`);
  const users = await User.find().select('name email subscriptionStatus');
  users.forEach(u => console.log(` - ${u.name} | ${u.email} | ${u.subscriptionStatus}`));
  mongoose.disconnect();
}

activateUsers().catch(console.error);
