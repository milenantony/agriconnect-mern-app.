// backend/models/farmerReplyModel.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const farmerReplySchema = new Schema({
  broadcastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'BroadcastMessage',
    required: true,
  },
  farmer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  replyMessage: {
    type: String,
    required: true,
    trim: true,
  },
  // --- NEW FIELD ADDED ---
  // This flag will be used to show the farmer if the admin has seen their reply.
  isViewed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const FarmerReply = mongoose.model('FarmerReply', farmerReplySchema);

module.exports = FarmerReply;

