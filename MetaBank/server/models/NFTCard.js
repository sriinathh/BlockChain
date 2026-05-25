const mongoose = require('mongoose');

const NFTCardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  walletAddress: { type: String, required: true },
  tokenId: { type: Number, required: true, unique: true },
  tier: { type: String, enum: ['standard', 'premium', 'elite'], default: 'standard' },
  imageHash: { type: String },
  cardName: { type: String },
  mintedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NFTCard', NFTCardSchema);
