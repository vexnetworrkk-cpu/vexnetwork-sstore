const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// Get all active packages
router.get('/', async (req, res) => {
  try {
    // If no packages exist, let's create some dummy ones for demonstration
    let packages = await Package.find({ active: true });
    
    if (packages.length === 0) {
      const defaultPackages = [
        {
          name: 'VIP Rank',
          description: 'Get started with basic perks and a cool prefix.',
          price: 500, // in INR
          features: ['Custom Prefix', 'Priority Queue', '1x Monthly Kit'],
          color: '#8b5cf6' // Purple
        },
        {
          name: 'MVP Rank',
          description: 'The most popular rank with awesome benefits.',
          price: 1500,
          features: ['MVP Prefix', 'Fly in Lobby', '3x Monthly Kits', 'Custom Nickname'],
          color: '#d946ef' // Fuchsia
        },
        {
          name: 'Overlord Rank',
          description: 'Ultimate power and all permissions.',
          price: 3000,
          features: ['Overlord Prefix', 'All Gadgets', 'Unlimited Kits', 'Private Support'],
          color: '#3b82f6' // Blue
        }
      ];
      await Package.insertMany(defaultPackages);
      packages = await Package.find({ active: true });
    }

    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Server error fetching packages' });
  }
});

// Get featured packages
router.get('/featured', async (req, res) => {
  try {
    const packages = await Package.find({ isFeatured: true, active: true }).limit(6);
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching featured packages' });
  }
});

// Get a single package
router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
// Get packages by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const packages = await Package.find({ category: categoryId, active: true });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
