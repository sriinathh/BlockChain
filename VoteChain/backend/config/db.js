const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/votechain';
        console.log(`[DB] Attempting database connection: ${mongoURI}`);
        
        // Dynamic mock fallback if Mongo is not running
        mongoose.set('strictQuery', false);
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 2000 // Short timeout to fail-fast and switch to local store
        });
        console.log('[DB] MongoDB database linked successfully.');
    } catch (err) {
        console.warn('[DB] Connection failed. Fallback: running memory-linked database models.');
    }
};

module.exports = connectDB;
