const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Bill = require('../models/Bill');
const {numberToWords} = require('../utils/helpers');
const {generateInvoiceNumber} = require('../utils/invoiceNumber');

// Get all bills
router.get('/', async (req, res) => {
    try {
        const {customerId, status} = req.query;
        const query = {};
        if (customerId) query.customer = customerId;
        if (status) query.status = status;

        const bills = await Bill.find(query)
            .populate('customer')
            .populate('camp')
            .populate('workOrder')
            .sort({createdAt: -1});
        res.json(bills);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Get next invoice number
router.get('/next-invoice-number', async (req, res) => {
    try {
        const nextInvoiceNumber = await generateInvoiceNumber();
        res.json({invoiceNumber: nextInvoiceNumber});
    } catch (error) {
        res.status(500).json({message: error.message});
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
            return res.status(404).json({message: 'Bill not found'});
        }
        res.json(bill);
    } catch (error) {
        res.status(500).json({message: error.message});
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
        res.status(400).json({message: error.message});
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
            {new: true, runValidators: true}
        ).populate('customer').populate('camp').populate('workOrder');

        if (!bill) {
            return res.status(404).json({message: 'Bill not found'});
        }
        res.json(bill);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Delete bill
router.delete('/:id', async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);
        if (!bill) {
            return res.status(404).json({message: 'Bill not found'});
        }
        res.json({message: 'Bill deleted successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
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

        const doc = new PDFDocument({ margin: 40, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=Invoice-${bill.billNumber}.pdf`
        );

        doc.pipe(res);

        const pageWidth = 595.28;
        const margin = 40;
        const contentWidth = pageWidth - margin * 2;

        const drawBox = (x, y, w, h, color = '#cbd5e1') => {
            doc.strokeColor(color).rect(x, y, w, h).stroke();
        };

        /* ================= HEADER ================= */

        doc.fontSize(22).font('Helvetica-Bold').fillColor('#2563eb')
            .text(process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO', margin, margin);

        doc.fontSize(10).font('Helvetica').fillColor('#666');
        let headerY = margin + 30;

        doc.text(
            `PAN: ${process.env.COMPANY_PAN || 'DJYPM4672Q'}   |   Mobile: ${process.env.COMPANY_PHONE || '+91-8179697191'}`,
            margin,
            headerY,
            { width: contentWidth }
        );

        doc.text(
            process.env.COMPANY_BILL_ADDRESS ||
            'D.No.2-12, Kollapalem, Kaja, Krishna DT, Andhra Pradesh - 521150',
            margin,
            headerY + 16,
            { width: contentWidth }
        );

        doc.moveTo(margin, headerY + 35)
            .lineTo(margin + contentWidth, headerY + 35)
            .lineWidth(2)
            .strokeColor('#2563eb')
            .stroke();

        /* ================= INVOICE TITLE ================= */

        let currentY = headerY + 50;
        doc.fontSize(20).font('Helvetica-Bold').fillColor('#1e40af')
            .text('INVOICE', margin, currentY);

        currentY += 35;
        const halfWidth = (contentWidth - 15) / 2;

        /* ================= TABLE ================= */

        currentY += 110;
        const tableTop = currentY;

        doc.rect(margin, tableTop, contentWidth, 24)
            .fillAndStroke('#3b82f6', '#3b82f6');

        const col1 = margin + 5;
        const col2 = margin + 35;
        const col3 = margin + 280;
        const col4 = margin + 340;
        const col5 = margin + 400;
        const col6 = margin + 460;

        doc.fontSize(9).font('Helvetica-Bold').fillColor('#fff');
        doc.text('No.', col1, tableTop + 7, { width: 20, align: 'center' });
        doc.text('Description', col2, tableTop + 7, { width: 240 });
        doc.text('SAC', col3, tableTop + 7, { width: 50, align: 'center' });
        doc.text('Qty', col4, tableTop + 7, { width: 50, align: 'center' });
        doc.text('Rate', col5, tableTop + 7, { width: 50, align: 'right' });
        doc.text('Amount', col6, tableTop + 7, { width: 50, align: 'right' });

        let itemY = tableTop + 24;
        doc.fontSize(9).font('Helvetica').fillColor('#000');

        bill.items.forEach((item, index) => {
            const rowH = 26;
            doc.rect(margin, itemY, contentWidth, rowH)
                .strokeColor('#cbd5e1')
                .stroke();

            doc.text(index + 1, col1, itemY + 8, { width: 20, align: 'center' });
            doc.text(item.description, col2, itemY + 8, { width: 235 });
            doc.text(item.sacCode || '-', col3, itemY + 8, { width: 50, align: 'center' });
            doc.text(item.quantity.toFixed(2), col4, itemY + 8, { width: 50, align: 'center' });
            doc.text(item.rate.toFixed(2), col5, itemY + 8, { width: 50, align: 'right' });
            doc.text(item.amount.toFixed(2), col6, itemY + 8, { width: 50, align: 'right' });

            itemY += rowH;
        });

        /* ================= TOTALS (FIXED & ALIGNED) ================= */

        const totalAmount = bill.items.reduce((s, i) => s + Number(i.amount || 0), 0);
        const roundOff = bill.roundUp || 0;
        const grandTotal = totalAmount + roundOff;

        const totalsWidth = 240;
        const totalsX = margin + contentWidth - totalsWidth;
        const rowH = 26;

        const drawTotalRow = (y, label, value, bg = '#f1f5f9', bold = false) => {
            doc.fillColor(bg).rect(totalsX, y, totalsWidth, rowH).fill();
            doc.strokeColor('#cbd5e1').rect(totalsX, y, totalsWidth, rowH).stroke();

            doc.font(bold ? 'Helvetica-Bold' : 'Helvetica')
                .fontSize(10)
                .fillColor('#334155')
                .text(label, totalsX + 10, y + 8);

            doc.text(`Rs. ${value}`, totalsX + totalsWidth - 10, y + 8, {
                width: totalsWidth - 20,
                align: 'right'
            });
        };

        drawTotalRow(itemY + 10, 'Total', totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }));
        drawTotalRow(itemY + 36, 'Round Off', roundOff.toFixed(2));
        drawTotalRow(itemY + 62, 'GRAND TOTAL',
            grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            '#1e40af',
            true
        );

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;