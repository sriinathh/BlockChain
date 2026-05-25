const Transfer = require('../models/Transfer');
const Land = require('../models/Land');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');
const { transferOwnership } = require('../services/blockchainService');
const { sendRealtimeNotification } = require('../sockets/socketService');

// @desc    Initiate a land transfer request
// @route   POST /api/transfers/create
// @access  Private (Citizen)
const createTransferRequest = asyncHandler(async (req, res) => {
  const { landId, toName, toWallet, toAadhaar } = req.body;

  // Find land parcel and verify owner
  const land = await Land.findById(landId);
  if (!land) {
    return res.status(404).json({ success: false, message: 'Property title not found.' });
  }

  // Ensure current owner is the applicant
  if (land.currentOwnerWallet.toLowerCase() !== req.user.wallet.toLowerCase()) {
    return res.status(403).json({ success: false, message: 'Unauthorized. You are not the signed deed holder.' });
  }

  // Ensure land is Verified
  if (land.status !== 'Verified') {
    return res.status(400).json({ success: false, message: 'Only fully Verified land titles can be transacted.' });
  }

  // Create pending transfer request
  const transfer = await Transfer.create({
    landId,
    fromWallet: req.user.wallet,
    toName,
    toWallet: toWallet.toLowerCase(),
    toAadhaar,
    status: 'Pending'
  });

  // Notify recipient (find matching user in database)
  const recipientUser = await User.findOne({ wallet: toWallet.toLowerCase() });
  if (recipientUser) {
    const notifyMsg = `Deed transfer request filed: Survey ${land.surveyNumber} conveyance is pending verification.`;
    
    // Save Notification
    await Notification.create({
      userId: recipientUser._id,
      title: 'Incoming Land Transfer',
      message: notifyMsg,
      type: 'info'
    });

    sendRealtimeNotification(recipientUser._id, {
      title: 'Incoming Land Transfer',
      message: notifyMsg
    });
  }

  return res.status(201).json({
    success: true,
    message: 'Transfer request logged successfully. Awaiting official review.',
    transfer
  });
});

// @desc    Approve / Reject transfer request
// @route   POST /api/transfers/approve
// @access  Private (Officer / Admin)
const approveTransferRequest = asyncHandler(async (req, res) => {
  const { transferId, action } = req.body; // Action: 'Approve' or 'Reject'

  if (!['Approve', 'Reject'].includes(action)) {
    return res.status(400).json({ success: false, message: "Action must be either 'Approve' or 'Reject'." });
  }

  const transfer = await Transfer.findById(transferId);
  if (!transfer) {
    return res.status(404).json({ success: false, message: 'Conveyance request not found.' });
  }

  if (transfer.status !== 'Pending') {
    return res.status(400).json({ success: false, message: 'This transaction request has already been processed.' });
  }

  const land = await Land.findById(transfer.landId);
  if (!land) {
    return res.status(404).json({ success: false, message: 'Property title not found.' });
  }

  // Find recipient user profile to bind MongoDB Ownership reference
  const recipientUser = await User.findOne({ wallet: transfer.toWallet });
  if (!recipientUser && action === 'Approve') {
    return res.status(400).json({ success: false, message: 'Recipient is not registered in the system database.' });
  }

  const officerName = req.user.name;

  if (action === 'Reject') {
    transfer.status = 'Rejected';
    transfer.officer = officerName;
    await transfer.save();

    // Alert initiator
    const senderUser = await User.findOne({ wallet: transfer.fromWallet });
    if (senderUser) {
      await Notification.create({
        userId: senderUser._id,
        title: 'Transfer Request Rejected',
        message: `Your conveyance request for Survey ${land.surveyNumber} has been rejected by administration.`,
        type: 'error'
      });
      sendRealtimeNotification(senderUser._id, {
        title: 'Transfer Request Rejected',
        message: `Your conveyance request for Survey ${land.surveyNumber} has been rejected by administration.`
      });
    }

    return res.status(200).json({ success: true, message: 'Transfer request rejected successfully.', transfer });
  }

  // Action is APPROVE: Execute smart contract call
  // Generate numeric representation of landId
  const landIdNumeric = parseInt(land.txHash.substring(2, 10), 16) || Math.floor(Math.random() * 900000);

  const blockReceipt = await transferOwnership(
    landIdNumeric,
    transfer.toWallet,
    transfer.toName,
    transfer.toAadhaar
  );

  // Save audit log
  await Transaction.create({
    hash: blockReceipt.txHash,
    blockNumber: blockReceipt.blockNumber,
    from: transfer.fromWallet,
    to: transfer.toWallet,
    action: `Transfer Land Title (${land.surveyNumber})`,
    status: 'Success',
    fee: blockReceipt.gasUsed ? `${(parseInt(blockReceipt.gasUsed) * 24 * 1e-9).toFixed(5)} ETH` : '0.00130 ETH'
  });

  // Keep records of previous owner
  const previousOwnerName = land.ownerName;

  // Mutate Land document parameters to convey ownership
  land.ownerId = recipientUser._id;
  land.ownerName = transfer.toName;
  land.currentOwnerWallet = transfer.toWallet;
  land.txHash = blockReceipt.txHash;
  
  // Append transaction conveyance entry to history
  land.history.unshift({
    from: previousOwnerName,
    to: transfer.toName,
    txHash: blockReceipt.txHash,
    type: 'Transfer Ownership'
  });

  await land.save();

  // Update transfer document
  transfer.status = 'Approved';
  transfer.officer = officerName;
  transfer.txHash = blockReceipt.txHash;
  await transfer.save();

  // Emit Websocket notifications to old owner (Sender) and new owner (Recipient)
  const oldOwnerUser = await User.findOne({ wallet: transfer.fromWallet });
  if (oldOwnerUser) {
    await Notification.create({
      userId: oldOwnerUser._id,
      title: 'Property Title Conveyed',
      message: `Deed Title for Survey ${land.surveyNumber} successfully transferred to ${transfer.toName}.`,
      type: 'success'
    });
    sendRealtimeNotification(oldOwnerUser._id, {
      title: 'Property Title Conveyed',
      message: `Deed Title for Survey ${land.surveyNumber} successfully transferred to ${transfer.toName}.`
    });
  }

  await Notification.create({
    userId: recipientUser._id,
    title: 'New Property Received',
    message: `You are now the registered on-chain title owner of Survey Plot ${land.surveyNumber}.`,
    type: 'success'
  });
  sendRealtimeNotification(recipientUser._id, {
    title: 'New Property Received',
    message: `You are now the registered on-chain title owner of Survey Plot ${land.surveyNumber}.`
  });

  return res.status(200).json({
    success: true,
    message: 'Ownership transferred on blockchain successfully.',
    transfer,
    land
  });
});

// @desc    Get Transfer History logs
// @route   GET /api/transfers/history
// @access  Public
const getTransferHistory = asyncHandler(async (req, res) => {
  const { wallet } = req.query;
  const filter = {};

  if (wallet) {
    filter.$or = [
      { fromWallet: wallet.toLowerCase() },
      { toWallet: wallet.toLowerCase() }
    ];
  }

  const transfers = await Transfer.find(filter)
    .populate('landId', 'surveyNumber district state area')
    .sort({ createdAt: -1 });

  return res.status(200).json({ success: true, count: transfers.length, transfers });
});

module.exports = {
  createTransferRequest,
  approveTransferRequest,
  getTransferHistory
};
