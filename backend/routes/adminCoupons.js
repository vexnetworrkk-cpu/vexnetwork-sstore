const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const Coupon = require('../models/Coupon');

// GET all coupons
router.get('/', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

// POST create coupon
router.post('/', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

// DELETE coupon
router.delete('/:id', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Coupon not found' });
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

// PUT toggle status
router.put('/:id', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const { active } = req.body;
    const updated = await Coupon.findByIdAndUpdate(req.params.id, { active }, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ error: 'Coupon not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle status' });
  }
});

module.exports = router;
