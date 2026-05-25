const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    aadhaar: { type: String, required: true, unique: true },
    constituency: { type: String, required: true },
    walletAddress: { type: String, required: true, unique: true },
    hasVoted: { type: Boolean, default: false },
    ballotHash: { type: String, default: null },
    faceDataHash: { type: String, required: true }, // Encrypted face biometrics representation
    registeredAt: { type: Date, default: Date.now }
});

// Candidate Schema
const CandidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    party: { type: String, required: true },
    symbol: { type: String, required: true }, // Logo representation path
    constituency: { type: String, required: true },
    voteCount: { type: Number, default: 0 }
});

// Vote Schema
const VoteSchema = new mongoose.Schema({
    voterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    blockchainHash: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now }
});

// Election Schema
const ElectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['NotStarted', 'Active', 'Completed'], default: 'NotStarted' }
});

module.exports = {
    User: mongoose.models.User || mongoose.model('User', UserSchema),
    Candidate: mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema),
    Vote: mongoose.models.Vote || mongoose.model('Vote', VoteSchema),
    Election: mongoose.models.Election || mongoose.model('Election', ElectionSchema)
};
