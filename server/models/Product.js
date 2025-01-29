const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  previousPrice: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update previous price before saving new price
productSchema.pre('save', function(next) {
  if (this.isModified('price')) {
    this.previousPrice = this.price;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
