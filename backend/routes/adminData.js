const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const Order = require('../models/Order');
const User = require('../models/User');

router.get('/dashboard', authAdmin(['owner', 'dev', 'staff']), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // 1. Basic Stats
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'created' });
    const totalCustomers = await User.countDocuments();
    const conversionRate = totalCustomers > 0 ? ((totalOrders / totalCustomers) * 100).toFixed(1) : 0;

    // Revenue Today
    const revTodayAgg = await Order.aggregate([
      { $match: { status: 'paid', createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const revenueToday = revTodayAgg.length > 0 ? revTodayAgg[0].total : 0;

    // Revenue This Month
    const revMonthAgg = await Order.aggregate([
      { $match: { status: 'paid', createdAt: { $gte: firstDayOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const revenueThisMonth = revMonthAgg.length > 0 ? revMonthAgg[0].total : 0;

    // 2. Revenue Graph (Last 7 Days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    
    const dailyRevAgg = await Order.aggregate([
      { $match: { status: 'paid', createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format for Recharts
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueData = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      const match = dailyRevAgg.find(r => r._id === dateString);
      revenueData.push({
        name: dayNames[d.getDay()],
        revenue: match ? match.revenue : 0
      });
    }

    // 3. Sales Volume (Weekly over 4 weeks - simplified mock structure from real data)
    // We will aggregate by week for the last 4 weeks.
    const fourWeeksAgo = new Date(today);
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    
    const weeklySalesAgg = await Order.aggregate([
      { $match: { status: 'paid', createdAt: { $gte: fourWeeksAgo } } },
      {
        $group: {
          _id: { $week: "$createdAt" },
          sales: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Map to Week 1, Week 2, etc. (Simpler approach since it's hard to dynamically label weeks cleanly without a lot of date math)
    const salesData = weeklySalesAgg.map((w, idx) => ({
      name: `Week ${idx + 1}`,
      sales: w.sales
    }));
    // If no data, fill dummy
    if (salesData.length === 0) {
      for(let i=1; i<=4; i++) salesData.push({ name: `Week ${i}`, sales: 0 });
    }

    // 4. Top Selling Products (Pie Chart)
    const topSellingAgg = await Order.aggregate([
      { $match: { status: 'paid' } },
      { $unwind: "$cartItems" },
      {
        $lookup: {
          from: "packages",
          localField: "cartItems",
          foreignField: "_id",
          as: "packageInfo"
        }
      },
      { $unwind: "$packageInfo" },
      {
        $group: {
          _id: "$packageInfo.name",
          value: { $sum: 1 }
        }
      },
      { $sort: { value: -1 } },
      { $limit: 4 } // Top 4 for pie chart
    ]);

    const pieData = topSellingAgg.map(item => ({
      name: item._id,
      value: item.value
    }));

    // 5. Recent Activity Feed
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('cartItems');

    const activityFeed = recentOrders.map(order => {
      let actionText = 'Unknown Action';
      if (order.cartItems && order.cartItems.length > 0) {
        actionText = `Ordered ${order.cartItems[0].name}${order.cartItems.length > 1 ? ` +${order.cartItems.length - 1} more` : ''}`;
      } else if (order.packageId) {
        actionText = `Ordered a Package`;
      }
      
      return {
        id: order._id,
        action: actionText,
        user: order.username,
        time: new Date(order.createdAt).toLocaleString(),
        status: order.status === 'paid' ? 'completed' : order.status === 'failed' ? 'failed' : 'pending'
      };
    });

    res.json({
      stats: {
        revenueToday,
        revenueThisMonth,
        totalOrders,
        pendingOrders,
        totalCustomers,
        conversionRate
      },
      charts: {
        revenueData,
        salesData,
        pieData
      },
      activityFeed
    });

  } catch (error) {
    console.error('Dashboard Data Error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
});

module.exports = router;
