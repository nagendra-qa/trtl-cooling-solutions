const express = require('express');
const router = express.Router();
const Camp = require('../models/Camp');

// Get all camps
router.get('/', async (req, res) => {
  try {
    const { customerId } = req.query;
    const query = customerId ? { customer: customerId } : {};
    const camps = await Camp.find(query).populate('customer').sort({ createdAt: -1 });
    res.json(camps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single camp
router.get('/:id', async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id).populate('customer');
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }
    res.json(camp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create camp
router.post('/', async (req, res) => {
  const camp = new Camp(req.body);
  try {
    const newCamp = await camp.save();
    const populatedCamp = await Camp.findById(newCamp._id).populate('customer');
    res.status(201).json(populatedCamp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update camp
router.put('/:id', async (req, res) => {
  try {
    const camp = await Camp.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('customer');
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }
    res.json(camp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete camp
router.delete('/:id', async (req, res) => {
  try {
    const camp = await Camp.findByIdAndDelete(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }
    res.json({ message: 'Camp deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
