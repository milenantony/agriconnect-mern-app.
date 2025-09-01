const BroadcastMessage = require('../models/broadcastMessageModel');
const FarmerReply = require('../models/farmerReplyModel');

// @desc    Admin creates a new broadcast message
const createBroadcast = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });
    const broadcast = new BroadcastMessage({ message, admin: req.user._id });
    const createdBroadcast = await broadcast.save();
    res.status(201).json(createdBroadcast);
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// @desc    Farmer gets all active broadcast messages
const getActiveBroadcasts = async (req, res) => {
  try {
    const broadcasts = await BroadcastMessage.find({ status: 'active' }).sort({ createdAt: -1 }).populate('admin', 'name');
    res.json(broadcasts);
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// @desc    Farmer replies to a broadcast
const replyToBroadcast = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    if (!replyMessage) return res.status(400).json({ message: 'Reply message is required' });
    const broadcast = await BroadcastMessage.findById(req.params.id);
    if (!broadcast) return res.status(404).json({ message: 'Broadcast not found' });
    const reply = new FarmerReply({ replyMessage, broadcastMessage: req.params.id, farmer: req.user._id });
    const createdReply = await reply.save();
    res.status(201).json(createdReply);
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// @desc    Admin gets all replies for a specific broadcast
const getRepliesForBroadcast = async (req, res) => {
  try {
    const replies = await FarmerReply.find({ broadcastMessage: req.params.id }).populate('farmer', 'name profileImage contactNumber place');
    res.json(replies);
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// --- ADD THIS NEW FUNCTION ---
// @desc    Admin gets all broadcasts they have sent
const getMyBroadcasts = async (req, res) => {
  try {
    const broadcasts = await BroadcastMessage.find({ admin: req.user._id }).sort({ createdAt: -1 });
    res.json(broadcasts);
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

module.exports = {
  createBroadcast,
  getActiveBroadcasts,
  replyToBroadcast,
  getRepliesForBroadcast,
  getMyBroadcasts, // --- ADD THIS EXPORT ---
};

