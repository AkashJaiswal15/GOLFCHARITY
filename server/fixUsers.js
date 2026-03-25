require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fixUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  
  // Reset admin with fresh hash
  const adminHash = await bcrypt.hash('Admin1234!', 10);
  await db.collection('users').updateOne(
    { email: 'admin@golfsystem.com' },
    { $set: { password: adminHash, subscriptionStatus: 'active' } }
  );
  console.log('✅ Admin fixed: admin@golfsystem.com / Admin1234!');

  // Reset Akash with fresh hash
  const akashHash = await bcrypt.hash('Akash1234!', 10);
  await db.collection('users').updateOne(
    { email: 'akash@golfsystem.com' },
    { $set: { password: akashHash, subscriptionStatus: 'active' } }
  );
  console.log('✅ Akash fixed: akash@golfsystem.com / Akash1234!');

  mongoose.disconnect();
}

fixUsers().catch(console.error);
