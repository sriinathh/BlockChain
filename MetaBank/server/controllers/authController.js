const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ethers } = require('ethers');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const path = require('path');

const fs = require('fs');
const sharp = require('sharp');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.register = async (req, res, next) => {
  try {
    // Expect multipart/form-data with optional aadharImage file
    const { username, email, password, fullName, aadharNumber } = req.body;
    if (!username || !email) return res.status(400).json({ message: 'Missing fields' });
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User exists' });

    const userData = { username, email, password, fullName };
    if (aadharNumber) userData.aadharNumber = aadharNumber;
    let basicAadharCheck = false;
    if (req.file) {
      // store relative path
      userData.aadharImage = `/uploads/${req.file.filename}`;
      try {
        const filepath = path.join(process.cwd(), 'uploads', req.file.filename);
        // basic size check
        const fileSizeMB = req.file.size / (1024 * 1024);
        if (fileSizeMB > 5) {
          basicAadharCheck = false;
        } else {
          const metadata = await sharp(filepath).metadata();
          // require minimum dimensions
          if (metadata.width >= 600 && metadata.height >= 400) basicAadharCheck = true;
        }
      } catch (e) {
        basicAadharCheck = false;
      }
    }

    // If OCR result provided, verify aadhar number digits also
    let ocrMatch = false;
    if (req.body && req.body.aadharOcr && req.body.aadharNumber) {
      const provided = (req.body.aadharNumber || '').replace(/\D/g, '');
      const ocr = (req.body.aadharOcr || '').replace(/\D/g, '');
      if (provided && ocr && ocr.includes(provided)) ocrMatch = true;
    }

    userData.aadharVerified = basicAadharCheck && (ocrMatch || !req.file);

    user = await User.create(userData);
    res.status(201).json({ user: { id: user._id, email: user.email, username: user.username, aadharVerified: user.aadharVerified }, token: generateToken(user._id) });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const matched = await user.matchPassword(password);
    if (!matched) return res.status(400).json({ message: 'Invalid credentials' });
    // If 2FA enabled, require TOTP verification step
    if (user.twoFactor && user.twoFactor.enabled) {
      return res.json({ require2FA: true, userId: user._id, message: '2FA required' });
    }
    res.json({ user: { id: user._id, email: user.email, username: user.username }, token: generateToken(user._id) });
  } catch (err) { next(err); }
};

exports.login2FA = async (req, res, next) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) return res.status(400).json({ message: 'Email and token required' });
    const user = await User.findOne({ email });
    if (!user || !user.twoFactor || !user.twoFactor.secret) return res.status(400).json({ message: '2FA not setup for user' });
    const verified = speakeasy.totp.verify({ secret: user.twoFactor.secret, encoding: 'base32', token, window: 1 });
    if (!verified) return res.status(400).json({ message: 'Invalid 2FA token' });
    res.json({ user: { id: user._id, email: user.email, username: user.username }, token: generateToken(user._id) });
  } catch (err) { next(err); }
};

exports.setup2FA = async (req, res, next) => {
  try {
    // user must be authenticated (protect middleware should set req.user)
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const secret = speakeasy.generateSecret({ name: `MetaBank (${user.email})` });
    // save base32 secret temporarily (not enabled yet)
    user.twoFactor = user.twoFactor || {};
    user.twoFactor.secret = secret.base32;
    await user.save();
    const otpauth = secret.otpauth_url;
    const qrData = await qrcode.toDataURL(otpauth);
    res.json({ otpauth, qrData });
  } catch (err) { next(err); }
};

exports.verify2FA = async (req, res, next) => {
  try {
    const user = req.user;
    const { token } = req.body;
    if (!user || !token) return res.status(400).json({ message: 'Invalid request' });
    const verified = speakeasy.totp.verify({ secret: user.twoFactor.secret, encoding: 'base32', token, window: 1 });
    if (!verified) return res.status(400).json({ message: 'Invalid token' });
    user.twoFactor.enabled = true;
    await user.save();
    res.json({ success: true });
  } catch (err) { next(err); }
};

exports.walletLogin = async (req, res, next) => {
  try {
    const { walletAddress, username, email } = req.body;
    if (!walletAddress) return res.status(400).json({ message: 'walletAddress required' });
    let user = await User.findOne({ wallets: walletAddress });
    if (!user) {
      user = await User.create({ username: username || 'wallet_user', email: email || `${walletAddress}@metabank.local`, wallets: [walletAddress] });
    } else {
      if (!user.wallets.includes(walletAddress)) user.wallets.push(walletAddress);
      await user.save();
    }
    res.json({ user: { id: user._id, wallets: user.wallets }, token: generateToken(user._id) });
  } catch (err) { next(err); }
};

exports.getNonce = async (req, res, next) => {
  try {
    const { address } = req.query;
    if (!address) return res.status(400).json({ message: 'address query required' });
    let user = await User.findOne({ wallets: address });
    if (!user) {
      user = await User.create({ username: `wallet_${address.substring(2,8)}`, email: `${address}@metabank.local`, wallets: [address] });
    }
    const nonce = Math.floor(Math.random() * 1000000).toString();
    user.nonce = nonce;
    await user.save();
    res.json({ address, nonce });
  } catch (err) { next(err); }
};

exports.verifyWallet = async (req, res, next) => {
  try {
    const { address, signature } = req.body;
    if (!address || !signature) return res.status(400).json({ message: 'address and signature required' });
    const user = await User.findOne({ wallets: address });
    if (!user || !user.nonce) return res.status(400).json({ message: 'No nonce found for address' });
    const message = `Login nonce:${user.nonce}`;
    let recovered;
    try {
      recovered = ethers.verifyMessage(message, signature);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid signature' });
    }
    if (recovered.toLowerCase() !== address.toLowerCase()) return res.status(400).json({ message: 'Signature does not match address' });
    user.nonce = undefined;
    await user.save();
    res.json({ user: { id: user._id, wallets: user.wallets }, token: generateToken(user._id) });
  } catch (err) { next(err); }
};

exports.linkWallet = async (req, res, next) => {
  try {
    const user = req.user;
    const { address, signature } = req.body;
    if (!address || !signature) return res.status(400).json({ message: 'Address and signature required' });
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const message = `Link wallet nonce:${user.nonce || 'link_wallet'}`;
    let recovered;
    try {
      recovered = ethers.verifyMessage(message, signature);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid signature' });
    }
    if (recovered.toLowerCase() !== address.toLowerCase()) return res.status(400).json({ message: 'Signature does not match address' });
    
    if (!user.wallets.includes(address)) {
      user.wallets.push(address);
    }
    user.nonce = undefined;
    await user.save();
    
    const Wallet = require('../models/Wallet');
    let cacheWallet = await Wallet.findOne({ address });
    if (!cacheWallet) {
      await Wallet.create({ user: user._id, address, verified: true });
    }
    
    res.json({ success: true, wallets: user.wallets });
  } catch (err) { next(err); }
};

