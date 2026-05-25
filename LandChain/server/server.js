require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./sockets/socketService');

const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

// Build http server wrapping express app
const server = http.createServer(app);

// Mount socket.io endpoints
initSocket(server);

// Listen to network socket port
server.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`LandChain Backend Node Booted Successfully!`);
  console.log(`Port: http://localhost:${PORT}`);
  console.log(`Enviroment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`========================================`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err, promise) => {
  console.error(`UNHANDLED PROMISE REJECTION: ${err.message}`);
  // Keep server running in production but log details
});
