const express = require('express');
const router = express.Router();
const User = require('../models/User');

// "Login" by checking/creating Minecraft username
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Minecraft username is required' });
    }

    let user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
    
    if (!user) {
      user = new User({ username });
      await user.save();
    }

    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
