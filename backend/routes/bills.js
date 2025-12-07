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
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${bill.billNumber}.pdf`);

    doc.pipe(res);

    const pageWidth = 595.28; // A4 width in points
    const margin = 50;
    const contentWidth = pageWidth - (margin * 2);

    // Header Box with Company Details
    doc.rect(margin, margin, contentWidth, 70).stroke();

    // Company Name
    doc.fontSize(16).font('Helvetica-Bold')
       .text(process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO', margin + 15, margin + 15);

    // Company Details
    doc.fontSize(9).font('Helvetica');
    doc.text(`PAN: ${process.env.COMPANY_PAN || 'DJYPM4672Q'}`, margin + 15, doc.y + 5);
    doc.text(`Mobile: ${process.env.COMPANY_PHONE || '+91-8179697191'}`, margin + 15, doc.y + 3);
    doc.text(process.env.COMPANY_BILL_ADDRESS || 'D.No.2-12, Kollapalem, Kaja, Krishna DT, Andhra Pradesh - 521150',
             margin + 15, doc.y + 3, { width: contentWidth - 30 });

    // Tax Invoice Title (Centered)
    doc.fontSize(18).font('Helvetica-Bold')
       .text('TAX INVOICE', margin, margin + 90, { width: contentWidth, align: 'center' });

    // Invoice Details Box
    let currentY = margin + 120;
    doc.rect(margin, currentY, contentWidth, 50).stroke();

    // Left side - Invoice number and date
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Invoice No:', margin + 15, currentY + 10);
    doc.font('Helvetica').text(bill.billNumber, margin + 90, currentY + 10);

    doc.font('Helvetica-Bold').text('Invoice Date:', margin + 15, currentY + 25);
    doc.font('Helvetica').text(new Date(bill.billDate).toLocaleDateString('en-GB'), margin + 90, currentY + 25);

    // Right side - WO details
    if (bill.customerWONumber) {
      doc.font('Helvetica-Bold').text('WorkOrder NO:', margin + 280, currentY + 10);
      doc.font('Helvetica').text(bill.customerWONumber, margin + 370, currentY + 10);
    }

    if (bill.customerWODate) {
      doc.font('Helvetica-Bold').text('WO Date:', margin + 280, currentY + 25);
      doc.font('Helvetica').text(new Date(bill.customerWODate).toLocaleDateString('en-GB'), margin + 370, currentY + 25);
    }

    // Bill To Section
    currentY += 65;
    doc.fontSize(11).font('Helvetica-Bold')
       .text('BILL TO:', margin, currentY);

    currentY += 5;
    doc.rect(margin, currentY, contentWidth, 70).stroke();

    // Default billing address
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('VK Building Services Pvt Ltd', margin + 10, currentY + 10);
    doc.font('Helvetica').fontSize(9);
    doc.text('1st Floor Krishe Sapphire, Sri Krishna Developers,', margin + 10, doc.y + 3);
    doc.text('Sy No 88 Opp Vishal Peripherals, Madhapur', margin + 10, doc.y + 3);
    doc.text('Telangana, Hyderabad 500081', margin + 10, doc.y + 3);
    doc.font('Helvetica-Bold').text('GSTIN / PAN: ', margin + 10, doc.y + 3, { continued: true });
    doc.font('Helvetica').text('36AADCV1173D1ZL');

    // Project Details (if available)
    currentY += 85;
    if (bill.projectName || bill.referenceNo) {
      doc.fontSize(9).font('Helvetica');
      if (bill.projectName) {
        doc.font('Helvetica-Bold').text('Project: ', margin, currentY);
        doc.font('Helvetica').text(bill.projectName, margin + 50, currentY);
        currentY += 15;
      }
      if (bill.referenceNo) {
        doc.font('Helvetica-Bold').text('Reference: ', margin, currentY);
        doc.font('Helvetica').text(bill.referenceNo, margin + 50, currentY);
        currentY += 20;
      }
    } else {
      currentY += 10;
    }

    // Items Table
    const tableTop = currentY;

    // Table Header Background
    doc.rect(margin, tableTop, contentWidth, 20).fillAndStroke('#e8e8e8', '#000000');

    // Table Headers
    doc.fillColor('#000000').fontSize(9).font('Helvetica-Bold');
    doc.text('Sl.', margin + 5, tableTop + 6, { width: 25 });
    doc.text('Description of Services', margin + 35, tableTop + 6, { width: 180 });
    doc.text('SAC', margin + 220, tableTop + 6, { width: 50, align: 'center' });
    doc.text('Unit', margin + 275, tableTop + 6, { width: 35, align: 'center' });
    doc.text('Qty', margin + 315, tableTop + 6, { width: 40, align: 'right' });
    doc.text('Rate (₹)', margin + 360, tableTop + 6, { width: 70, align: 'right' });
    doc.text('Amount (₹)', margin + 435, tableTop + 6, { width: 60, align: 'right' });

    // Table Items
    let itemY = tableTop + 25;
    doc.font('Helvetica').fontSize(9);

    bill.items.forEach((item, index) => {
      // Check if we need a new page
      if (itemY > 700) {
        doc.addPage();
        itemY = 50;
      }

      const rowHeight = Math.max(20, doc.heightOfString(item.description, { width: 175 }) + 10);

      // Draw row border
      doc.rect(margin, itemY, contentWidth, rowHeight).stroke();

      // Vertical lines
      doc.moveTo(margin + 30, itemY).lineTo(margin + 30, itemY + rowHeight).stroke();
      doc.moveTo(margin + 215, itemY).lineTo(margin + 215, itemY + rowHeight).stroke();
      doc.moveTo(margin + 270, itemY).lineTo(margin + 270, itemY + rowHeight).stroke();
      doc.moveTo(margin + 310, itemY).lineTo(margin + 310, itemY + rowHeight).stroke();
      doc.moveTo(margin + 355, itemY).lineTo(margin + 355, itemY + rowHeight).stroke();
      doc.moveTo(margin + 430, itemY).lineTo(margin + 430, itemY + rowHeight).stroke();

      // Item data
      doc.text((index + 1).toString(), margin + 10, itemY + 5, { width: 20, align: 'center' });
      doc.text(item.description, margin + 35, itemY + 5, { width: 175 });
      doc.text(item.sacCode || '', margin + 220, itemY + 5, { width: 50, align: 'center' });
      doc.text(item.unit || 'EA', margin + 275, itemY + 5, { width: 35, align: 'center' });
      doc.text(item.quantity ? item.quantity.toFixed(2) : '0.00', margin + 315, itemY + 5, { width: 40, align: 'right' });
      doc.text(item.rate ? item.rate.toFixed(2) : '0.00', margin + 360, itemY + 5, { width: 70, align: 'right' });
      doc.text(item.amount ? item.amount.toFixed(2) : '0.00', margin + 435, itemY + 5, { width: 60, align: 'right' });

      itemY += rowHeight;
    });

    // Totals Section
    const totalsY = itemY;

    // Total Amount Row
    doc.rect(margin, totalsY, contentWidth, 20).stroke();
    doc.moveTo(margin + 355, totalsY).lineTo(margin + 355, totalsY + 20).stroke();
    doc.moveTo(margin + 430, totalsY).lineTo(margin + 430, totalsY + 20).stroke();

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Total Amount', margin + 220, totalsY + 6, { width: 130, align: 'right' });
    doc.text('₹ ' + bill.totalAmount.toFixed(2), margin + 435, totalsY + 6, { width: 60, align: 'right' });

    // Grand Total Row
    let grandTotalY = totalsY + 20;
    doc.rect(margin, grandTotalY, contentWidth, 25).fillAndStroke('#f0f0f0', '#000000');
    doc.moveTo(margin + 355, grandTotalY).lineTo(margin + 355, grandTotalY + 25).stroke();
    doc.moveTo(margin + 430, grandTotalY).lineTo(margin + 430, grandTotalY + 25).stroke();

    doc.fillColor('#000000').fontSize(11).font('Helvetica-Bold');
    doc.text('GRAND TOTAL', margin + 220, grandTotalY + 8, { width: 130, align: 'right' });
    doc.text('₹ ' + bill.grandTotal.toFixed(2), margin + 435, grandTotalY + 8, { width: 60, align: 'right' });

    // Amount in Words
    grandTotalY += 35;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Amount in Words:', margin, grandTotalY);
    doc.font('Helvetica-Oblique').fontSize(10);
    doc.text(bill.amountInWords || 'Amount not specified', margin, grandTotalY + 15, { width: contentWidth });

    // Payment Terms and Bank Details Box
    grandTotalY += 50;
    doc.rect(margin, grandTotalY, contentWidth / 2 - 5, 80).stroke();
    doc.rect(margin + contentWidth / 2 + 5, grandTotalY, contentWidth / 2 - 5, 80).stroke();

    // Payment Terms (Left Box)
    doc.fontSize(10).font('Helvetica-Bold')
       .text('Payment Terms', margin + 10, grandTotalY + 10);
    doc.fontSize(9).font('Helvetica')
       .text(bill.paymentTerms || process.env.PAYMENT_TERMS || '30 Days credit',
             margin + 10, grandTotalY + 25, { width: contentWidth / 2 - 25 });

    // Bank Details (Right Box)
    doc.fontSize(10).font('Helvetica-Bold')
       .text('Bank Details', margin + contentWidth / 2 + 15, grandTotalY + 10);
    doc.fontSize(9).font('Helvetica');
    doc.text(`Account Name: ${process.env.BANK_ACCOUNT_NAME || 'M Picheswara Rao'}`,
             margin + contentWidth / 2 + 15, grandTotalY + 25);
    doc.text(`Account No: ${process.env.BANK_ACCOUNT_NO || '782701505244'}`,
             margin + contentWidth / 2 + 15, doc.y + 3);
    doc.text(`IFSC Code: ${process.env.BANK_IFSC || 'ICIC0007827'}`,
             margin + contentWidth / 2 + 15, doc.y + 3);
    doc.text(`Branch: ${process.env.BANK_BRANCH || 'Salarpuria Sattva'}`,
             margin + contentWidth / 2 + 15, doc.y + 3);

    // Signature
    const signatureY = grandTotalY + 100;
    doc.fontSize(9).font('Helvetica-Bold')
       .text('For ' + (process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO'),
             margin + contentWidth - 150, signatureY, { width: 150, align: 'right' });
    doc.text('Authorized Signatory', margin + contentWidth - 150, signatureY + 40, { width: 150, align: 'right' });

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
