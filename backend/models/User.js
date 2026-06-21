const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  }],
  email: {
    type: String,
    trim: true,
    default: ''
  },
  totalSpend: {
    type: Number,
    default: 0
  },
  activeRanks: [{
    type: String
  }],
  notes: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('User', userSchema);
