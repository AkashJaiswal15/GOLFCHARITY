const router = require('express').Router();
const { createCheckoutSession, cancelSubscription } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

router.post('/checkout', protect, createCheckoutSession);
router.post('/cancel', protect, cancelSubscription);

module.exports = router;
