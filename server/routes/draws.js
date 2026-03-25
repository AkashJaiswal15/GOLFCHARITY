const router = require('express').Router();
const { triggerDraw, getDraws, uploadWinnerProof } = require('../controllers/drawController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getDraws);
router.post('/trigger', protect, adminOnly, triggerDraw);
router.post('/proof', protect, adminOnly, uploadWinnerProof);

module.exports = router;
