const router = require('express').Router();
const { protect, authorize } = require('../Middleware/Auth');
const { idParamValidation } = require('../Middleware/Validator');
const { upload } = require('../Middleware/Multer');
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
  updateTrainerProfile,
  uploadTrainerImage,
  removeGalleryImage,
  getTrainerPublicProfile,
} = require('../Controllers/Trainer_Controller');
const {
  createMealPlanForClient,
  getClientMealPlans,
  updateClientMealPlan,
  deleteClientMealPlan,
  toggleMealPlanActive,
} = require('../Controllers/MealPlan_Controller');

router.use(protect, authorize('Trainer'));

router.get('/dashboard', getTrainerDashboardStats);

router.get('/clients', getClients);
router.get('/clients/:id', idParamValidation, getClientDetails);
router.post('/clients/:id/workouts', idParamValidation, assignWorkout);
router.post('/clients/:id/goals', idParamValidation, setClientGoal);
router.post('/clients/:id/notes', idParamValidation, addClientNote);
router.post('/clients/:id/message', idParamValidation, sendMessageToClient);
router.delete('/clients/:id', idParamValidation, removeClient);

router.route('/clients/:id/meal-plans')
  .post(idParamValidation, createMealPlanForClient)
  .get(idParamValidation, getClientMealPlans);

router.put('/clients/:id/meal-plans/:planId/toggle', idParamValidation, toggleMealPlanActive);
router.put('/clients/:id/meal-plans/:planId', idParamValidation, updateClientMealPlan);
router.delete('/clients/:id/meal-plans/:planId', idParamValidation, deleteClientMealPlan);

router.route('/templates')
  .post(createWorkoutTemplate)
  .get(getWorkoutTemplates);

router.delete('/templates/:id', idParamValidation, deleteWorkoutTemplate);

// Trainer profile management
router.put('/profile', updateTrainerProfile);
router.post('/profile/image', upload.single('image'), uploadTrainerImage);
router.delete('/profile/gallery-image', removeGalleryImage);

// Public trainer profile (accessible by all authenticated users)
router.get('/:id/public', protect, getTrainerPublicProfile);

module.exports = router;
