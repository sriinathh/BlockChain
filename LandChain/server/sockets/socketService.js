const { Server } = require('socket.io');

let io = null;
const userSockets = new Map(); // Maps userId -> Set of socket.ids (handles multiple active devices)

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    // Listen for authentication and map user ID to socket
    socket.on('authenticate', (userId) => {
      if (userId) {
        if (!userSockets.has(userId)) {
          userSockets.set(userId, new Set());
        }
        userSockets.get(userId).add(socket.id);
        console.log(`Socket authenticated: User ${userId} linked to ${socket.id}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket Disconnected: ${socket.id}`);
      // Clean up mapping
      for (const [userId, socketIds] of userSockets.entries()) {
        if (socketIds.has(socket.id)) {
          socketIds.delete(socket.id);
          if (socketIds.size === 0) {
            userSockets.delete(userId);
          }
          break;
        }
      }
    });
  });

  return io;
};

const sendRealtimeNotification = (userId, data) => {
  if (!io) return;
  const socketIds = userSockets.get(userId.toString());
  if (socketIds) {
    socketIds.forEach((socketId) => {
      io.to(socketId).emit('notification', data);
    });
    console.log(`Realtime notification sent to user: ${userId}`);
  }
};

const broadcastAlert = (eventName, data) => {
  if (!io) return;
  io.emit(eventName, data);
  console.log(`Broadcasted realtime warning: ${eventName}`);
};

module.exports = {
  initSocket,
  sendRealtimeNotification,
  broadcastAlert
};
