require('dotenv').config();
const mongoose = require('mongoose');
const Charity = require('./models/Charity');
const User = require('./models/User');

const charities = [
  { name: 'Cancer Research UK', description: 'World-leading cancer research charity', category: 'Health', website: 'https://www.cancerresearchuk.org' },
  { name: 'British Heart Foundation', description: 'Fighting heart and circulatory diseases', category: 'Health', website: 'https://www.bhf.org.uk' },
  { name: 'Macmillan Cancer Support', description: 'Support for people living with cancer', category: 'Health', website: 'https://www.macmillan.org.uk' },
  { name: 'Alzheimer\'s Society', description: 'Dementia support and research', category: 'Health', website: 'https://www.alzheimers.org.uk' },
  { name: 'RNLI', description: 'Royal National Lifeboat Institution', category: 'Emergency Services', website: 'https://rnli.org' },
  { name: 'Age UK', description: 'Supporting older people across the UK', category: 'Social', website: 'https://www.ageuk.org.uk' },
  { name: 'Shelter', description: 'Fighting homelessness and bad housing', category: 'Housing', website: 'https://www.shelter.org.uk' },
  { name: 'WWF UK', description: 'World Wildlife Fund — protecting nature', category: 'Environment', website: 'https://www.wwf.org.uk' },
  { name: 'Oxfam GB', description: 'Fighting poverty and injustice worldwide', category: 'International Aid', website: 'https://www.oxfam.org.uk' },
  { name: 'Mind', description: 'Mental health support and advocacy', category: 'Mental Health', website: 'https://www.mind.org.uk' },
  { name: 'Save the Children UK', description: 'Protecting children\'s rights globally', category: 'Children', website: 'https://www.savethechildren.org.uk' },
  { name: 'Comic Relief', description: 'Using the power of entertainment to change lives', category: 'General', website: 'https://www.comicrelief.com' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Charity.deleteMany({});
  await Charity.insertMany(charities);
  console.log(`✅ Seeded ${charities.length} charities`);

  // Create admin user
  const existing = await User.findOne({ email: 'admin@golfsystem.com' });
  if (!existing) {
    await User.create({ name: 'Admin', email: 'admin@golfsystem.com', password: 'Admin1234!', role: 'admin', subscriptionStatus: 'active' });
    console.log('✅ Admin user created: admin@golfsystem.com / Admin1234!');
  }

  mongoose.disconnect();
}

seed().catch(console.error);
