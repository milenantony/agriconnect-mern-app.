// backend/routes/broadcastRoutes.js

const express = require('express');
const router = express.Router();

// THIS IS THE CORRECTED IMPORT: It now includes all necessary functions
const {
  createBroadcast, getActiveBroadcasts, replyToBroadcast,
  getRepliesForBroadcast, getMyBroadcasts, markBroadcastAsSeen,
  getMyReplies, markReplyAsViewed, deleteAllRepliesForBroadcast,
  deleteBroadcast, markAllBroadcastsAsSeen, clearMyReplies,clearAllMyBroadcasts
} = require('../controllers/broadcastController');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// --- Farmer Routes ---
router.get('/', protect, getActiveBroadcasts);
router.get('/my-replies', protect, getMyReplies);
router.post('/:id/reply', protect, replyToBroadcast);
router.put('/:id/seen', protect, markBroadcastAsSeen);
router.put('/mark-all-seen', protect, markAllBroadcastsAsSeen);
router.delete('/clear-my-replies', protect, clearMyReplies);
router.put('/clear-all-mine', protect, clearAllMyBroadcasts); 

// --- Admin Routes ---
router.post('/', protect, admin, createBroadcast);
router.get('/my-broadcasts', protect, admin, getMyBroadcasts);
router.get('/:id/replies', protect, admin, getRepliesForBroadcast);
router.put('/replies/:replyId/viewed', protect, admin, markReplyAsViewed);
router.delete('/:id/replies', protect, admin, deleteAllRepliesForBroadcast);
router.delete('/:id', protect, admin, deleteBroadcast);

module.exports = router;

