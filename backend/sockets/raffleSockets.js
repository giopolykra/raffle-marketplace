// In server.js: require('./sockets/raffleSockets')(io); // Pass io instance

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a raffle room for live updates
    socket.on('joinRaffle', (raffleId) => {
      socket.join(`raffle_${raffleId}`);
      console.log(`User ${socket.id} joined raffle ${raffleId}`);
    });

    // Emit raffle update (call from controllers, e.g., after buy)
    // Example usage: io.to(`raffle_${raffleId}`).emit('raffleUpdate', { sold: newSold, odds: '1:100' });

    // Live draw event
    socket.on('watchDraw', (raffleId) => {
      // Stub: Emit countdown, then winner
      io.to(`raffle_${raffleId}`).emit('drawStarting');
      // Simulate: setTimeout(() => io.to(`raffle_${raffleId}`).emit('winnerDrawn', { winnerId, ticket: 42 }), 5000);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};