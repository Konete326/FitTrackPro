const router = require('express').Router();
const { protect, authorize } = require('../Middleware/Auth');
const { idParamValidation } = require('../Middleware/Validator');
const {
  getClients,
  getClientDetails,
  assignWorkout,
  setClientGoal,
  addClientNote,
  sendMessageToClient,
  removeClient,
  createWorkoutTemplate,
  getWorkoutTemplates,
  deleteWorkoutTemplate,
  getTrainerDashboardStats,
} = require('../Controllers/Trainer_Controller');

router.use(protect, authorize('Trainer'));

router.get('/dashboard', getTrainerDashboardStats);

router.get('/clients', getClients);
router.get('/clients/:id', idParamValidation, getClientDetails);
router.post('/clients/:id/workouts', idParamValidation, assignWorkout);
router.post('/clients/:id/goals', idParamValidation, setClientGoal);
router.post('/clients/:id/notes', idParamValidation, addClientNote);
router.post('/clients/:id/message', idParamValidation, sendMessageToClient);
router.delete('/clients/:id', idParamValidation, removeClient);

router.route('/templates')
  .post(createWorkoutTemplate)
  .get(getWorkoutTemplates);

router.delete('/templates/:id', idParamValidation, deleteWorkoutTemplate);

module.exports = router;
