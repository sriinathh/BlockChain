const mongoose = require('mongoose');

const fraudReportSchema = new mongoose.Schema({
  landId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Land',
    required: true
  },
  surveyNumber: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Duplicate Coordinates', 'Duplicate Survey', 'Fake Documents', 'Boundary Collision']
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  description: {
    type: String,
    required: true
  },
  evidence: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Investigating', 'Resolved'],
    default: 'Investigating'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FraudReport', fraudReportSchema);
