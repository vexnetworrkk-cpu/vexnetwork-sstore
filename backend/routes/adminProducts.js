const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const Package = require('../models/Package');

// GET all products
router.get('/', authAdmin(['owner', 'dev', 'staff']), async (req, res) => {
  try {
    const products = await Package.find().sort({ category: 1, price: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST create product
router.post('/', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const newPackage = new Package(req.body);
    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product
router.put('/:id', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
router.delete('/:id', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// POST duplicate product
router.post('/:id/duplicate', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const original = await Package.findById(req.params.id).lean();
    if (!original) return res.status(404).json({ error: 'Product not found' });

    delete original._id;
    delete original.__v;
    original.name = `[Copy] ${original.name}`;
    original.active = false; // By default duplicated copies should be inactive to prevent accidents

    const clone = new Package(original);
    await clone.save();
    res.status(201).json(clone);
  } catch (error) {
    res.status(500).json({ error: 'Failed to duplicate product' });
  }
});

// PUT toggle featured product
router.put('/:id/featured', authAdmin(['owner', 'dev']), async (req, res) => {
  try {
    const product = await Package.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (!product.isFeatured) {
      const featuredCount = await Package.countDocuments({ isFeatured: true });
      if (featuredCount >= 6) {
        return res.status(400).json({ error: 'Maximum 6 packages can be featured' });
      }
    }

    product.isFeatured = !product.isFeatured;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle featured status' });
  }
});

module.exports = router;
