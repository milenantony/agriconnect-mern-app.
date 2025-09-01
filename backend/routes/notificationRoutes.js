const express = require('express');
const router = express.Router();
const { 
  getMyNotifications, 
  markNotificationAsRead, 
  markAllAsRead,
  deleteAllNotifications 
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Route to get a farmer's notifications
router.get('/mine', protect, getMyNotifications);

// Route to mark all notifications as read
router.put('/read-all', protect, markAllAsRead);

// THIS IS THE CRITICAL ROUTE
// Route to delete all notifications
router.delete('/delete-all', protect, deleteAllNotifications);

// Route to mark a single notification as read
router.put('/:id/read', protect, markNotificationAsRead);

module.exports = router;

