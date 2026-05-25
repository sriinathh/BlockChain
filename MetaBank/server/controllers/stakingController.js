const Staking = require('../models/Staking');
const User = require('../models/User');

exports.stake = async (req, res, next) => {
  try {
    const { userId, wallet, amount, lockPeriodDays = 30 } = req.body;
    if (!wallet || !amount) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if ((user.tokenBalance || 0) < Number(amount)) return res.status(400).json({ message: 'Insufficient token balance' });
    user.tokenBalance -= Number(amount);
    user.stakingBalance = (user.stakingBalance || 0) + Number(amount);
    await user.save();
    const stake = await Staking.create({ user: userId, wallet, amount, lockPeriodDays });
    res.json({ ok: true, stake });
  } catch (err) { next(err); }
};

exports.unstake = async (req, res, next) => {
  try {
    const { stakeId } = req.body;
    const stake = await Staking.findById(stakeId);
    if (!stake) return res.status(404).json({ message: 'Stake not found' });
    const elapsedDays = Math.floor((Date.now() - stake.startedAt) / (1000 * 60 * 60 * 24));
    const user = await User.findOne({ wallets: stake.wallet });
    if (!user) return res.status(404).json({ message: 'User not found' });
    // allow unstake anytime but rewards only after lock
    const rewardRate = 0.01; // 1% per period (example)
    const rewards = elapsedDays > stake.lockPeriodDays ? stake.amount * rewardRate : 0;
    user.tokenBalance = (user.tokenBalance || 0) + stake.amount + rewards;
    user.stakingBalance = (user.stakingBalance || 0) - stake.amount;
    stake.unstakedAt = new Date();
    stake.rewards = rewards;
    await stake.save();
    await user.save();
    res.json({ ok: true, stake, userBalance: user.tokenBalance });
  } catch (err) { next(err); }
};

exports.rewards = async (req, res, next) => {
  try {
    const { wallet } = req.params;
    const stakes = await Staking.find({ wallet });
    res.json({ ok: true, stakes });
  } catch (err) { next(err); }
};
