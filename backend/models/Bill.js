const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  workOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkOrder'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  camp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camp'
  },
  billDate: {
    type: Date,
    default: Date.now
  },
  customerWONumber: {
    type: String
  },
  customerWODate: {
    type: Date
  },
  projectName: {
    type: String
  },
  referenceNo: {
    type: String
  },
  items: [{
    description: String,
    sacCode: String,
    unit: String,
    quantity: Number,
    rate: Number,
    amount: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  roundUp: {
    type: Number,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: true
  },
  amountInWords: {
    type: String
  },
  paymentTerms: {
    type: String,
    default: '30 Days credit'
  },
  notes: String,
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'cancelled'],
    default: 'draft'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bill', billSchema);
