const Raffle = require('../models/Raffle');
const Ticket = require('../models/Ticket'); // Assume you add this model
const stripe = require('../config/stripe');

// In routes/raffles.js: app.post('/raffles/:id/buy', auth, buyTickets);

const buyTickets = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const buyerId = req.user.userId; // From auth middleware

  const raffle = await Raffle.findById(id);
  if (raffle.status !== 'active') return res.status(400).json({ error: 'Raffle not active' });
  if (raffle.soldTickets + quantity > raffle.totalTickets) return res.status(400).json({ error: 'Not enough tickets left' });

  const amount = quantity * raffle.ticketPrice * 100;
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: { raffleId: id, buyerId: buyerId.toString(), quantity }
  });

  // On frontend confirm (via webhook or poll), create tickets
  // Stub: Generate unique ticket numbers (1 to totalTickets, shuffle)
  const allTickets = Array.from({ length: raffle.totalTickets }, (_, i) => i + 1);
  const availableTickets = allTickets.slice(0, raffle.soldTickets + quantity); // Simplified
  const myTickets = availableTickets.splice(-quantity); // Last N for buyer

  const ticket = new Ticket({ raffleId: id, buyerId, quantity, ticketNumbers: myTickets });
  await ticket.save();

  raffle.soldTickets += quantity;
  await raffle.save();

  // Emit real-time via sockets
  // req.io.emit('raffleUpdate', { raffleId: id, sold: raffle.soldTickets });

  res.json({ clientSecret: paymentIntent.client_secret, tickets: myTickets });
};

// Refund function (call on failure)
const refundBuyers = async (raffleId) => {
  const tickets = await Ticket.find({ raffleId });
  for (const ticket of tickets) {
    const refund = await stripe.refunds.create({
      payment_intent: ticket.paymentIntentId // Store this on success
    });
    // Email notification
    await sendRefundEmail(ticket.buyerId, refund);
  }
};