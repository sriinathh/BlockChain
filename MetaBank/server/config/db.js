const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/metabank';

mongoose.set('strictQuery', false);

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    // keep process running; mongoose will try to reconnect by default
  }
};

connect();

mongoose.connection.on('error', (err) => console.error('MongoDB error', err));
mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));

module.exports = mongoose;
