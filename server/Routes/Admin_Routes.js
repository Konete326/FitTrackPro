const router = require('express').Router();
const { protect, authorize } = require('../Middleware/Auth');
const { idParamValidation } = require('../Middleware/Validator');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserActive,
  assignTrainer,
  deleteUser,
  getSystemStats,
  getAssignments,
} = require('../Controllers/Admin_Controller');

router.use(protect, authorize('Admin'));

router.get('/stats', getSystemStats);
router.get('/assignments', getAssignments);

router.route('/users')
  .get(getAllUsers)
  .post(createUser);

router.route('/users/:id')
  .get(idParamValidation, getUserById)
  .put(idParamValidation, updateUser)
  .delete(idParamValidation, deleteUser);

router.put('/users/:id/toggle-active', idParamValidation, toggleUserActive);
router.put('/assign-trainer/:userId/:trainerId', assignTrainer);

module.exports = router;
