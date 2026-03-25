require('dotenv').config();
const mongoose = require('mongoose');
const Draw = require('./models/Draw');

async function resetDraw() {
  await mongoose.connect(process.env.MONGO_URI);
  const now = new Date();
  const result = await Draw.deleteOne({ month: now.getMonth() + 1, year: now.getFullYear() });
  console.log(result.deletedCount ? '✅ This month draw reset — you can trigger again' : '❌ No draw found for this month');
  mongoose.disconnect();
}

resetDraw().catch(console.error);
