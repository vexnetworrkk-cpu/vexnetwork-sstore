const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const Order = require('../models/Order');

// GET all orders
router.get('/', authAdmin(['owner', 'dev', 'staff']), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('cartItems')
      .populate('packageId')
      .sort({ createdAt: -1 })
      .limit(100);
      
    res.json(orders);
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
});

// PUT update delivery status
router.put('/:id/delivery', authAdmin(['owner', 'dev', 'staff']), async (req, res) => {
  try {
    const { status } = req.body; // 'delivered', 'pending', 'failed'
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { deliveryStatus: status }, 
      { returnDocument: 'after' }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating delivery status' });
  }
});

// PUT refund order
router.put('/:id/refund', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.status === 'refunded') {
      return res.status(400).json({ error: 'Order is already refunded' });
    }

    // Mocking refund logic
    order.status = 'refunded';
    order.deliveryStatus = 'failed'; // Usually a refunded order doesn't get delivered
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error refunding order' });
  }
});

// POST resend delivery
router.post('/:id/resend', authAdmin(['owner', 'dev', 'staff']), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Mocking resend logic to Minecraft server
    if (order.status !== 'paid') {
      return res.status(400).json({ error: 'Only paid orders can be resent' });
    }

    // In a real app, this would make an RCON or API request to the Minecraft server here
    
    // Assume success
    order.deliveryStatus = 'delivered';
    await order.save();

    res.json({ message: 'Commands successfully sent to server!', order });
  } catch (error) {
    res.status(500).json({ error: 'Server error resending delivery' });
  }
});

module.exports = router;
