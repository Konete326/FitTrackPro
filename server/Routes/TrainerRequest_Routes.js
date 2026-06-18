const router = require('express').Router();
const { protect, authorize } = require('../Middleware/Auth');
const { idParamValidation } = require('../Middleware/Validator');
const {
  createRequest,
  getAllRequests,
  updateRequestStatus,
  getAvailableTrainers,
  getMyRequests,
  removeTrainer,
} = require('../Controllers/TrainerRequest_Controller');

router.use(protect);

router.get('/available-trainers', getAvailableTrainers);
router.get('/my-requests', getMyRequests);
router.post('/', createRequest);
router.delete('/remove-trainer', removeTrainer);

router.get('/', authorize('Admin'), getAllRequests);
router.put('/:id', idParamValidation, authorize('Admin'), updateRequestStatus);

module.exports = router;
