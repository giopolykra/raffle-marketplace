const express = require('express');
const Raffle = require('../models/Raffle');
const auth = require('../middleware/auth'); // Create if missing
const router = express.Router();

// GET /api/raffles (list active)
router.get('/', async (req, res) => {
  const raffles = await Raffle.find({ status: 'active' });
  res.json(raffles);
});

// POST /api/raffles (create - protected)
router.post('/', auth, async (req, res) => {
  try {
    const raffle = new Raffle({ ...req.body, sellerId: req.user.userId });
    await raffle.save();
    res.status(201).json(raffle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;