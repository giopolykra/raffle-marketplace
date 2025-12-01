const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// GET /api/users/profile - Get current user
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/profile - Update profile (e.g., email)
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { ...updates },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/users/my-raffles - List user's created/entered raffles
router.get('/my-raffles', auth, async (req, res) => {
  try {
    const { userId } = req.user;
    const created = await Raffle.find({ sellerId: userId }).populate('Draw'); // Import Raffle if needed
    const entered = await Ticket.find({ buyerId: userId }).populate('raffleId');
    res.json({ created, entered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;