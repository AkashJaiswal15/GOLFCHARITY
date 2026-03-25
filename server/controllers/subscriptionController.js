const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

const createCheckoutSession = async (req, res) => {
  const { plan } = req.body; // 'monthly' or 'yearly'
  const priceId = plan === 'yearly' ? process.env.STRIPE_YEARLY_PRICE_ID : process.env.STRIPE_MONTHLY_PRICE_ID;

  let customerId = req.user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: req.user.email, name: req.user.name });
    customerId = customer.id;
    await User.findByIdAndUpdate(req.user._id, { stripeCustomerId: customerId });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
    cancel_url: `${process.env.CLIENT_URL}/subscribe?cancelled=true`,
    metadata: { userId: req.user._id.toString(), plan },
  });

  res.json({ url: session.url });
};

const cancelSubscription = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.stripeSubscriptionId) return res.status(400).json({ message: 'No active subscription' });
  await stripe.subscriptions.update(user.stripeSubscriptionId, { cancel_at_period_end: true });
  res.json({ message: 'Subscription will cancel at period end' });
};

module.exports = { createCheckoutSession, cancelSubscription };
