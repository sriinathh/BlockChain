const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

// Express App Initialization
const app = express();
const server = http.createServer(app);

// Dynamic imports with error capture for strict security tools
let helmet;
try {
    helmet = require('helmet');
    app.use(helmet());
} catch(e) {
    console.warn('[SERVER] Helmet headers package not installed. Skipping.');
}

// Request rate limiter setup
let rateLimit;
try {
    rateLimit = require('express-rate-limit');
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    });
    app.use('/api/', limiter);
} catch(e) {
    console.warn('[SERVER] Express rate limiter not installed. Skipping.');
}

// standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Link Database
connectDB();

// Bind API routes
app.use('/api', apiRoutes);

// Serves client files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.json({ message: 'VoteChain Federal Blockchain API Operational. Mode: Development.' });
    });
}

// Socket.io Real-Time Event System for Live Standings Tally
let io;
try {
    const socketIo = require('socket.io');
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('[SOCKET] Consensus node client connected: ', socket.id);
        socket.on('disconnect', () => {
            console.log('[SOCKET] Consensus node client disconnected.');
        });
    });

    // Make io accessible globally
    app.set('io', io);
} catch(e) {
    console.warn('[SOCKET] Socket.io not configured or not installed. Running in restful state.');
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`[SERVER] Federal E-Voting server running on port ${PORT}`);
});
