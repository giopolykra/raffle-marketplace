const express = require('express');
const mongoose = require('mongoose');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cron = require('node-cron');

const app = express();
app.use(express.json());

// MongoDB Schema
const raffleSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: {
    name: String,
    description: String,
    images: [String],
    estimatedValue: Number
  },
  ticketPrice: { type: Number, required: true }, // e.g., 5.00
  totalTickets: { type: Number, required: true },
  soldTickets: { type: Number, default: 0 },
  minThreshold: { type: Number, default: 0.5 }, // 50% to succeed
  endAt: { type: Date, required: true }, // or 'threshold'
  status: { type: String, enum: ['active', 'ended', 'failed', 'drawn'], default: 'active' }
});

const Raffle = mongoose.model('Raffle', raffleSchema);

// Create Raffle Endpoint
app.post('/raffles', async (req, res) => {
  try {
    const raffle = new Raffle(req.body);
    await raffle.save();
    // Schedule check (example: every minute, but optimize for production)
    cron.schedule('* * * * *', async () => {
      const r = await Raffle.findById(raffle._id);
      if (new Date() >= r.endAt || r.soldTickets >= r.totalTickets) {
        if (r.soldTickets < r.totalTickets * r.minThreshold) {
          r.status = 'failed'; // Trigger refunds via Stripe
          await r.save();
        } else {
          // Draw winner: Pick random from tickets (implement Ticket collection query)
          const winningTicket = Math.floor(Math.random() * r.soldTickets) + 1;
          r.status = 'drawn';
          // Save to Draws, notify
          await r.save();
        }
      }
    });
    res.status(201).json(raffle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Buy Tickets (Stub - integrate Stripe)
app.post('/raffles/:id/buy', async (req, res) => {
  const { id } = req.params;
  const { quantity, buyerId } = req.body;
  const raffle = await Raffle.findById(id);
  if (raffle.status !== 'active') return res.status(400).json({ error: 'Raffle not active' });
  
  const amount = quantity * raffle.ticketPrice * 100; // Cents
  const paymentIntent = await Stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: { raffleId: id, buyerId }
  });
  
  // On success webhook: Update soldTickets += quantity, generate ticket numbers
  raffle.soldTickets += quantity;
  await raffle.save();
  
  res.json({ clientSecret: paymentIntent.client_secret });
});

mongoose.connect('mongodb://localhost/raffleDB');
app.listen(3000, () => console.log('Backend running on port 3000'));