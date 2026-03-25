require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function testLogin() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const email = 'admin@golfsystem.com';
  const password = 'Admin1234!';
  
  // Test 1: Find user
  const user = await User.findOne({ email });
  console.log('1. User found:', user ? '✅' : '❌');
  
  // Test 2: Match password via model method
  const match = await user.matchPassword(password);
  console.log('2. matchPassword():', match ? '✅' : '❌');

  // Test 3: Direct bcrypt compare
  const direct = await bcrypt.compare(password, user.password);
  console.log('3. bcrypt.compare():', direct ? '✅' : '❌');

  // Test 4: Check JWT_SECRET exists
  console.log('4. JWT_SECRET set:', process.env.JWT_SECRET !== 'your_jwt_secret_here' ? '✅' : '⚠️  Still default value');

  mongoose.disconnect();
}

testLogin().catch(console.error);
