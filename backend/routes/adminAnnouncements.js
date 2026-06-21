const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const Announcement = require('../models/Announcement');

// GET settings
router.get('/', authAdmin(['owner', 'dev', 'staff']), async (req, res) => {
  try {
    let settings = await Announcement.findOne();
    if (!settings) {
      settings = await Announcement.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// PUT update settings
router.put('/', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    let settings = await Announcement.findOne();
    if (!settings) {
      settings = new Announcement(req.body);
      await settings.save();
    } else {
      settings = await Announcement.findByIdAndUpdate(settings._id, req.body, { returnDocument: 'after' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update announcements' });
  }
});

// POST test discord webhook
router.post('/discord-test', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const { webhookUrl } = req.body;
    if (!webhookUrl) return res.status(400).json({ error: 'No webhook URL provided' });

    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: '🎉 **VexNetwork Store Test**\nYour Discord Webhook is successfully connected to the Admin Panel!'
      })
    });

    if (!response.ok) {
      return res.status(400).json({ error: 'Discord rejected the webhook' });
    }

    res.json({ message: 'Test message sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send test message' });
  }
});

module.exports = router;
