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

    // Auto-calculate round-off and grand total
    if (billData.totalAmount) {
      const roundedGrandTotal = Math.round(billData.totalAmount);
      billData.roundUp = roundedGrandTotal - billData.totalAmount;
      billData.grandTotal = roundedGrandTotal;
    }

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

    // Auto-calculate round-off and grand total
    if (billData.totalAmount) {
      const roundedGrandTotal = Math.round(billData.totalAmount);
      billData.roundUp = roundedGrandTotal - billData.totalAmount;
      billData.grandTotal = roundedGrandTotal;
    }

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

    // Create PDF with clean simple design matching HTML template
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${bill.billNumber}.pdf`);

    doc.pipe(res);

    const pageWidth = 595.28;
    const margin = 50;
    const contentWidth = pageWidth - (margin * 2);

    // Helper function to draw rounded box
    const drawBox = (x, y, width, height, borderColor = '#dce4f5', fillColor = null) => {
      doc.strokeColor(borderColor).lineWidth(1);
      if (fillColor) {
        doc.fillColor(fillColor);
        doc.roundedRect(x, y, width, height, 3).fillAndStroke();
      } else {
        doc.roundedRect(x, y, width, height, 3).stroke();
      }
    };

    // HEADER Section - matching HTML template
    let currentY = margin;

    // Company name on left
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#1e5bb8')
       .text(process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO', margin, currentY, { width: contentWidth - 120 });

    // INVOICE on right - with sufficient width to prevent wrapping
    doc.fontSize(26).font('Helvetica-Bold').fillColor('#1e5bb8')
       .text('INVOICE', margin + contentWidth - 110, currentY, { width: 110, align: 'right' });

    currentY += 28;

    // Company details on left
    doc.fontSize(11).font('Helvetica').fillColor('#333333');
    doc.text(`PAN: ${process.env.COMPANY_PAN || 'DJYPM4672Q'}`, margin, currentY);
    currentY += 12;
    doc.text(`Mobile: ${process.env.COMPANY_PHONE || '+91-8179697191'}`, margin, currentY);
    currentY += 12;
    doc.text(process.env.COMPANY_BILL_ADDRESS || 'D.No-2-12, Kollapalem, Kaja, Krishna DT, Andhra Pradesh - 521150',
             margin, currentY, { width: contentWidth - 120 });

    // TAX INVOICE on right
    doc.fontSize(10).font('Helvetica').fillColor('#555555')
       .text('TAX INVOICE', margin + contentWidth - 100, currentY + 5, { width: 100, align: 'right' });

    currentY += 25;

    // Blue bottom border
    doc.strokeColor('#1e5bb8').lineWidth(3)
       .moveTo(margin, currentY).lineTo(margin + contentWidth, currentY).stroke();

    currentY += 14;

    // Invoice Details and Project - Two boxes side by side
    const halfWidth = (contentWidth - 10) / 2;
    const boxHeight = 45;

    // Left box - Invoice Details
    drawBox(margin, currentY, halfWidth, boxHeight, '#dce4f5');
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e5bb8')
       .text('Invoice Details', margin + 8, currentY + 6);

    let leftBoxY = currentY + 22;
    doc.fontSize(11).font('Helvetica').fillColor('#000000');
    doc.text('Invoice No:', margin + 8, leftBoxY);
    doc.font('Helvetica-Bold').text(bill.billNumber, margin + 75, leftBoxY);

    doc.font('Helvetica').text('WO No:', margin + halfWidth / 2 + 10, leftBoxY);
    doc.font('Helvetica-Bold').text(bill.customerWONumber || '', margin + halfWidth / 2 + 60, leftBoxY);

    leftBoxY += 14;
    doc.font('Helvetica').text('Invoice Date:', margin + 8, leftBoxY);
    doc.font('Helvetica-Bold').text(new Date(bill.billDate).toLocaleDateString('en-IN'), margin + 85, leftBoxY);

    doc.font('Helvetica').text('WO Date:', margin + halfWidth / 2 + 10, leftBoxY);
    doc.font('Helvetica-Bold').text(bill.customerWODate ? new Date(bill.customerWODate).toLocaleDateString('en-IN') : '', margin + halfWidth / 2 + 65, leftBoxY);

    // Right box - Project
    drawBox(margin + halfWidth + 10, currentY, halfWidth, boxHeight, '#dce4f5');
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e5bb8')
       .text('Project', margin + halfWidth + 18, currentY + 6);

    let rightBoxY = currentY + 22;
    doc.fontSize(11).font('Helvetica').fillColor('#000000');
    doc.text('Project:', margin + halfWidth + 18, rightBoxY);
    doc.font('Helvetica-Bold').text(bill.projectName || '', margin + halfWidth + 65, rightBoxY, { width: halfWidth - 75 });

    rightBoxY += 14;
    doc.font('Helvetica').text('Reference:', margin + halfWidth + 18, rightBoxY);
    doc.font('Helvetica-Bold').text(bill.referenceNo || '', margin + halfWidth + 75, rightBoxY);

    currentY += boxHeight + 10;

    // Bill To Section - Light blue header with white body
    const billToHeight = 75;

    // Header with light blue background
    doc.roundedRect(margin, currentY, contentWidth, 18, 3).fillAndStroke('#f3f6ff', '#dce4f5');
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e5bb8')
       .text('Bill To', margin + 8, currentY + 5);

    currentY += 18;

    // Body with white background
    doc.roundedRect(margin, currentY, contentWidth, billToHeight, 0).fillAndStroke('#ffffff', '#dce4f5');

    let billToY = currentY + 8;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000')
       .text('VK Building Services Pvt Ltd', margin + 8, billToY);

    billToY += 14;
    doc.fontSize(11).font('Helvetica').fillColor('#333333');
    doc.text('1st Floor Krishe Sapphire, Sri Krishna Developers,', margin + 8, billToY);
    billToY += 12;
    doc.text('Sy No 88 Opp Vishal Peripherals,', margin + 8, billToY);
    billToY += 12;
    doc.text('Madhapur, Telangana, Hyderabad 500081', margin + 8, billToY);

    billToY += 14;
    doc.fontSize(11).font('Helvetica').text('GSTIN: 36AADCV1173D1ZL', margin + 8, billToY);

    currentY += billToHeight + 10;

    // Items Table - Clean design with light blue header
    const tableTop = currentY;

    // Table header with light blue background
    doc.rect(margin, tableTop, contentWidth, 20).fillAndStroke('#f3f6ff', '#d0d7e6');

    // Column widths - adjusted for better spacing
    const col1X = margin + 5;
    const col1W = 30;
    const col2X = col1X + col1W;
    const col2W = 190;
    const col3X = col2X + col2W;
    const col3W = 60;
    const col4X = col3X + col3W;
    const col4W = 45;
    const col5X = col4X + col4W;
    const col5W = 40;
    const col6X = col5X + col5W;
    const col6W = 60;
    const col7X = col6X + col6W;
    const col7W = 70; // Fixed width for Amount column to ensure proper display

    // Table header text
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000');
    doc.text('No', col1X, tableTop + 6, { width: col1W, align: 'center' });
    doc.text('Description of Services', col2X, tableTop + 6, { width: col2W, align: 'left' });
    doc.text('SAC', col3X, tableTop + 6, { width: col3W, align: 'center' });
    doc.text('Unit', col4X, tableTop + 6, { width: col4W, align: 'center' });
    doc.text('Qty', col5X, tableTop + 6, { width: col5W, align: 'center' });
    doc.text('Rate (₹)', col6X, tableTop + 6, { width: col6W, align: 'center' });
    doc.text('Amount (₹)', col7X, tableTop + 6, { width: col7W, align: 'right' });

    let itemY = tableTop + 20;

    // Table items
    doc.fontSize(11).font('Helvetica').fillColor('#000000');
    bill.items.forEach((item, index) => {
      const rowHeight = 22;

      // Row border
      doc.rect(margin, itemY, contentWidth, rowHeight).stroke('#d0d7e6');

      // Item data
      doc.text((index + 1).toString(), col1X, itemY + 6, { width: col1W, align: 'center' });
      doc.text(item.description || '', col2X + 3, itemY + 6, { width: col2W - 6, align: 'left' });
      doc.text(item.sacCode || '', col3X, itemY + 6, { width: col3W, align: 'center' });
      doc.text(item.unit || 'EA', col4X, itemY + 6, { width: col4W, align: 'center' });
      doc.text((item.quantity || 0).toFixed(2), col5X, itemY + 6, { width: col5W, align: 'center' });
      doc.text((item.rate || 0).toFixed(2), col6X, itemY + 6, { width: col6W, align: 'right' });
      // Format amount properly with Indian number formatting
      const formattedAmount = (item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      doc.text(formattedAmount, col7X, itemY + 6, { width: col7W - 5, align: 'right' });

      itemY += rowHeight;
    });

    // Totals Section - matching HTML template
    const totalAmount = bill.totalAmount || 0;
    const roundUp = bill.roundUp || 0;
    const grandTotal = bill.grandTotal || 0;

    const rowHeight = 20;

    // Total row
    doc.rect(margin, itemY, contentWidth, rowHeight).fillAndStroke('#fafbff', '#d0d7e6');
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000');
    doc.text('Total', col6X, itemY + 6, { width: col6W, align: 'right' });
    const formattedTotal = totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    doc.text(formattedTotal, col7X, itemY + 6, { width: col7W - 5, align: 'right' });

    itemY += rowHeight;

    // Round Off row
    doc.rect(margin, itemY, contentWidth, rowHeight).stroke('#d0d7e6');
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000');
    doc.text('Round Off', col6X, itemY + 6, { width: col6W, align: 'right' });
    const formattedRoundUp = roundUp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    doc.text(formattedRoundUp, col7X, itemY + 6, { width: col7W - 5, align: 'right' });

    itemY += rowHeight;

    // Grand Total row - Blue background
    doc.rect(margin, itemY, contentWidth, rowHeight).fillAndStroke('#1e5bb8', '#1e5bb8');
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#ffffff');
    doc.text('Grand Total', col6X, itemY + 6, { width: col6W, align: 'right' });
    const formattedGrandTotal = grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    doc.text(formattedGrandTotal, col7X, itemY + 6, { width: col7W - 5, align: 'right' });

    itemY += rowHeight + 8;

    // Amount in Words
    currentY = itemY;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000');
    doc.text('Amount in Words: ', margin, currentY);
    doc.font('Helvetica').text(bill.amountInWords || numberToWords(Math.round(grandTotal)), margin + 120, currentY, { width: contentWidth - 120 });

    currentY += 20;

    // Notes / Payment Terms and Bank Details - Two boxes side by side
    const footerBoxHeight = 60;

    // Left box - Notes / Payment Terms
    drawBox(margin, currentY, halfWidth, footerBoxHeight, '#dce4f5');
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e5bb8')
       .text('Notes / Payment Terms', margin + 8, currentY + 6);

    let notesY = currentY + 22;
    doc.fontSize(10).font('Helvetica').fillColor('#333333');
    if (bill.notes && bill.notes.trim()) {
      doc.text(bill.notes, margin + 8, notesY, { width: halfWidth - 16 });
      notesY += 18;
    }
    doc.font('Helvetica-Bold').text('Payment Terms: ', margin + 8, notesY);
    doc.font('Helvetica').text(bill.paymentTerms || '30 Days credit', margin + 110, notesY);

    // Right box - Bank Details
    drawBox(margin + halfWidth + 10, currentY, halfWidth, footerBoxHeight, '#dce4f5');
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e5bb8')
       .text('Bank Details', margin + halfWidth + 18, currentY + 6);

    let bankY = currentY + 22;
    doc.fontSize(10).font('Helvetica').fillColor('#333333');
    doc.text(`Account Name: ${process.env.BANK_ACCOUNT_NAME || 'M Picheswara Rao'}`, margin + halfWidth + 18, bankY);
    bankY += 12;
    doc.text(`Account No: ${process.env.BANK_ACCOUNT_NO || '782701505244'}`, margin + halfWidth + 18, bankY);
    bankY += 12;
    doc.text(`IFSC Code: ${process.env.BANK_IFSC || 'ICIC0007827'}`, margin + halfWidth + 18, bankY);

    currentY += footerBoxHeight + 28;

    // Signature Section
    doc.fontSize(11).font('Helvetica').fillColor('#333333')
       .text(`For ${process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO'}`, margin + contentWidth - 180, currentY, { width: 180, align: 'right' });

    currentY += 28;
    doc.strokeColor('#555555').lineWidth(1)
       .moveTo(margin + contentWidth - 160, currentY).lineTo(margin + contentWidth, currentY).stroke();
    doc.fontSize(10).font('Helvetica').fillColor('#333333')
       .text('Authorised Signatory', margin + contentWidth - 160, currentY + 4, { width: 160, align: 'right' });

    currentY += 30;

    // Page Footer
    doc.fontSize(10).font('Helvetica').fillColor('#6b7280');
    doc.text('Thank you for your business.', margin, currentY);
    doc.text('We appreciate the opportunity to serve you.', margin, currentY + 12);

    doc.text(`For service or billing queries:`, margin + contentWidth / 2 - 80, currentY, { width: 160, align: 'center' });
    doc.text(`Call: ${process.env.COMPANY_PHONE || '+91-8179697191'}`, margin + contentWidth / 2 - 80, currentY + 12, { width: 160, align: 'center' });

    doc.text('This is a computer-generated invoice', margin + contentWidth - 200, currentY, { width: 200, align: 'right' });
    doc.text(`Invoice No: ${bill.billNumber}`, margin + contentWidth - 200, currentY + 12, { width: 200, align: 'right' });

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
