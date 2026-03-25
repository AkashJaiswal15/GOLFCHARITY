const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

const handleWebhook = async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object;

  switch (event.type) {
    case 'checkout.session.completed': {
      const userId = session.metadata?.userId;
      if (userId) {
        await User.findByIdAndUpdate(userId, {
          subscriptionStatus: 'active',
          subscriptionPlan: session.metadata.plan,
          stripeSubscriptionId: session.subscription,
        });
      }
      break;
    }
    case 'customer.subscription.deleted':
    case 'customer.subscription.paused': {
      await User.findOneAndUpdate(
        { stripeCustomerId: session.customer },
        { subscriptionStatus: 'cancelled', subscriptionPlan: null, stripeSubscriptionId: null }
      );
      break;
    }
    case 'invoice.payment_failed': {
      await User.findOneAndUpdate(
        { stripeCustomerId: session.customer },
        { subscriptionStatus: 'inactive' }
      );
      break;
    }
  }

  res.json({ received: true });
};

module.exports = { handleWebhook };
