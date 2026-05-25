const User = require('../models/User');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) { next(err); }
};

exports.verifyAadhar = async (req, res, next) => {
  try {
    const { userId, verified } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.aadharVerified = !!verified;
    await user.save();
    res.json({ success: true, user: { id: user._id, aadharVerified: user.aadharVerified } });
  } catch (err) { next(err); }
};
