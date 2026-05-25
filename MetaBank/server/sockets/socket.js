module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);
    socket.on('subscribe', (room) => {
      socket.join(room);
    });
    socket.on('unsubscribe', (room) => {
      socket.leave(room);
    });
    socket.on('tx', (data) => {
      // broadcast to wallet room
      if (data && data.wallet) io.to(data.wallet).emit('tx', data);
    });
    socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
  });
};
