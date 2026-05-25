const mongoose = require('mongoose');

const StakingSchema = new mongoose.Schema({
  wallet: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  rewards: { type: Number, default: 0 },
  lockPeriodDays: { type: Number, default: 30 },
  startedAt: { type: Date, default: Date.now },
  unstakedAt: { type: Date }
});

module.exports = mongoose.model('Staking', StakingSchema);
