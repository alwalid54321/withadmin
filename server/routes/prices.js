const express = require('express');
const router = express.Router();

// Get all prices
router.get('/prices', async (req, res) => {
  try {
    const prices = await Price.find().sort({ createdAt: -1 });
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update price
router.put('/prices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    
    const oldPrice = await Price.findById(id);
    const trend = oldPrice.value < value ? 'up' : 'down';
    
    const price = await Price.findByIdAndUpdate(
      id,
      { 
        value,
        trend,
        lastUpdate: new Date()
      },
      { new: true }
    );
    
    res.json(price);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
