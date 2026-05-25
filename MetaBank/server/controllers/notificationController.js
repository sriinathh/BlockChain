const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(100);
    res.json({ ok: true, notifications });
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { notificationId } = req.body;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    if (notificationId) {
      await Notification.findOneAndUpdate({ _id: notificationId, user: userId }, { read: true });
    } else {
      await Notification.updateMany({ user: userId, read: false }, { read: true });
    }
    res.json({ ok: true });
  } catch (err) { next(err); }
};
