const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  from: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  to: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  action: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Success', 'Fail'],
    default: 'Success'
  },
  fee: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
