const router = require('express').Router();
const { getCharities, selectCharity, createCharity } = require('../controllers/charityController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getCharities);
router.post('/select', protect, selectCharity);
router.post('/', protect, adminOnly, createCharity);

module.exports = router;
