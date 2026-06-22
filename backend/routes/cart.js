const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Package = require('../models/Package');

// Get User Cart
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') }).populate('cart');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.cart);
  } catch (error) {
    console.error('Fetch cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add to Cart
router.post('/:username/add', async (req, res) => {
  try {
    const { username } = req.params;
    const { packageId, quantity = 1 } = req.body;

    if (!packageId) return res.status(400).json({ error: 'Package ID is required' });

    let user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
    if (!user) {
      user = new User({ username });
    }

    const numToAdd = Math.max(1, Math.min(10, parseInt(quantity) || 1));
    for (let i = 0; i < numToAdd; i++) {
      user.cart.push(packageId);
    }
    await user.save();

    res.json({ message: 'Added to cart', cart: user.cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove from Cart
router.post('/:username/remove', async (req, res) => {
  try {
    const { username } = req.params;
    const { packageId, index } = req.body;

    const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove by index if provided, otherwise remove first instance
    if (index !== undefined && index >= 0 && index < user.cart.length) {
      user.cart.splice(index, 1);
    } else {
      const idx = user.cart.findIndex(id => id.toString() === packageId);
      if (idx > -1) {
        user.cart.splice(idx, 1);
      }
    }

    await user.save();
    res.json({ message: 'Removed from cart', cart: user.cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
