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

    // Create PDF with clean professional design
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${bill.billNumber}.pdf`);

    doc.pipe(res);

    const pageWidth = 595.28;
    const margin = 40;
    const contentWidth = pageWidth - (margin * 2);

    // Helper function to draw box
    const drawBox = (x, y, width, height, color = '#000000') => {
      doc.strokeColor(color).lineWidth(1).rect(x, y, width, height).stroke();
    };

    // Company Header - Simple & Clean
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#2563eb')
       .text(process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO', margin, margin);

    doc.fontSize(9).font('Helvetica').fillColor('#666666');
    let headerY = margin + 28;
    doc.text(`PAN: ${process.env.COMPANY_PAN || 'DJYPM4672Q'}`, margin, headerY);
    doc.text(`Mobile: ${process.env.COMPANY_PHONE || '+91-8179697191'}`, margin + 180, headerY);
    doc.text(process.env.COMPANY_BILL_ADDRESS || 'D.No.2-12, Kollapalem, Kaja, Krishna DT, Andhra Pradesh - 521150',
             margin, headerY + 14, { width: contentWidth });

    // Horizontal line separator
    doc.strokeColor('#2563eb').lineWidth(2)
       .moveTo(margin, headerY + 35).lineTo(margin + contentWidth, headerY + 35).stroke();

    // INVOICE Title
    let currentY = headerY + 50;
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#1e40af')
       .text('INVOICE', margin, currentY);

    currentY += 35;
    const halfWidth = (contentWidth - 15) / 2;

    // Invoice Details Section - Simple Boxes
    // Left: Invoice Info
    drawBox(margin, currentY, halfWidth, 50, '#cbd5e1');
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#334155');
    doc.text('INVOICE NUMBER:', margin + 10, currentY + 12);
    doc.font('Helvetica').fillColor('#000000');
    doc.text(bill.billNumber, margin + 100, currentY + 12);

    doc.font('Helvetica-Bold').fillColor('#334155');
    doc.text('INVOICE DATE:', margin + 10, currentY + 28);
    doc.font('Helvetica').fillColor('#000000');
    doc.text(new Date(bill.billDate).toLocaleDateString('en-GB'), margin + 100, currentY + 28);

    // Right: Work Order Info
    drawBox(margin + halfWidth + 15, currentY, halfWidth, 50, '#cbd5e1');
    if (bill.customerWONumber) {
      doc.font('Helvetica-Bold').fillColor('#334155');
      doc.text('WORK ORDER NO:', margin + halfWidth + 25, currentY + 12);
      doc.font('Helvetica').fillColor('#000000');
      doc.text(bill.customerWONumber, margin + halfWidth + 120, currentY + 12);
    }
    if (bill.customerWODate) {
      doc.font('Helvetica-Bold').fillColor('#334155');
      doc.text('WO DATE:', margin + halfWidth + 25, currentY + 28);
      doc.font('Helvetica').fillColor('#000000');
      doc.text(new Date(bill.customerWODate).toLocaleDateString('en-GB'), margin + halfWidth + 120, currentY + 28);
    }

    // Bill To & Project Section
    currentY += 60;

    // Left: Bill To
    drawBox(margin, currentY, halfWidth, 100, '#cbd5e1');
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e40af')
       .text('BILL TO', margin + 10, currentY + 8);

    doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000')
       .text('VK Building Services Pvt Ltd', margin + 10, currentY + 24);

    doc.fontSize(8).font('Helvetica').fillColor('#333333');
    doc.text('1st Floor Krishe Sapphire, Sri Krishna Developers,', margin + 10, currentY + 40);
    doc.text('Sy No 88 Opp Vishal Peripherals,', margin + 10, currentY + 52);
    doc.text('Madhapur, Telangana, Hyderabad 500081', margin + 10, currentY + 64);

    doc.fontSize(8).font('Helvetica-Bold').fillColor('#334155');
    doc.text('GSTIN/PAN:', margin + 10, currentY + 80);
    doc.font('Helvetica').fillColor('#000000');
    doc.text('36AADCV1173D1ZL', margin + 60, currentY + 80);

    // Right: Project & Reference
    drawBox(margin + halfWidth + 15, currentY, halfWidth, 100, '#cbd5e1');
    let rightY = currentY + 24;

    if (bill.projectName) {
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#334155');
      doc.text('PROJECT:', margin + halfWidth + 25, rightY);
      doc.font('Helvetica').fillColor('#000000');
      doc.text(bill.projectName, margin + halfWidth + 25, rightY + 14, { width: halfWidth - 30 });
      rightY += 40;
    }

    if (bill.referenceNo) {
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#334155');
      doc.text('REFERENCE:', margin + halfWidth + 25, rightY);
      doc.font('Helvetica').fillColor('#000000');
      doc.text(bill.referenceNo, margin + halfWidth + 80, rightY);
    }

    currentY += 110;

    // Items Table - Clean Design
    const tableTop = currentY;

    // Table header
    doc.rect(margin, tableTop, contentWidth, 24).fillAndStroke('#3b82f6', '#3b82f6');

    // Column positions
    const col1 = margin + 5;
    const col2 = margin + 35;
    const col3 = margin + 280;
    const col4 = margin + 340;
    const col5 = margin + 400;
    const col6 = margin + 460;

    // Draw vertical lines for header
    doc.strokeColor('#ffffff').lineWidth(0.5);
    doc.moveTo(margin + 30, tableTop).lineTo(margin + 30, tableTop + 24).stroke();
    doc.moveTo(col3 - 5, tableTop).lineTo(col3 - 5, tableTop + 24).stroke();
    doc.moveTo(col4 - 5, tableTop).lineTo(col4 - 5, tableTop + 24).stroke();
    doc.moveTo(col5 - 5, tableTop).lineTo(col5 - 5, tableTop + 24).stroke();
    doc.moveTo(col6 - 5, tableTop).lineTo(col6 - 5, tableTop + 24).stroke();

    // Table Headers
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#FFFFFF');
    doc.text('No.', col1, tableTop + 7, { width: 20, align: 'center' });
    doc.text('Description', col2, tableTop + 7, { width: 240 });
    doc.text('SAC', col3, tableTop + 7, { width: 50, align: 'center' });
    doc.text('Qty', col4, tableTop + 7, { width: 50, align: 'center' });
    doc.text('Rate', col5, tableTop + 7, { width: 50, align: 'right' });
    doc.text('Amount', col6, tableTop + 7, { width: 50, align: 'right' });

    // Table Items
    let itemY = tableTop + 24;
    doc.fontSize(9).font('Helvetica').strokeColor('#cbd5e1').lineWidth(0.5);

    bill.items.forEach((item, index) => {
      if (itemY > 680) {
        doc.addPage();
        itemY = margin;
      }

      const descHeight = doc.heightOfString(item.description, { width: 235 });
      const rowHeight = Math.max(26, descHeight + 12);

      // Row background
      if (index % 2 === 0) {
        doc.rect(margin, itemY, contentWidth, rowHeight).fillAndStroke('#f8fafc', '#cbd5e1');
      } else {
        doc.rect(margin, itemY, contentWidth, rowHeight).fillAndStroke('#ffffff', '#cbd5e1');
      }

      // Draw vertical lines
      doc.moveTo(margin + 30, itemY).lineTo(margin + 30, itemY + rowHeight).stroke();
      doc.moveTo(col3 - 5, itemY).lineTo(col3 - 5, itemY + rowHeight).stroke();
      doc.moveTo(col4 - 5, itemY).lineTo(col4 - 5, itemY + rowHeight).stroke();
      doc.moveTo(col5 - 5, itemY).lineTo(col5 - 5, itemY + rowHeight).stroke();
      doc.moveTo(col6 - 5, itemY).lineTo(col6 - 5, itemY + rowHeight).stroke();

      // Item data
      doc.fillColor('#000000');
      doc.text((index + 1).toString(), col1, itemY + 8, { width: 20, align: 'center' });
      doc.text(item.description, col2, itemY + 8, { width: 235 });
      doc.text(item.sacCode || '-', col3, itemY + 8, { width: 50, align: 'center' });
      doc.text((item.quantity || 0).toFixed(2), col4, itemY + 8, { width: 50, align: 'center' });
      doc.text((item.rate || 0).toFixed(2), col5, itemY + 8, { width: 50, align: 'right' });
      doc.text((item.amount || 0).toFixed(2), col6, itemY + 8, { width: 50, align: 'right' });

      itemY += rowHeight;
    });

    // Add blank row for comments
    const commentsRowHeight = 40;
    doc.rect(margin, itemY, contentWidth, commentsRowHeight).fillAndStroke('#fffbeb', '#cbd5e1');

    doc.moveTo(margin + 30, itemY).lineTo(margin + 30, itemY + commentsRowHeight).stroke();

    doc.fontSize(9).font('Helvetica-Oblique').fillColor('#92400e');
    doc.text('Comments / Notes:', col2, itemY + 15, { width: contentWidth - 70 });

    itemY += commentsRowHeight;

    // Totals Section - Simple & Clean
    const totalsY = itemY;
    const roundUp = bill.roundUp || 0;
    const hasRoundOff = roundUp !== 0;

    // Grand Total Row
    let grandTotalY = totalsY;

    if (hasRoundOff) {
      // Show Total Amount if there's round-off
      doc.rect(margin, totalsY, contentWidth, 24).fillAndStroke('#f1f5f9', '#cbd5e1');
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#334155');
      doc.text('Total Amount:', margin + 320, totalsY + 7);
      doc.text('Rs. ' + bill.totalAmount.toFixed(2), margin + 420, totalsY + 7, { width: 95, align: 'right' });

      // Show Round Off
      const roundOffY = totalsY + 24;
      doc.rect(margin, roundOffY, contentWidth, 24).fillAndStroke('#f1f5f9', '#cbd5e1');
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#334155');
      doc.text('Round Off:', margin + 320, roundOffY + 7);
      doc.text('Rs. ' + roundUp.toFixed(2), margin + 420, roundOffY + 7, { width: 95, align: 'right' });

      grandTotalY = roundOffY + 24;
    }

    // Grand Total - Highlighted
    doc.rect(margin, grandTotalY, contentWidth, 30).fillAndStroke('#1e40af', '#1e40af');
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF');
    doc.text('GRAND TOTAL:', margin + 320, grandTotalY + 9);
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Rs. ' + bill.grandTotal.toFixed(2), margin + 420, grandTotalY + 9, { width: 95, align: 'right' });

    // Amount in Words
    currentY = grandTotalY + 40;
    doc.rect(margin, currentY, contentWidth, 32).fillAndStroke('#f8fafc', '#cbd5e1');
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#334155')
       .text('Amount in Words:', margin + 10, currentY + 8);
    doc.fontSize(9).font('Helvetica').fillColor('#000000')
       .text(bill.amountInWords || 'Amount not specified', margin + 10, currentY + 19, { width: contentWidth - 20 });

    // Payment Terms and Bank Details
    currentY += 42;
    const boxHeight = 70;

    // Payment Terms
    drawBox(margin, currentY, halfWidth, boxHeight, '#cbd5e1');
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e40af')
       .text('Payment Terms', margin + 10, currentY + 8);
    doc.fontSize(9).font('Helvetica').fillColor('#333333')
       .text(bill.paymentTerms || '30 Days credit', margin + 10, currentY + 26);

    // Bank Details
    drawBox(margin + halfWidth + 15, currentY, halfWidth, boxHeight, '#cbd5e1');
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e40af')
       .text('Bank Details', margin + halfWidth + 25, currentY + 8);
    doc.fontSize(8).font('Helvetica').fillColor('#333333');
    doc.text(`Account Name: ${process.env.BANK_ACCOUNT_NAME || 'M Picheswara Rao'}`,
             margin + halfWidth + 25, currentY + 26);
    doc.text(`Account No: ${process.env.BANK_ACCOUNT_NO || '782701505244'}`,
             margin + halfWidth + 25, currentY + 38);
    doc.text(`IFSC Code: ${process.env.BANK_IFSC || 'ICIC0007827'}`,
             margin + halfWidth + 25, currentY + 50);

    // Signature Section
    currentY += boxHeight + 20;
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#334155')
       .text('For ' + (process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO'),
             margin + contentWidth - 160, currentY, { width: 160, align: 'right' });

    currentY += 25;
    doc.moveTo(margin + contentWidth - 140, currentY).lineTo(margin + contentWidth, currentY)
       .strokeColor('#2563eb').lineWidth(1.5).stroke();
    doc.fontSize(8).font('Helvetica').fillColor('#666666')
       .text('Authorized Signatory', margin + contentWidth - 140, currentY + 3, { width: 140, align: 'right' });

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
