const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  workOrderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  camp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camp',
    required: true
  },
  serviceDate: {
    type: Date,
    required: true
  },
  pdfFile: {
    filename: String,
    path: String,
    originalName: String
  },
  extractedData: {
    type: mongoose.Schema.Types.Mixed
  },
  services: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    amount: Number
  }],
  technicianName: String,
  workDescription: String,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'billed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WorkOrder', workOrderSchema);
