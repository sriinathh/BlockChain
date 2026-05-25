const User = require('../models/User');
const NFTCard = require('../models/NFTCard');
const Notification = require('../models/Notification');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) { next(err); }
};

exports.mintNFTCard = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { walletAddress, tokenId, tier, imageHash } = req.body;
    if (!walletAddress || !tokenId || !tier) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    
    let existing = await NFTCard.findOne({ tokenId });
    if (existing) return res.status(400).json({ message: 'Token ID already registered' });

    const card = await NFTCard.create({
      user: userId,
      walletAddress,
      tokenId,
      tier,
      imageHash,
      cardName: `${tier.toUpperCase()} VIP Club`
    });

    await Notification.create({
      user: userId,
      title: 'NFT Bank Card Minted',
      message: `Successfully minted your premium ${tier.toUpperCase()} bank card (Token ID: #${tokenId}) on-chain!`,
      type: 'info'
    });

    res.json({ ok: true, card });
  } catch (err) { next(err); }
};

exports.getUserNFTCards = async (req, res, next) => {
  try {
    const { address } = req.params;
    const cards = await NFTCard.find({ walletAddress: address }).sort({ mintedAt: -1 });
    res.json({ ok: true, cards });
  } catch (err) { next(err); }
};

exports.uploadAadhar = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.file) {
      user.aadharImage = `/uploads/${req.file.filename}`;
      user.aadharVerified = true; // Simulate auto-verifying the uploaded document
      await user.save();
    }
    res.json({ ok: true, user });
  } catch (err) { next(err); }
};
