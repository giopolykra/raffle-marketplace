const stripe = require('../config/stripe');
const Raffle = require('../models/Raffle');
// Assume Ticket model exists; add later

exports.createPaymentIntent = async (req, res) => {
  try {
    const { id } = req.params; // Raffle ID
    const { quantity } = req.body;
    const buyerId = req.user.userId;

    const raffle = await Raffle.findById(id);
    if (raffle.status !== 'active') {
      return res.status(400).json({ error: 'Raffle not active' });
    }
    if (raffle.soldTickets + quantity > raffle.totalTickets) {
      return res.status(400).json({ error: 'Not enough tickets left' });
    }

    const amount = quantity * raffle.ticketPrice * 100; // Cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { raffleId: id, buyerId: buyerId.toString(), quantity }
    });

    // On success (via webhook): Update soldTickets, create tickets
    // For now, just return client secret
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.refundBuyers = async (raffleId) => {
  // Called on raffle failure—implement webhook or cron trigger
  try {
    // Fetch tickets, refund each via Stripe
    console.log(`Refunding buyers for raffle ${raffleId}`);
    // Stub: await stripe.refunds.create({ payment_intent: 'pi_...' });
  } catch (err) {
    console.error('Refund error:', err);
  }
};