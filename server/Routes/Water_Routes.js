const router = require('express').Router();
const { protect } = require('../Middleware/Auth');
const { idParamValidation } = require('../Middleware/Validator');
const {
  log_Water,
  get_waterIntake,
  update_Water,
  delete_Water,
  get_dailySummary,
  get_hydrationStats,
  get_hydrationStreak,
} = require('../Controllers/Water_Controller');

router.use(protect);

router.route('/')
  .post(log_Water)
  .get(get_waterIntake);

router.get('/daily-summary/:date', get_dailySummary);
router.get('/stats/summary', get_hydrationStats);
router.get('/streak', get_hydrationStreak);

router.route('/:id')
  .put(idParamValidation, update_Water)
  .delete(idParamValidation, delete_Water);

module.exports = router;
