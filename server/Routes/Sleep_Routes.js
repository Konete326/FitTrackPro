const router = require('express').Router();
const { protect } = require('../Middleware/Auth');
const { idParamValidation } = require('../Middleware/Validator');
const {
  logSleep,
  getSleepLogs,
  updateSleep,
  deleteSleep,
} = require('../Controllers/Sleep_Controller');

router.use(protect);

router.route('/')
  .post(logSleep)
  .get(getSleepLogs);

router.route('/:id')
  .put(idParamValidation, updateSleep)
  .delete(idParamValidation, deleteSleep);

module.exports = router;
