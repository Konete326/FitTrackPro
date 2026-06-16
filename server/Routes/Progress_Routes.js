const router = require('express').Router();
const { protect } = require('../Middleware/Auth');
const { idParamValidation } = require('../Middleware/Validator');
const {
  createProgress,
  getProgress,
  updateProgress,
  deleteProgress,
} = require('../Controllers/Progress_Controller');

router.use(protect);

router.route('/')
  .post(createProgress)
  .get(getProgress);

router.route('/:id')
  .put(idParamValidation, updateProgress)
  .delete(idParamValidation, deleteProgress);

module.exports = router;
