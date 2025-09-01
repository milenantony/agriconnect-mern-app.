const mongoose = require('mongoose');
const { Schema } = mongoose;

const broadcastMessageSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
}, { timestamps: true });

const BroadcastMessage = mongoose.model('BroadcastMessage', broadcastMessageSchema);
module.exports = BroadcastMessage;
