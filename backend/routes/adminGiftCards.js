const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const authAdmin = require('../middleware/authAdmin');
const GiftCard = require('../models/GiftCard');

// GET all gift cards
router.get('/', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const cards = await GiftCard.find().sort({ createdAt: -1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gift cards' });
  }
});

// POST generate new gift card
router.post('/generate', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount. Must be greater than 0.' });
    }

    // Generate random 12-char code
    const code = crypto.randomBytes(6).toString('hex').toUpperCase();

    const newCard = new GiftCard({
      code,
      amount: Number(amount)
    });

    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate gift card' });
  }
});

// DELETE gift card
router.delete('/:id', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const deleted = await GiftCard.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Gift card not found' });
    res.json({ message: 'Gift card deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gift card' });
  }
});

module.exports = router;
