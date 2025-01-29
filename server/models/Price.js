const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true,
    default: 0
  },
  trend: {
    type: String,
    enum: ['up', 'down'],
    default: 'up'
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Price', priceSchema);
