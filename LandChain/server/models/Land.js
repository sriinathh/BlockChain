const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  from: String,
  to: String,
  date: {
    type: Date,
    default: Date.now
  },
  txHash: String,
  type: String
}, { _id: false });

const landSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  surveyNumber: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: String, // e.g. "2.4 Acres"
    required: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  gps: {
    type: String, // e.g. "12.9716° N, 79.1588° E"
    required: true
  },
  // GeoJSON Polygon for GIS map overlap queries
  geometry: {
    type: {
      type: String,
      enum: ['Polygon'],
      default: 'Polygon',
      required: true
    },
    coordinates: {
      type: [[[Number]]], // Array of arrays of arrays: [[[lng, lat], [lng, lat], ...]]
      required: true
    }
  },
  txHash: {
    type: String,
    required: true,
    unique: true
  },
  ipfsHash: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  currentOwnerWallet: {
    type: String,
    required: true,
    lowercase: true
  },
  history: [historySchema]
}, {
  timestamps: true
});

// Spatial index for GIS queries
landSchema.index({ geometry: '2dsphere' });
landSchema.index({ surveyNumber: 1, district: 1 }, { unique: true }); // Prevent duplicates in the same district

module.exports = mongoose.model('Land', landSchema);
