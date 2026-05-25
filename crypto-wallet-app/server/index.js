require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const txRoutes = require('./routes/transactions');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect DB (optional for quick frontend-only development)
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.warn('Warning: MONGO_URI not set — running without MongoDB. Create server/.env to enable DB.');
} else {
  mongoose.connect(MONGO_URI).then(()=>{
    console.log('Connected to MongoDB');
  }).catch(err=>{
    console.error('MongoDB connection error', err);
    // don't crash; allow server to run but log error
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', txRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, ()=>{
  console.log(`Server listening on port ${PORT}`);
});
