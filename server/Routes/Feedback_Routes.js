const router = require('express').Router();
const { protect, authorize } = require('../Middleware/Auth');
const { idParamValidation } = require('../Middleware/Validator');
const {
  submitFeedback,
  getAllFeedbacks,
  markAsRead,
  replyToFeedback,
} = require('../Controllers/Feedback_Controller');

router.post('/', protect, submitFeedback);
router.get('/', protect, authorize('Admin'), getAllFeedbacks);
router.put('/:id', protect, authorize('Admin'), idParamValidation, markAsRead);
router.post('/:id/reply', protect, authorize('Admin'), idParamValidation, replyToFeedback);

module.exports = router;
