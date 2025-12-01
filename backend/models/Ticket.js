const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  raffleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Raffle', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true, min: 1 },
  ticketNumbers: [{ type: Number }], // Array of unique ints (e.g., [5, 12, 34]) for draw
  paymentIntentId: { type: String }, // Stripe ID for refunds
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);