const mongoose = require('mongoose');

const TxSchema = new mongoose.Schema({
  sender: { type: String },
  receiver: { type: String },
  amount: { type: Number, required: true },
  tokenType: { type: String, default: 'MBT' },
  txHash: { type: String },
  network: { type: String, default: 'local' },
  status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TxSchema);
