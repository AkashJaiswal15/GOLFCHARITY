const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscriptionStatus: { type: String, enum: ['inactive', 'active', 'cancelled'], default: 'inactive' },
  subscriptionPlan: { type: String, enum: ['monthly', 'yearly', null], default: null },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  selectedCharity: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
  charityPercentage: { type: Number, default: 10, min: 10, max: 100 },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
