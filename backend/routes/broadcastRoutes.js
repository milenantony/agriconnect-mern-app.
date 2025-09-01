const express = require('express');
const router = express.Router();
const {
  createBroadcast,
  getActiveBroadcasts,
  replyToBroadcast,
  getRepliesForBroadcast,
  getMyBroadcasts, // 1. IMPORT
} = require('../controllers/broadcastController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// --- Farmer Routes ---
router.get('/', protect, getActiveBroadcasts);
router.post('/:id/reply', protect, replyToBroadcast);

// --- Admin Routes ---
router.post('/', protect, admin, createBroadcast);
router.get('/my-broadcasts', protect, admin, getMyBroadcasts); // 2. ADD THIS ROUTE
router.get('/:id/replies', protect, admin, getRepliesForBroadcast);

module.exports = router;

