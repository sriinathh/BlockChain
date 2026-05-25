const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  landId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Land',
    required: true
  },
  fromWallet: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  toName: {
    type: String,
    required: true,
    trim: true
  },
  toWallet: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  toAadhaar: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  officer: {
    type: String, // Name or ID of approving officer
    default: ''
  },
  txHash: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transfer', transferSchema);
