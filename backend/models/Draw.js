const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  raffleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Raffle', required: true },
  winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Null if failed
  winningTicket: { type: Number }, // The lucky number
  drawDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'failed'], default: 'success' }
});

module.exports = mongoose.model('Draw', drawSchema);