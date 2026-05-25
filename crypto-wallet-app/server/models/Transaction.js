const mongoose = require('mongoose');

const TxSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  amount: { type: String, required: true },
  txHash: { type: String, required: true },
  network: { type: String, default: 'sepolia' },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending','confirmed','failed'], default: 'pending' }
});

module.exports = mongoose.model('Transaction', TxSchema);
