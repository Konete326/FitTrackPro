const router = require('express').Router();
const { protect, authorize } = require('../Middleware/Auth');
const { idParamValidation } = require('../Middleware/Validator');
const {
  createRequest,
  getAllRequests,
  updateRequestStatus,
  getAvailableTrainers,
} = require('../Controllers/TrainerRequest_Controller');

router.use(protect);

router.get('/available-trainers', getAvailableTrainers);
router.post('/', createRequest);

router.get('/', authorize('Admin'), getAllRequests);
router.put('/:id', idParamValidation, authorize('Admin'), updateRequestStatus);

module.exports = router;
