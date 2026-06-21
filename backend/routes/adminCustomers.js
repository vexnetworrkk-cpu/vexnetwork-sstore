const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const User = require('../models/User');
const Order = require('../models/Order');

// GET all customers with their order stats
router.get('/', authAdmin(['owner', 'dev', 'staff']), async (req, res) => {
  try {
    const users = await User.find().sort({ totalSpend: -1 }).lean();
    
    // For each user, attach their total order count and sync total spend
    const customers = await Promise.all(users.map(async (user) => {
      const orders = await Order.find({ 
        username: new RegExp(`^${user.username}$`, 'i'), 
        status: 'paid' 
      });
      
      const orderCount = orders.length;
      const calculatedSpend = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

      return {
        ...user,
        orderCount,
        totalSpend: calculatedSpend
      };
    }));

    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET single customer profile (with purchase history)
router.get('/:username', authAdmin(['owner', 'dev', 'staff']), async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).lean();
    if (!user) return res.status(404).json({ error: 'Customer not found' });

    const orders = await Order.find({ username: new RegExp(`^${req.params.username}$`, 'i') }).sort({ createdAt: -1 }).populate('packageId cartItems');
    
    user.totalSpend = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + (o.amount || 0), 0);

    res.json({
      profile: user,
      history: orders
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer profile' });
  }
});

// PUT update customer notes
router.put('/:id/notes', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id, 
      { notes: req.body.notes }, 
      { returnDocument: 'after' }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notes' });
  }
});

module.exports = router;
