const router = require('express').Router();
const { protect, authorize } = require('../Middleware/Auth');
const { idParamValidation } = require('../Middleware/Validator');
const {
  createWorkout,
  getWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  startWorkout,
  completeExercise,
  toggleFavorite,
  cloneWorkout,
  searchWorkouts,
} = require('../Controllers/Workout_Controller');

router.use(protect);

router.route('/')
  .post(createWorkout)
  .get(getWorkouts);

router.get('/search', searchWorkouts);

router.route('/:id')
  .get(idParamValidation, getWorkout)
  .put(idParamValidation, updateWorkout)
  .delete(idParamValidation, deleteWorkout);

router.post('/:id/start', idParamValidation, startWorkout);
router.post('/:id/complete-exercise', idParamValidation, completeExercise);
router.put('/:id/favorite', idParamValidation, toggleFavorite);
router.post('/:id/clone', idParamValidation, cloneWorkout);

module.exports = router;
