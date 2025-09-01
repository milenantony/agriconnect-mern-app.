const mongoose = require('mongoose');
const { Schema } = mongoose;

const farmerReplySchema = new Schema({
  broadcastMessage: { type: Schema.Types.ObjectId, ref: 'BroadcastMessage', required: true },
  farmer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  replyMessage: { type: String, required: true, trim: true },
}, { timestamps: true });

const FarmerReply = mongoose.model('FarmerReply', farmerReplySchema);
module.exports = FarmerReply;
