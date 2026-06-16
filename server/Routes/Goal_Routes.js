const router = require('express').Router();
const { protect } = require('../Middleware/Auth');
const { idParamValidation } = require('../Middleware/Validator');
const {
  create_Goal,
  get_Goals,
  update_Goal,
  delete_Goal,
  update_GoalProgress,
} = require('../Controllers/Goal_Controller');

router.use(protect);

router.route('/')
  .post(create_Goal)
  .get(get_Goals);

router.route('/:id')
  .put(idParamValidation, update_Goal)
  .delete(idParamValidation, delete_Goal);

router.put('/:id/progress', idParamValidation, update_GoalProgress);

module.exports = router;
