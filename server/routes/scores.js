const router = require('express').Router();
const { addScore, getMyScores, deleteScore } = require('../controllers/scoreController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', addScore);
router.get('/', getMyScores);
router.delete('/:id', deleteScore);

module.exports = router;
