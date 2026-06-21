const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  features: [{
    type: String
  }],
  color: {
    type: String,
    default: '#9333EA'
  },
  category: {
    type: String,
    required: true,
    default: 'survival-rank'
  },
  infoDetails: {
    perks: { type: [String], default: [] },
    commands: { type: [String], default: [] },
    others: { type: [String], default: [] },
    note: { type: String, default: '' },
    kitPreviewImg: { type: String, default: '' }
  },
  active: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Package', packageSchema);
