const Land = require('../models/Land');
const FraudReport = require('../models/FraudReport');
const Transaction = require('../models/Transaction');
const { asyncHandler } = require('../middleware/errorHandler');
const { uploadToIPFS } = require('../services/ipfsService');
const { registerLandOnBlockchain } = require('../services/blockchainService');
const { broadcastAlert } = require('../sockets/socketService');

// @desc    Register a new Land Title
// @route   POST /api/lands/register
// @access  Private (Citizen / Admin)
const registerLand = asyncHandler(async (req, res) => {
  const { surveyNumber, area, district, state, gps, coordinates } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please attach legal deed documents.' });
  }

  // Parse geometry coordinates from req: expects [[lng, lat], [lng, lat], ...]
  // MongoDB expects double array nesting for Polygon: [[[lng, lat], [lng, lat], ...]]
  let parsedCoords = [];
  try {
    parsedCoords = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
  } catch (e) {
    return res.status(400).json({ success: false, message: 'Coordinates must be valid JSON array.' });
  }

  // Ensure polygon is closed (first coord matches last coord)
  if (
    parsedCoords[0][0] !== parsedCoords[parsedCoords.length - 1][0] ||
    parsedCoords[0][1] !== parsedCoords[parsedCoords.length - 1][1]
  ) {
    parsedCoords.push([parsedCoords[0][0], parsedCoords[0][1]]);
  }

  const geometry = {
    type: 'Polygon',
    coordinates: [parsedCoords]
  };

  // Upload deed file to Pinata IPFS
  const { ipfsHash } = await uploadToIPFS(req.file.path, req.file.originalname);

  // Generate unique numeric landId for blockchain (using uint256 in Solidity)
  const landIdNumeric = Math.floor(100000 + Math.random() * 900000);

  // Deploy/Write transaction details on blockchain via ethers
  const blockReceipt = await registerLandOnBlockchain(
    landIdNumeric,
    surveyNumber,
    area,
    district,
    state,
    gps,
    ipfsHash
  );

  // Save audit log
  await Transaction.create({
    hash: blockReceipt.txHash,
    blockNumber: blockReceipt.blockNumber,
    from: '0x0000000000000000000000000000000000000000',
    to: req.user.wallet,
    action: `Register Land (Survey ${surveyNumber})`,
    status: 'Success',
    fee: blockReceipt.gasUsed ? `${(parseInt(blockReceipt.gasUsed) * 19 * 1e-9).toFixed(5)} ETH` : '0.00081 ETH'
  });

  // Create Land document
  const land = await Land.create({
    ownerId: req.user._id,
    ownerName: req.user.name,
    surveyNumber,
    area: `${area} Acres`,
    district,
    state,
    gps,
    geometry,
    txHash: blockReceipt.txHash,
    ipfsHash,
    status: 'Pending',
    currentOwnerWallet: req.user.wallet,
    history: [{
      from: 'Genesis Registry',
      to: req.user.name,
      txHash: blockReceipt.txHash,
      type: 'Registration Request'
    }]
  });

  // AI overlap check: Search MongoDB for intersecting land parcel boundaries
  const overlappingLands = await Land.find({
    _id: { $ne: land._id },
    status: 'Verified',
    geometry: {
      $geoIntersects: {
        $geometry: geometry
      }
    }
  });

  if (overlappingLands.length > 0) {
    console.warn(`GIS Overlap Warning: Survey ${surveyNumber} overlaps existing properties!`);
    const details = overlappingLands.map(l => l.surveyNumber).join(', ');
    
    // Create Fraud Alert
    const report = await FraudReport.create({
      landId: land._id,
      surveyNumber,
      type: 'Boundary Collision',
      riskScore: 90,
      description: `GIS Overlap conflict detected. Boundary coordinates intersect with Survey Plots: ${details}`,
      evidence: `Overlapping polygon intersection in GIS Database. Conflicting plots: ${details}`,
      status: 'Investigating'
    });

    // Alert admins in real-time
    broadcastAlert('fraud_alert', {
      message: `Boundary collision warning: Plot ${surveyNumber} overlaps Verified assets!`,
      reportId: report._id,
      riskScore: 90
    });
  }

  return res.status(201).json({
    success: true,
    message: 'Land deed registered successfully. Awaiting validator verification.',
    land
  });
});

// @desc    Get all Lands (with district/state filters)
// @route   GET /api/lands
// @access  Public
const getAllLands = asyncHandler(async (req, res) => {
  const { district, state, status, owner } = req.query;
  const filter = {};

  if (district) filter.district = district;
  if (state) filter.state = state;
  if (status) filter.status = status;
  if (owner) filter.currentOwnerWallet = owner.toLowerCase();

  const lands = await Land.find(filter).populate('ownerId', 'name email');
  return res.status(200).json({ success: true, count: lands.length, lands });
});

// @desc    Get single land
// @route   GET /api/lands/:id
// @access  Public
const getLandById = asyncHandler(async (req, res) => {
  const land = await Land.findById(req.params.id).populate('ownerId', 'name email aadhaar wallet');

  if (!land) {
    return res.status(404).json({ success: false, message: 'Property title not found.' });
  }

  return res.status(200).json({ success: true, land });
});

// @desc    Update land (Administrative parameters)
// @route   PUT /api/lands/:id
// @access  Private (Officer / Admin)
const updateLand = asyncHandler(async (req, res) => {
  let land = await Land.findById(req.params.id);

  if (!land) {
    return res.status(404).json({ success: false, message: 'Property title not found.' });
  }

  land = await Land.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  return res.status(200).json({ success: true, message: 'Record updated successfully.', land });
});

// @desc    Delete land (Remove invalid entry)
// @route   DELETE /api/lands/:id
// @access  Private (Admin Only)
const deleteLand = asyncHandler(async (req, res) => {
  const land = await Land.findById(req.params.id);

  if (!land) {
    return res.status(404).json({ success: false, message: 'Property title not found.' });
  }

  await land.deleteOne();
  return res.status(200).json({ success: true, message: 'Record purged from local registry.' });
});

module.exports = {
  registerLand,
  getAllLands,
  getLandById,
  updateLand,
  deleteLand
};
