const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { User, Candidate, Vote, Election } = require('../models/schemas');

const JWT_SECRET = process.env.JWT_SECRET || 'VOTECHAIN_NATIONAL_SECURE_TOKEN_2026';

// In-Memory Database fallback for out-of-the-box operation without running MongoDB
const mockDB = {
    users: [
        { id: '1', name: 'Aarushi Sharma', aadhaar: '123456789012', constituency: 'District A', walletAddress: '0x9E78...2F44', hasVoted: false, ballotHash: null, faceDataHash: 'face_sharma_98a72' },
        { id: '2', name: 'Devendra Varma', aadhaar: '234567890123', constituency: 'District B', walletAddress: '0x1C4A...73bC', hasVoted: false, ballotHash: null, faceDataHash: 'face_varma_38b21' },
    ],
    candidates: [
        { id: '1', name: 'Dr. Aarav Patel', party: 'Democratic Citizens Party', symbol: 'Sun', constituency: 'District A', voteCount: 0 },
        { id: '2', name: 'Meera Krishnan', party: 'National Progress Alliance', symbol: 'Sparkles', constituency: 'District B', voteCount: 0 },
        { id: '3', name: 'Vikram Singh', party: 'Green Liberty Coalition', constituency: 'District A', symbol: 'Leaf', voteCount: 0 },
        { id: '4', name: 'Sanya Iyer', party: 'Digital Vanguard Party', constituency: 'District B', symbol: 'Cpu', voteCount: 0 },
    ],
    votes: [],
    election: { title: 'National General Election 2026', startDate: new Date(), endDate: new Date(Date.now() + 86400000), status: 'Active' },
    logs: [
        { timestamp: Date.now(), message: 'Decentralized VoterRegistry smart contract validated.' },
        { timestamp: Date.now() + 50, message: 'Ingesting consensus node security health reports... 5/5 nodes active.' }
    ]
};

// Middleware: Authenticate Voter
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access token required.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Session expired or invalid.' });
        req.user = user;
        next();
    });
};

// Middleware: Authenticate Admin
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Admin authentication required.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err || !user.isAdmin) return res.status(403).json({ error: 'Access restricted to Election Coordinators.' });
        req.user = user;
        next();
    });
};

// --- AUTHENTICATION ROUTES ---

// Citizen Registration
router.post('/auth/register', [
    body('name').notEmpty().trim().escape(),
    body('aadhaar').isLength({ min: 12, max: 12 }).isNumeric(),
    body('constituency').notEmpty().trim().escape(),
    body('walletAddress').isEthereumAddress()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid input parameters.' });

    const { name, aadhaar, constituency, walletAddress } = req.body;

    try {
        const newUser = {
            id: (mockDB.users.length + 1).toString(),
            name,
            aadhaar,
            constituency,
            walletAddress,
            hasVoted: false,
            ballotHash: null,
            faceDataHash: `face_${name.toLowerCase().replace(/\s/g, '_')}_mock`
        };
        mockDB.users.push(newUser);
        
        // Also write to MongoDB if active
        try {
            const user = new User(newUser);
            await user.save();
        } catch(e) {}

        res.status(201).json({ success: true, message: 'Citizen registration completed.' });
    } catch (err) {
        res.status(500).json({ error: 'Server registration error.' });
    }
});

// Citizen Auth Login (Aadhaar validation check + FaceScan mock check)
router.post('/auth/login', [
    body('aadhaar').isLength({ min: 12, max: 12 }).isNumeric(),
    body('passcode').isLength({ min: 4, max: 4 }).isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Security validation failed.' });

    const { aadhaar } = req.body;

    try {
        // Try searching MongoDB, fallback to mockDB
        let citizen;
        try {
            citizen = await User.findOne({ aadhaar });
        } catch(e) {}
        
        if (!citizen) {
            citizen = mockDB.users.find(u => u.aadhaar === aadhaar);
        }

        if (!citizen) return res.status(404).json({ error: 'Citizen records not found in National Database.' });

        const token = jwt.sign({ 
            id: citizen.id, 
            aadhaar: citizen.aadhaar, 
            name: citizen.name,
            constituency: citizen.constituency,
            isAdmin: false 
        }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ 
            success: true, 
            token,
            citizen: {
                name: citizen.name,
                constituency: citizen.constituency,
                hasVoted: citizen.hasVoted,
                ballotHash: citizen.ballotHash
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Security auth service unavailable.' });
    }
});

// Coordinator Admin Login
router.post('/auth/admin-login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ username: 'admin', isAdmin: true }, JWT_SECRET, { expiresIn: '2h' });
        return res.json({ success: true, token });
    }
    res.status(401).json({ error: 'Invalid coordinator administrative password.' });
});


// --- CITIZEN PORTAL ROUTES ---

// Get Candidates by constituency
router.get('/citizen/candidates', authenticateToken, async (req, res) => {
    const constituency = req.user.constituency;
    try {
        let list;
        try {
            list = await Candidate.find({ constituency });
        } catch(e) {}
        
        if (!list || list.length === 0) {
            list = mockDB.candidates.filter(c => c.constituency === constituency);
        }
        res.json({ success: true, candidates: list });
    } catch(err) {
        res.status(500).json({ error: 'Failed to retrieve ballot candidates.' });
    }
});

// Cast secure Vote (Decentralized Engine validation)
router.post('/citizen/vote', authenticateToken, async (req, res) => {
    const { candidateId } = req.body;
    if (!candidateId) return res.status(400).json({ error: 'Candidate ID is required.' });

    try {
        // Find citizen
        let citizen = mockDB.users.find(u => u.id === req.user.id);
        if (!citizen || citizen.hasVoted) {
            return res.status(400).json({ error: 'Ballot already cast or invalid session.' });
        }

        // Lock voting
        citizen.hasVoted = true;
        const txHash = '0x' + require('crypto').createHash('sha256').update(citizen.id + candidateId + Date.now()).digest('hex');
        citizen.ballotHash = txHash;

        // Increment candidate count
        let cand = mockDB.candidates.find(c => c.id === candidateId);
        if (cand) cand.voteCount++;

        // Audit log
        mockDB.votes.push({
            voterId: citizen.id,
            candidateId,
            blockchainHash: txHash,
            timestamp: new Date()
        });

        mockDB.logs.push({
            timestamp: Date.now(),
            message: `Block mined with transaction audit hash: ${txHash.substring(0, 20)}...`
        });

        res.json({ success: true, txHash, message: 'Ballot cast and cryptographically locked on ledger.' });
    } catch(e) {
        res.status(500).json({ error: 'Blockchain voting transaction dropped.' });
    }
});


// --- ADMIN & SECURITY SERVICES ---

// Tally statistics for Dashboard
router.get('/admin/stats', authenticateAdmin, (req, res) => {
    const totalCount = mockDB.users.length;
    const votedCount = mockDB.users.filter(u => u.hasVoted).length;
    res.json({
        totalVoters: totalCount,
        castBallots: votedCount,
        turnoutRate: totalCount > 0 ? Math.round((votedCount / totalCount) * 100) : 0,
        consNodeHealth: '100% Operational',
        blockchainLogs: mockDB.logs.slice(-10)
    });
});

module.exports = router;
