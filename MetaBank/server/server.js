require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('./config/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const path = require('path');

const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const bankRoutes = require('./routes/bank');
const loanRoutes = require('./routes/loan');
const stakingRoutes = require('./routes/staking');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const explorerRoutes = require('./routes/explorer');
const notificationRoutes = require('./routes/notification');

const { errorHandler } = require('./middleware/errorHandler');
const socketHandler = require('./sockets/socket');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/staking', stakingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/explorer', explorerRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => res.json({ ok: true, name: 'MetaBank API' }));

app.use(errorHandler);

socketHandler(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`MetaBank server running on port ${PORT}`);
});

module.exports = { app, io };
