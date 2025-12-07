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

    const pageWidth = 595.28;
    const margin = 40;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;

    // Company Header
    doc.fillColor('#000000').fontSize(18).font('Helvetica-Bold')
       .text(process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO', margin, yPos);

    yPos += 25;
    doc.fontSize(9).font('Helvetica');
    doc.text(`PAN: ${process.env.COMPANY_PAN || 'DJYPM4672Q'} | Mobile: ${process.env.COMPANY_PHONE || '+91-8179697191'}`, margin, yPos);

    yPos += 12;
    doc.text(process.env.COMPANY_BILL_ADDRESS || 'D.No.2-12, Kollapalem, Kaja, Krishna DT, Andhra Pradesh - 521150', margin, yPos, { width: contentWidth });

    yPos += 25;
    doc.moveTo(margin, yPos).lineTo(pageWidth - margin, yPos).lineWidth(1).stroke();

    // Invoice Title
    yPos += 20;
    doc.fontSize(20).font('Helvetica-Bold')
       .text('TAX INVOICE', margin, yPos, { width: contentWidth, align: 'center' });

    yPos += 35;
    doc.moveTo(margin, yPos).lineTo(pageWidth - margin, yPos).lineWidth(1).stroke();

    // Invoice Details
    yPos += 15;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Invoice No:', margin, yPos);
    doc.font('Helvetica').text(bill.billNumber, margin + 80, yPos);

    doc.font('Helvetica-Bold').text('Date:', margin + 250, yPos);
    doc.font('Helvetica').text(new Date(bill.billDate).toLocaleDateString('en-GB'), margin + 290, yPos);

    if (bill.customerWONumber) {
      yPos += 15;
      doc.font('Helvetica-Bold').text('Work Order:', margin, yPos);
      doc.font('Helvetica').text(bill.customerWONumber, margin + 80, yPos);

      if (bill.customerWODate) {
        doc.font('Helvetica-Bold').text('WO Date:', margin + 250, yPos);
        doc.font('Helvetica').text(new Date(bill.customerWODate).toLocaleDateString('en-GB'), margin + 290, yPos);
      }
    }

    yPos += 25;
    doc.moveTo(margin, yPos).lineTo(pageWidth - margin, yPos).lineWidth(1).stroke();

    // Bill To Section
    yPos += 15;
    doc.fontSize(11).font('Helvetica-Bold').text('BILL TO:', margin, yPos);

    yPos += 18;
    doc.fontSize(10).text('VK Building Services Pvt Ltd', margin, yPos);

    yPos += 14;
    doc.fontSize(9).font('Helvetica');
    doc.text('1st Floor Krishe Sapphire, Sri Krishna Developers,', margin, yPos);
    yPos += 12;
    doc.text('Sy No 88 Opp Vishal Peripherals, Madhapur', margin, yPos);
    yPos += 12;
    doc.text('Telangana, Hyderabad 500081', margin, yPos);
    yPos += 14;
    doc.font('Helvetica-Bold').text('GSTIN: ', margin, yPos, { continued: true });
    doc.font('Helvetica').text('36AADCV1173D1ZL');

    // Project Details
    if (bill.projectName || bill.referenceNo) {
      yPos += 18;
      if (bill.projectName) {
        doc.font('Helvetica-Bold').text('Project: ', margin, yPos, { continued: true });
        doc.font('Helvetica').text(bill.projectName);
        yPos += 14;
      }
      if (bill.referenceNo) {
        doc.font('Helvetica-Bold').text('Reference: ', margin, yPos, { continued: true });
        doc.font('Helvetica').text(bill.referenceNo);
        yPos += 14;
      }
    }

    yPos += 20;
    doc.moveTo(margin, yPos).lineTo(pageWidth - margin, yPos).lineWidth(1).stroke();

    // Table Header
    yPos += 2;
    const tableTop = yPos;
    doc.rect(margin, tableTop, contentWidth, 22).fillAndStroke('#f0f0f0', '#000000');

    yPos += 7;
    doc.fillColor('#000000').fontSize(9).font('Helvetica-Bold');
    doc.text('No.', margin + 5, yPos, { width: 25, align: 'center' });
    doc.text('Description', margin + 35, yPos, { width: 200 });
    doc.text('SAC', margin + 240, yPos, { width: 50, align: 'center' });
    doc.text('Qty', margin + 295, yPos, { width: 40, align: 'right' });
    doc.text('Rate', margin + 340, yPos, { width: 70, align: 'right' });
    doc.text('Amount', margin + 415, yPos, { width: 90, align: 'right' });

    yPos = tableTop + 22;
    doc.moveTo(margin, yPos).lineTo(pageWidth - margin, yPos).lineWidth(1).stroke();

    // Table Items
    doc.font('Helvetica').fontSize(9);
    bill.items.forEach((item, index) => {
      if (yPos > 700) {
        doc.addPage();
        yPos = margin;
      }

      yPos += 8;
      const startY = yPos;

      doc.fillColor('#000000');
      doc.text((index + 1).toString(), margin + 5, yPos, { width: 25, align: 'center' });
      doc.text(item.description, margin + 35, yPos, { width: 200 });
      doc.text(item.sacCode || '', margin + 240, yPos, { width: 50, align: 'center' });
      doc.text((item.quantity || 0).toFixed(2), margin + 295, yPos, { width: 40, align: 'right' });
      doc.text((item.rate || 0).toFixed(2), margin + 340, yPos, { width: 70, align: 'right' });
      doc.text((item.amount || 0).toFixed(2), margin + 415, yPos, { width: 90, align: 'right' });

      yPos += Math.max(20, doc.heightOfString(item.description, { width: 200 })) + 8;
      doc.moveTo(margin, yPos).lineTo(pageWidth - margin, yPos).lineWidth(0.5).stroke();
    });

    // Totals
    yPos += 10;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Total Amount:', margin + 340, yPos, { width: 70, align: 'right' });
    doc.text('Rs. ' + bill.totalAmount.toFixed(2), margin + 415, yPos, { width: 90, align: 'right' });

    yPos += 20;
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('GRAND TOTAL:', margin + 340, yPos, { width: 70, align: 'right' });
    doc.text('Rs. ' + bill.grandTotal.toFixed(2), margin + 415, yPos, { width: 90, align: 'right' });

    yPos += 25;
    doc.moveTo(margin, yPos).lineTo(pageWidth - margin, yPos).lineWidth(1).stroke();

    // Amount in Words
    yPos += 15;
    doc.fontSize(9).font('Helvetica-Bold').text('Amount in Words: ', margin, yPos, { continued: true });
    doc.font('Helvetica').text(bill.amountInWords || 'Amount not specified');

    yPos += 30;
    doc.moveTo(margin, yPos).lineTo(pageWidth - margin, yPos).lineWidth(1).stroke();

    // Payment Terms and Bank Details
    yPos += 15;
    doc.fontSize(10).font('Helvetica-Bold').text('Payment Terms', margin, yPos);
    doc.text('Bank Details', margin + 280, yPos);

    yPos += 15;
    doc.fontSize(9).font('Helvetica');
    doc.text(bill.paymentTerms || '30 Days credit', margin, yPos);

    doc.text(`Account Name: ${process.env.BANK_ACCOUNT_NAME || 'M Picheswara Rao'}`, margin + 280, yPos);
    yPos += 12;
    doc.text(`Account No: ${process.env.BANK_ACCOUNT_NO || '782701505244'}`, margin + 280, yPos);
    yPos += 12;
    doc.text(`IFSC Code: ${process.env.BANK_IFSC || 'ICIC0007827'}`, margin + 280, yPos);
    yPos += 12;
    doc.text(`Branch: ${process.env.BANK_BRANCH || 'Salarpuria Sattva'}`, margin + 280, yPos);

    // Signature
    yPos += 60;
    doc.fontSize(9).font('Helvetica-Bold')
       .text('For ' + (process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO'), margin + 350, yPos);
    yPos += 30;
    doc.text('Authorized Signatory', margin + 350, yPos);

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
