const router = require('express').Router();
const { protect } = require('../Middleware/Auth');
const {
  getAchievements,
  getLeaderboard,
} = require('../Controllers/Achievement_Controller');

router.use(protect);

router.get('/', getAchievements);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
