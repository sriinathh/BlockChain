const { asyncHandler } = require('../middleware/errorHandler');
const {
  registerLandOnBlockchain,
  transferOwnership,
  verifyOwnership,
  getTransactionHistory
} = require('../services/blockchainService');

// @desc    Trigger On-chain Land Registration
// @route   POST /api/blockchain/register
// @access  Private
const triggerBlockchainRegister = asyncHandler(async (req, res) => {
  const { landId, surveyNumber, area, district, state, gps, ipfsHash } = req.body;

  const result = await registerLandOnBlockchain(
    landId || Math.floor(100000 + Math.random() * 900000),
    surveyNumber,
    area,
    district,
    state,
    gps,
    ipfsHash
  );

  return res.status(200).json({
    success: true,
    message: 'On-chain transaction processed.',
    result
  });
});

// @desc    Trigger On-chain Ownership Transfer
// @route   POST /api/blockchain/transfer
// @access  Private
const triggerBlockchainTransfer = asyncHandler(async (req, res) => {
  const { landId, toWallet, toName, toAadhaar } = req.body;

  const result = await transferOwnership(
    landId,
    toWallet,
    toName,
    toAadhaar
  );

  return res.status(200).json({
    success: true,
    message: 'On-chain convey code executed.',
    result
  });
});

// @desc    Get wallet transaction history logs from Node provider
// @route   GET /api/blockchain/history
// @access  Public
const getBlockchainTxHistory = asyncHandler(async (req, res) => {
  const { wallet } = req.query;
  const history = await getTransactionHistory(wallet);
  return res.status(200).json({ success: true, count: history.length, history });
});

// @desc    Verify title ownership directly on smart contract state
// @route   GET /api/blockchain/verify/:id
// @access  Public
const getBlockchainVerifyOwner = asyncHandler(async (req, res) => {
  const landIdNumeric = parseInt(req.params.id);
  const verifyData = await verifyOwnership(landIdNumeric);
  return res.status(200).json({ success: true, verifyData });
});

module.exports = {
  triggerBlockchainRegister,
  triggerBlockchainTransfer,
  getBlockchainTxHistory,
  getBlockchainVerifyOwner
};
