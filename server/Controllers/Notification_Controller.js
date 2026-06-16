const Notification = require('../Models/Notification_Model');

const getNotifications = async (req, res, next) => {
  try {
    const { type, isRead, page = 1, limit = 50 } = req.query;
    const filter = { UserId: req.user._id };
    if (type) filter.Type = type;
    if (isRead !== undefined) filter.IsRead = isRead === 'true';
    const unreadCount = await Notification.countDocuments({ UserId: req.user._id, IsRead: false });
    const data = await Notification.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Math.min(parseInt(limit), 50)).lean();
    res.status(200).json({ success: true, count: data.length, unreadCount, data });
  } catch (error) { next(error); }
};

const markAsRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, UserId: req.user._id }, { IsRead: true });
    res.status(200).json({ success: true, message: 'Marked as read' });
  } catch (error) { next(error); }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ UserId: req.user._id, IsRead: false }, { IsRead: true });
    res.status(200).json({ success: true, message: 'All marked as read' });
  } catch (error) { next(error); }
};

const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, UserId: req.user._id });
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) { next(error); }
};

const clearAllNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ UserId: req.user._id });
    res.status(200).json({ success: true, message: 'All notifications cleared' });
  } catch (error) { next(error); }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications };
