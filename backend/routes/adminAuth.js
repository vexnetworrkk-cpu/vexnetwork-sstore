const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const authAdmin = require('../middleware/authAdmin');
const router = express.Router();

// Admin Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: admin._id, email: admin.email, role: admin.role } });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// Get current admin user profile
router.get('/me', authAdmin(), async (req, res) => {
  try {
    const admin = await AdminUser.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ error: 'Admin user not found.' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Admin Me Error:', error);
    res.status(500).json({ error: 'Server error fetching profile.' });
  }
});

module.exports = router;
