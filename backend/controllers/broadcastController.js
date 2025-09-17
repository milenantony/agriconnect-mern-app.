const BroadcastMessage = require('../models/broadcastMessageModel');
const FarmerReply = require('../models/farmerReplyModel');

// All existing functions are verified and complete...
const createBroadcast = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) { return res.status(400).json({ message: 'Message is required' }); }
    const broadcast = new BroadcastMessage({ message, admin: req.user._id });
    await broadcast.save();
    
    res.status(201).json(broadcast);
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
const getActiveBroadcasts = async (req, res) => {
  try {
    // The new logic now filters out any messages the user has cleared.
    const broadcasts = await BroadcastMessage.find({ 
      status: 'active',
      clearedBy: { $ne: req.user._id } // $ne means "not equal to"
    })
      .sort({ createdAt: -1 })
      .populate('admin', 'name');
    res.json(broadcasts);
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
const replyToBroadcast = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    if (!replyMessage) { return res.status(400).json({ message: 'Reply message is required' }); }
    const broadcast = await BroadcastMessage.findById(req.params.id);
    if (!broadcast) { return res.status(404).json({ message: 'Broadcast not found' }); }
    const reply = new FarmerReply({ replyMessage, broadcastMessage: req.params.id, farmer: req.user._id });
    await reply.save();
    res.status(201).json(reply);
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
const getRepliesForBroadcast = async (req, res) => {
  try {
    const broadcast = await BroadcastMessage.findById(req.params.id);
    if (!broadcast) { return res.status(404).json({ message: 'Broadcast not found' }); }
    const replies = await FarmerReply.find({ broadcastMessage: req.params.id }).populate('farmer', 'name profileImage contactNumber place').sort({ createdAt: -1 });
    res.json({ replies: replies, broadcastMessage: broadcast.message });
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
const getMyBroadcasts = async (req, res) => {
    try {
        const broadcasts = await BroadcastMessage.find({ admin: req.user._id }).sort({ createdAt: -1 });
        res.json(broadcasts);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
const markBroadcastAsSeen = async (req, res) => {
    try {
        const broadcast = await BroadcastMessage.findById(req.params.id);
        if (!broadcast) { return res.status(404).json({ message: 'Broadcast not found' }); }
        if (!broadcast.seenBy.includes(req.user._id)) {
            broadcast.seenBy.push(req.user._id);
            await broadcast.save();
        }
        res.json({ message: 'Broadcast marked as seen.' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
const getMyReplies = async (req, res) => {
    try {
        const replies = await FarmerReply.find({ farmer: req.user._id }).populate('broadcastMessage', 'message').sort({ createdAt: -1 });
        res.json(replies);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
const markReplyAsViewed = async (req, res) => {
    try {
        const reply = await FarmerReply.findById(req.params.replyId);
        if (!reply) { return res.status(404).json({ message: 'Reply not found' }); }
        reply.isViewed = true;
        await reply.save();
        res.json({ message: 'Reply marked as viewed.' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
const deleteAllRepliesForBroadcast = async (req, res) => {
    try {
        const broadcast = await BroadcastMessage.findById(req.params.id);
        if (!broadcast) { return res.status(404).json({ message: 'Broadcast not found' }); }
        if (broadcast.admin.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await FarmerReply.deleteMany({ broadcastMessage: req.params.id });
        res.json({ message: 'All replies for this broadcast have been cleared.' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
const deleteBroadcast = async (req, res) => {
    try {
        const broadcast = await BroadcastMessage.findById(req.params.id);
        if (!broadcast) { return res.status(404).json({ message: 'Broadcast not found' }); }
        if (broadcast.admin.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await FarmerReply.deleteMany({ broadcastMessage: req.params.id });
        await BroadcastMessage.deleteOne({ _id: req.params.id });
        res.json({ message: 'Broadcast and all its replies have been deleted.' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const markAllBroadcastsAsSeen = async (req, res) => {
    try {
        await BroadcastMessage.updateMany(
            { 'seenBy': { $ne: req.user._id } },
            { $push: { seenBy: req.user._id } }
        );
        res.json({ message: 'All broadcasts marked as seen.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const clearMyReplies = async (req, res) => {
    try {
        await FarmerReply.deleteMany({ farmer: req.user._id });
        res.json({ message: 'All your replies have been cleared.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const clearAllMyBroadcasts = async (req, res) => {
    try {
        // Find all broadcasts that this user has NOT already cleared
        const broadcastsToClear = await BroadcastMessage.find({ clearedBy: { $ne: req.user._id } });
        
        // Add the user's ID to the 'clearedBy' array for each one
        broadcastsToClear.forEach(broadcast => {
            broadcast.clearedBy.push(req.user._id);
        });

        // Save all the changes to the database
        await Promise.all(broadcastsToClear.map(b => b.save()));
        
        res.json({ message: 'All broadcasts have been cleared from your view.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
  createBroadcast, getActiveBroadcasts, replyToBroadcast, getRepliesForBroadcast,
  getMyBroadcasts, markBroadcastAsSeen, getMyReplies, markReplyAsViewed,
  deleteAllRepliesForBroadcast, deleteBroadcast,
  markAllBroadcastsAsSeen, clearMyReplies,clearAllMyBroadcasts,
};

