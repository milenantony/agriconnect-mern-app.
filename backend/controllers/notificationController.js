const Notification = require('../models/notificationModel');

// @desc    Get logged in farmer's notifications
// @route   GET /api/notifications/mine
// @access  Private (Farmer)
const getMyNotifications = async (req, res) => {
  try {
    // Find all notifications for the current user and show the newest first
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate('sender', 'name')
      .populate('product', 'name');

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private (Farmer)
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Security Check: Ensure the user owns this notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark all of a user's notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private (Farmer)
const markAllAsRead = async (req, res) => {
  try {
    // Find all unread notifications for the current user and update them
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete all of a user's notifications
// @route   DELETE /api/notifications/delete-all
// @access  Private (Farmer)
const deleteAllNotifications = async (req, res) => {
  try {
    // Find all notifications for the current user and delete them
    await Notification.deleteMany({ recipient: req.user._id });
    res.json({ message: 'All notifications have been cleared.' });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteAllNotifications,
};

