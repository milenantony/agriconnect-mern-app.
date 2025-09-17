// backend/models/broadcastMessageModel.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const broadcastMessageSchema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
  },
  // --- NEW FIELD ADDED ---
  // This array will store the user IDs of farmers who have seen this message.
  seenBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  clearedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
});

const BroadcastMessage = mongoose.model('BroadcastMessage', broadcastMessageSchema);

module.exports = BroadcastMessage;

