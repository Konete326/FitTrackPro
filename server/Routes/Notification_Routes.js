const router = require('express').Router();
const { protect } = require('../Middleware/Auth');
const { idParamValidation } = require('../Middleware/Validator');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = require('../Controllers/Notification_Controller');

router.use(protect);

router.route('/')
  .get(getNotifications)
  .delete(clearAllNotifications);

router.put('/mark-all-read', markAllAsRead);

router.route('/:id')
  .put(idParamValidation, markAsRead)
  .delete(idParamValidation, deleteNotification);

module.exports = router;
