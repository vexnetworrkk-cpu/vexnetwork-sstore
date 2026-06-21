const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const Order = require('../models/Order');

// GET payments with optional timeframe filter
router.get('/', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const { timeframe } = req.query; // 'today', 'week', 'month', or 'all'
    
    let dateFilter = {};
    const now = new Date();
    
    if (timeframe === 'today') {
      const startOfDay = new Date(now.setHours(0,0,0,0));
      dateFilter = { createdAt: { $gte: startOfDay } };
    } else if (timeframe === 'week') {
      const startOfWeek = new Date(now.setDate(now.getDate() - 7));
      dateFilter = { createdAt: { $gte: startOfWeek } };
    } else if (timeframe === 'month') {
      const startOfMonth = new Date(now.setDate(now.getDate() - 30));
      dateFilter = { createdAt: { $gte: startOfMonth } };
    }

    // Exclude 'created' status since those aren't real payments yet
    const query = {
      ...dateFilter,
      status: { $ne: 'created' }
    };

    const payments = await Order.find(query)
      .sort({ createdAt: -1 })
      .select('orderId paymentId username amount status createdAt');

    // Aggregate stats
    const stats = {
      successful: payments.filter(p => p.status === 'paid').length,
      failed: payments.filter(p => p.status === 'failed' || p.status === 'refunded').length,
      totalAmount: payments.filter(p => p.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0)
    };

    res.json({
      stats,
      payments
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

module.exports = router;
