const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  workOrderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  camp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camp'
  },
  serviceDate: {
    type: Date
  },
  projectName: {
    type: String
  },
  referenceNo: {
    type: String
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
    sacCode: String,
    unit: String,
    quantity: Number,
    rate: Number,
    amount: Number
  }],
  totalAmount: {
    type: Number
  },
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
