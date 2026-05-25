const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const landRoutes = require('./routes/landRoutes');
const transferRoutes = require('./routes/transferRoutes');
const adminRoutes = require('./routes/adminRoutes');
const blockchainRoutes = require('./routes/blockchainRoutes');

const app = express();

// Security Headers middleware
app.use(helmet());

// Enable Request Log outputs
app.use(morgan('dev'));

// Configure CORS (Cross-Origin Requests)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiter: maximum 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: {
    success: false,
    message: 'Too many requests filed from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'HEALTHY', timestamp: new Date() });
});

// Bind API Routing paths
app.use('/api/auth', authRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blockchain', blockchainRoutes);

// central error interceptor
app.use(errorHandler);

module.exports = app;
