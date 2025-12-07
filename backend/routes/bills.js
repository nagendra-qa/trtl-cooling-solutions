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

    // Create PDF with professional corporate design
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${bill.billNumber}.pdf`);

    doc.pipe(res);

    const pageWidth = 595.28;
    const margin = 50;
    const contentWidth = pageWidth - (margin * 2);

    // Helper function to draw box
    const drawBox = (x, y, width, height) => {
      doc.rect(x, y, width, height).stroke();
    };

    // Modern Header with Company Details
    // Top colored bar
    doc.rect(margin, margin, contentWidth, 8).fillAndStroke('#0ea5e9', '#0ea5e9');

    // Company header box
    drawBox(margin, margin + 8, contentWidth, 90);

    doc.fontSize(24).font('Helvetica-Bold').fillColor('#0c4a6e')
       .text(process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO', margin + 15, margin + 25);

    doc.fontSize(9).font('Helvetica').fillColor('#333333');
    doc.text(`PAN: ${process.env.COMPANY_PAN || 'DJYPM4672Q'}`, margin + 15, margin + 55);
    doc.text(`Mobile: ${process.env.COMPANY_PHONE || '+91-8179697191'}`, margin + 200, margin + 55);

    doc.text(process.env.COMPANY_BILL_ADDRESS || 'D.No.2-12, Kollapalem, Kaja, Krishna DT, Andhra Pradesh - 521150',
             margin + 15, margin + 70, { width: contentWidth - 30 });

    // INVOICE Title - Modern Style
    let currentY = margin + 115;
    doc.rect(margin, currentY, contentWidth, 35).fillAndStroke('#0c4a6e', '#0c4a6e');
    doc.fontSize(26).font('Helvetica-Bold').fillColor('#FFFFFF')
       .text('INVOICE', margin, currentY + 8, { width: contentWidth, align: 'center' });

    // Row 1: Invoice Details (Left) & Work Order Details (Right)
    currentY += 50;
    const halfWidth = (contentWidth - 10) / 2;

    // Left Box: Invoice Number & Date
    drawBox(margin, currentY, halfWidth, 50);

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#0c4a6e');
    doc.text('INVOICE NUMBER: ', margin + 15, currentY + 12, { continued: true });
    doc.font('Helvetica').fillColor('#000000');
    doc.text(bill.billNumber);

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#0c4a6e');
    doc.text('INVOICE DATE: ', margin + 15, currentY + 28, { continued: true });
    doc.font('Helvetica').fillColor('#000000');
    doc.text(new Date(bill.billDate).toLocaleDateString('en-GB'));

    // Right Box: Work Order Number & Date
    drawBox(margin + halfWidth + 10, currentY, halfWidth, 50);

    if (bill.customerWONumber) {
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#0c4a6e');
      doc.text('WORK ORDER NO: ', margin + halfWidth + 25, currentY + 12, { continued: true });
      doc.font('Helvetica').fillColor('#000000');
      doc.text(bill.customerWONumber);
    }

    if (bill.customerWODate) {
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#0c4a6e');
      doc.text('WO DATE: ', margin + halfWidth + 25, currentY + 28, { continued: true });
      doc.font('Helvetica').fillColor('#000000');
      doc.text(new Date(bill.customerWODate).toLocaleDateString('en-GB'));
    }

    // Row 2: Bill To (Left) & Project/Reference (Right)
    currentY += 65;

    // Left Box: Bill To
    drawBox(margin, currentY, halfWidth, 110);
    doc.rect(margin, currentY, 5, 110).fillAndStroke('#0ea5e9', '#0ea5e9');

    doc.fontSize(10).font('Helvetica-Bold').fillColor('#0c4a6e')
       .text('BILL TO', margin + 15, currentY + 8);

    doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000')
       .text('VK Building Services Pvt Ltd', margin + 15, currentY + 25);

    doc.fontSize(9).font('Helvetica').fillColor('#333333');
    doc.text('1st Floor Krishe Sapphire,', margin + 15, currentY + 43);
    doc.text('Sri Krishna Developers,', margin + 15, currentY + 55);
    doc.text('Sy No 88 Opp Vishal Peripherals,', margin + 15, currentY + 67);
    doc.text('Madhapur, Telangana,', margin + 15, currentY + 79);
    doc.text('Hyderabad 500081', margin + 15, currentY + 91);

    // GSTIN in Bill To box
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#0c4a6e');
    doc.text('GSTIN/PAN: ', margin + 15, currentY + 103, { continued: true });
    doc.font('Helvetica').fillColor('#000000').text('36AADCV1173D1ZL');

    // Right Box: Project & Reference
    drawBox(margin + halfWidth + 10, currentY, halfWidth, 110);
    doc.rect(margin + halfWidth + 10, currentY, 5, 110).fillAndStroke('#0ea5e9', '#0ea5e9');

    let rightY = currentY + 25;

    if (bill.projectName || bill.referenceNo) {
      if (bill.projectName) {
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#0c4a6e');
        doc.text('PROJECT: ', margin + halfWidth + 25, rightY, { continued: true });
        doc.font('Helvetica').fillColor('#000000');
        doc.text(bill.projectName, { width: halfWidth - 40 });
        rightY += 30;
      }

      if (bill.referenceNo) {
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#0c4a6e');
        doc.text('REFERENCE: ', margin + halfWidth + 25, rightY, { continued: true });
        doc.font('Helvetica').fillColor('#000000');
        doc.text(bill.referenceNo);
      }
    }

    currentY += 120;

    // Items Table - Modern Design
    const tableTop = currentY;

    // Table header with gradient effect
    doc.rect(margin, tableTop, contentWidth, 28).fillAndStroke('#0c4a6e', '#0c4a6e');

    // Draw vertical lines for table header
    doc.strokeColor('#FFFFFF').lineWidth(1);
    doc.moveTo(margin + 35, tableTop).lineTo(margin + 35, tableTop + 28).stroke();
    doc.moveTo(margin + 255, tableTop).lineTo(margin + 255, tableTop + 28).stroke();
    doc.moveTo(margin + 330, tableTop).lineTo(margin + 330, tableTop + 28).stroke();
    doc.moveTo(margin + 400, tableTop).lineTo(margin + 400, tableTop + 28).stroke();
    doc.moveTo(margin + 450, tableTop).lineTo(margin + 450, tableTop + 28).stroke();

    // Table Headers - White text on dark background
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#FFFFFF');
    doc.text('No.', margin + 8, tableTop + 9, { width: 25, align: 'center' });
    doc.text('Description', margin + 40, tableTop + 9, { width: 210 });
    doc.text('SAC', margin + 260, tableTop + 9, { width: 65, align: 'center' });
    doc.text('Qty', margin + 335, tableTop + 9, { width: 60, align: 'center' });
    doc.text('Rate', margin + 405, tableTop + 9, { width: 40, align: 'right' });
    doc.text('Amount', margin + 455, tableTop + 9, { width: 40, align: 'right' });

    // Table Items
    let itemY = tableTop + 28;
    doc.fontSize(9).font('Helvetica').strokeColor('#000000').lineWidth(0.5);

    bill.items.forEach((item, index) => {
      if (itemY > 680) {
        doc.addPage();
        itemY = margin;
      }

      const rowHeight = Math.max(28, doc.heightOfString(item.description, { width: 205 }) + 14);

      // Alternating row colors for better readability
      if (index % 2 === 0) {
        doc.rect(margin, itemY, contentWidth, rowHeight).fillAndStroke('#F9FAFB', '#E5E7EB');
      } else {
        doc.rect(margin, itemY, contentWidth, rowHeight).fillAndStroke('#FFFFFF', '#E5E7EB');
      }

      // Draw vertical lines
      doc.moveTo(margin + 35, itemY).lineTo(margin + 35, itemY + rowHeight).stroke();
      doc.moveTo(margin + 255, itemY).lineTo(margin + 255, itemY + rowHeight).stroke();
      doc.moveTo(margin + 330, itemY).lineTo(margin + 330, itemY + rowHeight).stroke();
      doc.moveTo(margin + 400, itemY).lineTo(margin + 400, itemY + rowHeight).stroke();
      doc.moveTo(margin + 450, itemY).lineTo(margin + 450, itemY + rowHeight).stroke();

      // Item data
      doc.fillColor('#000000');
      doc.text((index + 1).toString(), margin + 8, itemY + 10, { width: 25, align: 'center' });
      doc.text(item.description, margin + 40, itemY + 10, { width: 205 });
      doc.text(item.sacCode || '-', margin + 260, itemY + 10, { width: 65, align: 'center' });
      doc.text((item.quantity || 0).toFixed(2), margin + 335, itemY + 10, { width: 60, align: 'center' });
      doc.text((item.rate || 0).toFixed(2), margin + 405, itemY + 10, { width: 40, align: 'right' });
      doc.text((item.amount || 0).toFixed(2), margin + 455, itemY + 10, { width: 40, align: 'right' });

      itemY += rowHeight;
    });

    // Totals Section
    const totalsY = itemY;
    const roundUp = bill.roundUp || 0;
    const hasRoundOff = roundUp !== 0;

    if (hasRoundOff) {
      // Show Total Amount if there's round-off
      drawBox(margin, totalsY, contentWidth, 25);
      doc.moveTo(margin + 400, totalsY).lineTo(margin + 400, totalsY + 25).stroke();
      doc.moveTo(margin + 450, totalsY).lineTo(margin + 450, totalsY + 25).stroke();

      doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000');
      doc.text('Total Amount:', margin + 260, totalsY + 7, { width: 135, align: 'right' });
      doc.text('Rs. ' + bill.totalAmount.toFixed(2), margin + 455, totalsY + 7, { width: 40, align: 'right' });

      // Show Round Off
      const roundOffY = totalsY + 25;
      drawBox(margin, roundOffY, contentWidth, 25);
      doc.moveTo(margin + 400, roundOffY).lineTo(margin + 400, roundOffY + 25).stroke();
      doc.moveTo(margin + 450, roundOffY).lineTo(margin + 450, roundOffY + 25).stroke();

      doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000');
      doc.text('Round Off:', margin + 260, roundOffY + 7, { width: 135, align: 'right' });
      doc.text('Rs. ' + roundUp.toFixed(2), margin + 455, roundOffY + 7, { width: 40, align: 'right' });

      var grandTotalY = roundOffY + 25;
    } else {
      var grandTotalY = totalsY;
    }

    // Grand Total - Highlighted
    doc.rect(margin, grandTotalY, contentWidth, 32).fillAndStroke('#0c4a6e', '#0c4a6e');
    doc.strokeColor('#FFFFFF');
    doc.moveTo(margin + 400, grandTotalY).lineTo(margin + 400, grandTotalY + 32).stroke();
    doc.moveTo(margin + 450, grandTotalY).lineTo(margin + 450, grandTotalY + 32).stroke();

    doc.fillColor('#FFFFFF').fontSize(13).font('Helvetica-Bold');
    doc.text('GRAND TOTAL:', margin + 260, grandTotalY + 10, { width: 135, align: 'right' });
    doc.text('Rs. ' + bill.grandTotal.toFixed(2), margin + 455, grandTotalY + 10, { width: 40, align: 'right' });

    // Amount in Words - Modern Card
    currentY = grandTotalY + 45;
    doc.rect(margin, currentY, contentWidth, 35).fillAndStroke('#F9FAFB', '#E5E7EB');
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#0c4a6e')
       .text('Amount in Words:', margin + 10, currentY + 8);
    doc.fontSize(10).font('Helvetica').fillColor('#000000')
       .text(bill.amountInWords || 'Amount not specified', margin + 10, currentY + 21, { width: contentWidth - 20 });

    // Payment Terms and Bank Details - Side by Side Modern Cards
    currentY += 48;
    const boxHeight = 85;

    // Payment Terms Box with colored top
    doc.rect(margin, currentY, halfWidth, 5).fillAndStroke('#0ea5e9', '#0ea5e9');
    drawBox(margin, currentY, halfWidth, boxHeight);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#0c4a6e')
       .text('Payment Terms', margin + 10, currentY + 15);
    doc.fontSize(9).font('Helvetica').fillColor('#333333')
       .text(bill.paymentTerms || '30 Days credit', margin + 10, currentY + 35);

    // Bank Details Box with colored top
    doc.rect(margin + halfWidth + 10, currentY, halfWidth, 5).fillAndStroke('#0ea5e9', '#0ea5e9');
    drawBox(margin + halfWidth + 10, currentY, halfWidth, boxHeight);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#0c4a6e')
       .text('Bank Details', margin + halfWidth + 20, currentY + 15);
    doc.fontSize(9).font('Helvetica').fillColor('#333333');
    doc.text(`Account Name: ${process.env.BANK_ACCOUNT_NAME || 'M Picheswara Rao'}`,
             margin + halfWidth + 20, currentY + 35);
    doc.text(`Account No: ${process.env.BANK_ACCOUNT_NO || '782701505244'}`,
             margin + halfWidth + 20, currentY + 48);
    doc.text(`IFSC Code: ${process.env.BANK_IFSC || 'ICIC0007827'}`,
             margin + halfWidth + 20, currentY + 61);

    // Signature Section - Modern
    currentY += boxHeight + 25;
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#0c4a6e')
       .text('For ' + (process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO'),
             margin + contentWidth - 180, currentY, { width: 180, align: 'right' });

    currentY += 30;
    doc.moveTo(margin + contentWidth - 150, currentY).lineTo(margin + contentWidth, currentY).strokeColor('#0ea5e9').lineWidth(2).stroke();
    doc.fontSize(9).font('Helvetica').fillColor('#666666')
       .text('Authorized Signatory', margin + contentWidth - 150, currentY + 5, { width: 150, align: 'right' });

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
