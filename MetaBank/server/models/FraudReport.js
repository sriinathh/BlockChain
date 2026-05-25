const mongoose = require('mongoose');

const FraudReportSchema = new mongoose.Schema({
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  walletAddress: { type: String },
  amount: { type: Number },
  riskScore: { type: Number, required: true },
  status: { type: String, enum: ['flagged', 'investigating', 'resolved', 'dismissed'], default: 'flagged' },
  reason: { type: String },
  reporter: { type: String, default: 'AI Fraud Monitor' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FraudReport', FraudReportSchema);
