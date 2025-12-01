const mongoose = require('mongoose');

const raffleSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: {
    name: String,
    description: String,
    images: [String],
    estimatedValue: Number
  },
  ticketPrice: { type: Number, required: true },
  totalTickets: { type: Number, required: true },
  soldTickets: { type: Number, default: 0 },
  minThreshold: { type: Number, default: 0.5 },
  endAt: { type: Date, required: true },
  status: { type: String, enum: ['active', 'ended', 'failed', 'drawn'], default: 'active' }
});

module.exports = mongoose.model('Raffle', raffleSchema);