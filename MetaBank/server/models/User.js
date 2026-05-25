const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  fullName: { type: String },
  aadharNumber: { type: String },
  aadharImage: { type: String },
  aadharVerified: { type: Boolean, default: false },
  twoFactor: {
    enabled: { type: Boolean, default: false },
    secret: { type: String }
  },
  wallets: [{ type: String }],
  nonce: { type: String },
  profileImage: { type: String },
  tokenBalance: { type: Number, default: 0 },
  ethBalance: { type: String, default: '0' },
  stakingBalance: { type: Number, default: 0 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (entered) {
  if (!this.password) return false;
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', UserSchema);
