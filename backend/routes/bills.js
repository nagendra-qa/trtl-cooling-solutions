const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Bill = require('../models/Bill');
const { numberToWords } = require('../utils/helpers');
const { generateInvoiceNumber } = require('../utils/invoiceNumber');

// Get all bills
router.get('/', async (req, res) => {
  try {
    const { customerId, status } = req.query;
    const query = {};
    if (customerId) query.customer = customerId;
    if (status) query.status = status;

    const bills = await Bill.find(query)
      .populate('customer')
      .populate('camp')
      .populate('workOrder')
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get next invoice number
router.get('/next-invoice-number', async (req, res) => {
  try {
    const nextInvoiceNumber = await generateInvoiceNumber();
    res.json({ invoiceNumber: nextInvoiceNumber });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single bill
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('customer')
      .populate('camp')
      .populate('workOrder');
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create bill
router.post('/', async (req, res) => {
  try {
    const billData = req.body;

    // Auto-calculate amount in words if not provided
    if (!billData.amountInWords && billData.grandTotal) {
      billData.amountInWords = numberToWords(billData.grandTotal);
    }

    const bill = new Bill(billData);
    const newBill = await bill.save();
    const populatedBill = await Bill.findById(newBill._id)
      .populate('customer')
      .populate('camp')
      .populate('workOrder');
    res.status(201).json(populatedBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update bill
router.put('/:id', async (req, res) => {
  try {
    const billData = req.body;

    // Auto-calculate amount in words if not provided
    if (!billData.amountInWords && billData.grandTotal) {
      billData.amountInWords = numberToWords(billData.grandTotal);
    }

    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      billData,
      { new: true, runValidators: true }
    ).populate('customer').populate('camp').populate('workOrder');

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete bill
router.delete('/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate PDF bill
router.get('/:id/pdf', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('customer')
      .populate('camp')
      .populate('workOrder');

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${bill.billNumber}.pdf`);

    doc.pipe(res);

    // Company Header
    doc.fontSize(14).font('Helvetica-Bold').text(process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO', 40, 40);
    doc.fontSize(9).font('Helvetica');
    doc.text(`Pan: ${process.env.COMPANY_PAN || 'DJYPM4672Q'}  Mob: ${process.env.COMPANY_PHONE || '+91-8179697191'}`, 40, doc.y + 5);
    doc.text(process.env.COMPANY_BILL_ADDRESS || 'D.No.2-12, Kollapalem, Kaja, Krishna DT, Andhra Pradesh - 521150', 40, doc.y + 3);

    doc.moveDown(0.5);
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    // Invoice Number and Date
    const invoiceY = doc.y;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text(`Invoice No: ${bill.billNumber}`, 40, invoiceY);
    doc.text(`Date: ${new Date(bill.billDate).toLocaleDateString('en-GB')}`, 400, invoiceY);

    doc.moveDown(1);

    // Bill To Address
    doc.fontSize(10).font('Helvetica-Bold').text('Bill To Address:', 40, doc.y);
    doc.font('Helvetica').fontSize(9);
    const billToY = doc.y;
    doc.text(bill.customer.name, 40, billToY, { width: 250 });
    doc.text(bill.customer.address, 40, doc.y + 2, { width: 250 });
    if (bill.customer.gstNumber) {
      doc.text(`GSTIN / PAN: ${bill.customer.gstNumber}`, 40, doc.y + 2);
    }

    doc.moveDown(1);

    // Work Order Details
    if (bill.customerWONumber) {
      const woY = doc.y;
      doc.fontSize(9).font('Helvetica');
      doc.text(`Customer WO No: ${bill.customerWONumber}`, 40, woY);
      if (bill.customerWODate) {
        doc.text(`Dated: ${new Date(bill.customerWODate).toLocaleDateString('en-GB')}`, 400, woY);
      }
      doc.moveDown(0.5);
    }

    // Project Details
    if (bill.projectName) {
      doc.text(`Project: ${bill.projectName}`, 40, doc.y);
      doc.moveDown(0.3);
    }
    if (bill.referenceNo) {
      doc.text(`Reference: ${bill.referenceNo}`, 40, doc.y);
      doc.moveDown(0.5);
    }

    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    // Table Header
    const tableTop = doc.y;
    doc.fontSize(9).font('Helvetica-Bold');
    doc.text('SL No', 40, tableTop);
    doc.text('Description', 80, tableTop);
    doc.text('SAC Code', 260, tableTop);
    doc.text('Unit', 320, tableTop);
    doc.text('Qty', 360, tableTop);
    doc.text('Rate', 410, tableTop, { width: 70, align: 'right' });
    doc.text('Amount', 485, tableTop, { width: 70, align: 'right' });

    doc.moveTo(40, doc.y + 5).lineTo(555, doc.y + 5).stroke();

    // Table Items
    let yPosition = doc.y + 10;
    doc.font('Helvetica').fontSize(9);

    bill.items.forEach((item, index) => {
      const itemStartY = yPosition;

      // Check if we need a new page
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 40;
      }

      doc.text((index + 1).toString(), 40, yPosition);

      // Description (wrapped text)
      const descLines = doc.heightOfString(item.description, { width: 170 });
      doc.text(item.description, 80, yPosition, { width: 170 });

      doc.text(item.sacCode || '', 260, yPosition);
      doc.text(item.unit || 'EA', 320, yPosition);
      doc.text(item.quantity ? item.quantity.toFixed(2) : '0.00', 360, yPosition);
      doc.text(item.rate ? item.rate.toFixed(2) : '0.00', 410, yPosition, { width: 70, align: 'right' });
      doc.text(item.amount ? item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00', 485, yPosition, { width: 70, align: 'right' });

      yPosition = Math.max(itemStartY + descLines, yPosition) + 20;
    });

    // Totals Section
    doc.moveTo(40, yPosition).lineTo(555, yPosition).stroke();
    yPosition += 10;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Total Amount', 410, yPosition, { align: 'right' });
    doc.text(bill.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 485, yPosition, { width: 70, align: 'right' });
    yPosition += 15;

    if (bill.roundUp && bill.roundUp !== 0) {
      doc.font('Helvetica').fontSize(9);
      doc.text('Round Up', 410, yPosition, { align: 'right' });
      doc.text(bill.roundUp.toFixed(2), 485, yPosition, { width: 70, align: 'right' });
      yPosition += 15;
    }

    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('Grand Total', 410, yPosition, { align: 'right' });
    doc.text(bill.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 485, yPosition, { width: 70, align: 'right' });

    yPosition += 20;

    // Amount in Words
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Rupees in Words:', 40, yPosition);
    doc.font('Helvetica').fontSize(9);
    doc.text(bill.amountInWords || '', 40, yPosition + 15, { width: 350 });

    yPosition += 45;
    doc.moveTo(40, yPosition).lineTo(555, yPosition).stroke();
    yPosition += 10;

    // Payment Terms
    doc.fontSize(10).font('Helvetica-Bold').text('Payment Terms', 40, yPosition);
    doc.font('Helvetica').fontSize(9);
    doc.text(bill.paymentTerms || process.env.PAYMENT_TERMS || '30 Days credit', 40, yPosition + 15);

    // Bank Details
    yPosition += 40;
    doc.fontSize(10).font('Helvetica-Bold').text('Our Bank Details', 40, yPosition);
    doc.font('Helvetica').fontSize(9);
    doc.text(`Account Name: ${process.env.BANK_ACCOUNT_NAME || 'M Picheswara Rao'}`, 40, yPosition + 15);
    doc.text(`Account No: ${process.env.BANK_ACCOUNT_NO || '782701505244'}`, 40, yPosition + 28);
    doc.text(`IFSC Code: ${process.env.BANK_IFSC || 'ICIC0007827'}`, 40, yPosition + 41);
    doc.text(`Branch: ${process.env.BANK_BRANCH || 'Salarpuria Sattva'}`, 40, yPosition + 54);

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
