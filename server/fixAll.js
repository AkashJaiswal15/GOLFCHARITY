require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fixAll() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({}).toArray();

  console.log(`Found ${users.length} users — fixing passwords directly in DB...\n`);

  for (const user of users) {
    // Check if password is already a valid bcrypt hash
    const isHashed = user.password?.startsWith('$2b$') || user.password?.startsWith('$2a$');
    
    // Verify the hash works with a test — if double hashed it won't match anything
    const testPass = user.email === 'admin@golfsystem.com' ? 'Admin1234!' : null;
    const works = testPass ? await bcrypt.compare(testPass, user.password) : null;

    console.log(`${user.name} | ${user.email}`);
    console.log(`  Hash valid: ${isHashed} | Password works: ${works ?? 'unknown (not admin)'}`);

    if (works === false || !isHashed) {
      // Fix the password
      const newPass = user.email === 'admin@golfsystem.com' ? 'Admin1234!' : 'Password1234!';
      const hash = await bcrypt.hash(newPass, 10);
      await db.collection('users').updateOne({ _id: user._id }, { $set: { password: hash } });
      console.log(`  ✅ Password reset to: ${newPass}`);
    } else {
      console.log(`  ✅ Password is fine`);
    }
  }

  // Fix subscription status directly
  await db.collection('users').updateMany({}, { $set: { subscriptionStatus: 'active' } });
  console.log('\n✅ All users set to active');
  mongoose.disconnect();
}

fixAll().catch(console.error);
