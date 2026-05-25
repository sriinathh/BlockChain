const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { uploadToCloudinary } = require('../services/ipfsService');

const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || 'supersecurejwtsecretkeylandchaintokenauth', 
    { expiresIn: '30d' }
  );
};

// @desc    Register a new Citizen / Officer
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, aadhaar, wallet, password, role } = req.body;

  // Check if Aadhaar / Wallet / Email already registered
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(409).json({ success: false, message: 'Email address already mapped to a citizen.' });
  }

  const aadhaarExists = await User.findOne({ aadhaar });
  if (aadhaarExists) {
    return res.status(409).json({ success: false, message: 'Aadhaar ID already mapped to a citizen.' });
  }

  const walletExists = await User.findOne({ wallet: wallet.toLowerCase() });
  if (walletExists) {
    return res.status(409).json({ success: false, message: 'Web3 Wallet public key already bound to a citizen.' });
  }

  let profileImageUrl = '';
  // Handle profile image upload if present
  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.path);
    profileImageUrl = uploadResult.secure_url;
  }

  // Create User (Role default 'Citizen' unless overridden)
  const user = await User.create({
    name,
    email,
    phone,
    aadhaar,
    wallet: wallet.toLowerCase(),
    password,
    role: role || 'Citizen',
    profileImage: profileImageUrl,
    isVerified: true
  });

  return res.status(201).json({
    success: true,
    message: 'Citizen profile minted successfully.',
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      aadhaar: user.aadhaar,
      wallet: user.wallet,
      role: user.role,
      profileImage: user.profileImage
    }
  });
});

// @desc    Authenticate User & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { aadhaar, password } = req.body;

  // Find user and select password
  const user = await User.findOne({ aadhaar }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Aadhaar number not registered.' });
  }

  // Compare passwords
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid password signature.' });
  }

  return res.status(200).json({
    success: true,
    message: 'Authorized successfully.',
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      aadhaar: user.aadhaar,
      wallet: user.wallet,
      role: user.role,
      profileImage: user.profileImage
    }
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Citizen profile not found.' });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      aadhaar: user.aadhaar,
      wallet: user.wallet,
      role: user.role,
      profileImage: user.profileImage,
      isVerified: user.isVerified
    }
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
