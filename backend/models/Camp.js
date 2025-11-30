const mongoose = require('mongoose');

const campSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  campName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contactPerson: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String
  },
  numberOfUnits: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Camp', campSchema);
