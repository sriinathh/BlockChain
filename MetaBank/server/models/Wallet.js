const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true, unique: true },
  label: { type: String, default: 'My Wallet' },
  balanceEth: { type: String, default: '0' },
  balanceMbt: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  linkedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wallet', WalletSchema);
