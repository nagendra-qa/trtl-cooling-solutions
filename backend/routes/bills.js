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
            return res.status(404).json({message: 'Bill not found'});
        }

        // Create PDF with clean professional design
        const doc = new PDFDocument({margin: 40, size: 'A4'});

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

        // =========================
// COMPANY HEADER (UPDATED CLEAN DESIGN)
// =========================

// Company Name
        doc.fontSize(22)
            .font('Helvetica-Bold')
            .fillColor('#2563eb')
            .text(process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO', margin, margin);

// Details Text Style
        doc.fontSize(10)
            .font('Helvetica')
            .fillColor('#666666');

        let headerY = margin + 30;

// PAN + Mobile (Same Line, Clean Spacing)
        const panText = `PAN: ${process.env.COMPANY_PAN || 'DJYPM4672Q'}`;
        const mobileText = `Mobile: ${process.env.COMPANY_PHONE || '+91-8179697191'}`;

        doc.text(`${panText}    |    ${mobileText}`, margin, headerY, {
            width: contentWidth
        });

// Address (Full Width Below)
        doc.text(
            process.env.COMPANY_BILL_ADDRESS ||
            'D.No.2-12, Kollapalem, Kaja, Krishna DT, Andhra Pradesh - 521150',
            margin,
            headerY + 16,
            {width: contentWidth}
        );


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
        doc.text('INVOICE NUMBER :', margin + 10, currentY + 12);
        doc.font('Helvetica').fillColor('#000000');
        doc.text(bill.billNumber, margin + 100, currentY + 12);

        doc.font('Helvetica-Bold').fillColor('#334155');
        doc.text('INVOICE DATE :', margin + 10, currentY + 28);
        doc.font('Helvetica').fillColor('#000000');
        doc.text(new Date(bill.billDate).toLocaleDateString('en-GB'), margin + 100, currentY + 28);

        // Right: Work Order Info
        drawBox(margin + halfWidth + 15, currentY, halfWidth, 50, '#cbd5e1');
        if (bill.customerWONumber) {
            doc.font('Helvetica-Bold').fillColor('#334155');
            doc.text('WORK ORDER NO :', margin + halfWidth + 25, currentY + 12);
            doc.font('Helvetica').fillColor('#000000');
            doc.text(bill.customerWONumber, margin + halfWidth + 120, currentY + 12);
        }
        if (bill.customerWODate) {
            doc.font('Helvetica-Bold').fillColor('#334155');
            doc.text('WO DATE :', margin + halfWidth + 25, currentY + 28);
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

        // PROJECT
        if (bill.projectName) {
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#334155');
            doc.text('PROJECT :', margin + halfWidth + 25, rightY);

            doc.font('Helvetica').fillColor('#000000');
            doc.text(bill.projectName, margin + halfWidth + 80, rightY); // Adjust this
            rightY += 14;
        }

// REFERENCE
        if (bill.referenceNo) {
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#334155');
            doc.text('REFERENCE :', margin + halfWidth + 25, rightY);

            doc.font('Helvetica').fillColor('#000000');
            doc.text(bill.referenceNo, margin + halfWidth + 90, rightY); // SAME alignment
        }

        currentY += 110;

        // Items Table - Clean Design
        const tableTop = currentY;

        // Calculate dynamic column widths based on actual content
        const billItems = Array.isArray(bill.items) ? bill.items : [];

        // Set minimum widths for each column
        const minNoWidth = 30;
        const minDescWidth = 120;
        const minSacWidth = 50;
        const minQtyWidth = 45;
        const minRateWidth = 60;
        const minAmountWidth = 80;

        // Measure actual content widths
        doc.fontSize(9).font('Helvetica');
        let maxDescWidth = minDescWidth;
        let maxSacWidth = minSacWidth;
        let maxQtyWidth = minQtyWidth;
        let maxRateWidth = minRateWidth;
        let maxAmountWidth = minAmountWidth;

        billItems.forEach(item => {
            // Measure description (limit max to avoid too wide)
            const descWidth = Math.min(doc.widthOfString(item.description || ''), 200);
            maxDescWidth = Math.max(maxDescWidth, descWidth);

            // Measure SAC
            const sacWidth = doc.widthOfString(item.sacCode || '-');
            maxSacWidth = Math.max(maxSacWidth, sacWidth);

            // Measure Qty
            const qtyWidth = doc.widthOfString((item.quantity || 0).toFixed(2));
            maxQtyWidth = Math.max(maxQtyWidth, qtyWidth);

            // Measure Rate
            const rateWidth = doc.widthOfString((item.rate || 0).toFixed(2));
            maxRateWidth = Math.max(maxRateWidth, rateWidth);

            // Measure Amount (with Rs. prefix)
            const amountWidth = doc.widthOfString((item.amount || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
            maxAmountWidth = Math.max(maxAmountWidth, amountWidth);
        });

        // Add padding to measured widths
        const noColWidth = minNoWidth;
        let descColWidth = Math.ceil(maxDescWidth) + 15;
        let sacColWidth = Math.ceil(maxSacWidth) + 20;
        let qtyColWidth = Math.ceil(maxQtyWidth) + 20;
        let rateColWidth = Math.ceil(maxRateWidth) + 20;
        let amountColWidth = Math.ceil(maxAmountWidth) + 20;

        // Ensure columns fit within contentWidth
        const totalCalculatedWidth = noColWidth + descColWidth + sacColWidth + qtyColWidth + rateColWidth + amountColWidth;

        if (totalCalculatedWidth > contentWidth) {
            // Scale down if too wide - prioritize keeping Amount, Rate, Qty, SAC at calculated size
            const fixedWidth = noColWidth + sacColWidth + qtyColWidth + rateColWidth + amountColWidth;
            descColWidth = contentWidth - fixedWidth;
        } else if (totalCalculatedWidth < contentWidth) {
            // If there's extra space, distribute to description and amount columns
            const extraSpace = contentWidth - totalCalculatedWidth;
            descColWidth += Math.floor(extraSpace * 0.6);
            amountColWidth += Math.ceil(extraSpace * 0.4);
        }

        // Table header
        doc.rect(margin, tableTop, contentWidth, 24).fillAndStroke('#3b82f6', '#3b82f6');

        // Column positions (cumulative)
        const col1 = margin + 5;                                    // No.
        const col2 = margin + noColWidth;                          // Description
        const col3 = col2 + descColWidth;                          // SAC
        const col4 = col3 + sacColWidth;                           // Qty
        const col5 = col4 + qtyColWidth;                           // Rate
        const col6 = col5 + rateColWidth;                          // Amount

        // Draw vertical lines for header
        doc.strokeColor('#ffffff').lineWidth(0.5);
        doc.moveTo(margin + noColWidth, tableTop).lineTo(margin + noColWidth, tableTop + 24).stroke();
        doc.moveTo(col3, tableTop).lineTo(col3, tableTop + 24).stroke();
        doc.moveTo(col4, tableTop).lineTo(col4, tableTop + 24).stroke();
        doc.moveTo(col5, tableTop).lineTo(col5, tableTop + 24).stroke();
        doc.moveTo(col6, tableTop).lineTo(col6, tableTop + 24).stroke();

        // Table Headers
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#FFFFFF');
        doc.text('No.', col1, tableTop + 7, {width: noColWidth - 5, align: 'center'});
        doc.text('Description', col2 + 5, tableTop + 7, {width: descColWidth - 10});
        doc.text('SAC', col3 + 5, tableTop + 7, {width: sacColWidth - 10, align: 'center'});
        doc.text('Qty', col4 + 5, tableTop + 7, {width: qtyColWidth - 10, align: 'center'});
        doc.text('Rate', col5 + 5, tableTop + 7, {width: rateColWidth - 10, align: 'right'});
        doc.text('Amount', col6 + 5, tableTop + 7, {width: amountColWidth - 10, align: 'right'});

        // Table Items
        let itemY = tableTop + 24;
        doc.fontSize(9).font('Helvetica').strokeColor('#cbd5e1').lineWidth(0.5);

        bill.items.forEach((item, index) => {
            if (itemY > 680) {
                doc.addPage();
                itemY = margin;
            }

            const descHeight = doc.heightOfString(item.description, {width: descColWidth - 10});
            const rowHeight = Math.max(26, descHeight + 12);

            // Row background
            if (index % 2 === 0) {
                doc.rect(margin, itemY, contentWidth, rowHeight).fillAndStroke('#f8fafc', '#cbd5e1');
            } else {
                doc.rect(margin, itemY, contentWidth, rowHeight).fillAndStroke('#ffffff', '#cbd5e1');
            }

            // Draw vertical lines
            doc.moveTo(margin + noColWidth, itemY).lineTo(margin + noColWidth, itemY + rowHeight).stroke();
            doc.moveTo(col3, itemY).lineTo(col3, itemY + rowHeight).stroke();
            doc.moveTo(col4, itemY).lineTo(col4, itemY + rowHeight).stroke();
            doc.moveTo(col5, itemY).lineTo(col5, itemY + rowHeight).stroke();
            doc.moveTo(col6, itemY).lineTo(col6, itemY + rowHeight).stroke();

            // Item data
            doc.fillColor('#000000');
            doc.text((index + 1).toString(), col1, itemY + 8, {width: noColWidth - 5, align: 'center'});
            doc.text(item.description, col2 + 5, itemY + 8, {width: descColWidth - 10});
            doc.text(item.sacCode || '-', col3 + 5, itemY + 8, {width: sacColWidth - 10, align: 'center'});
            doc.text((item.quantity || 0).toFixed(2), col4 + 5, itemY + 8, {width: qtyColWidth - 10, align: 'center'});
            doc.text((item.rate || 0).toFixed(2), col5 + 5, itemY + 8, {width: rateColWidth - 10, align: 'right'});
            doc.text((item.amount || 0).toFixed(2), col6 + 5, itemY + 8, {width: amountColWidth - 10, align: 'right'});

            itemY += rowHeight;
        });

        // ------------------------------
// Add blank row for comments - auto-height and crisp borders
// ------------------------------
        (function () {
            // Prepare text and fonts used for measurement
            const labelText = 'Comments / Notes:';
            const notesText = (bill.notes && bill.notes.trim() !== '') ? bill.notes : '(Space for additional remarks or instructions)';

            // Label uses bold 9 (or 10 for placeholder) — set font/size before measuring
            doc.font('Helvetica-Bold').fontSize(9);
            const labelWidth = descColWidth - 10;  // Use dynamic description column width
            const labelHeight = doc.heightOfString(labelText, {width: labelWidth});

            // Notes use normal font (or oblique for placeholder). We'll measure with same font/size you'll draw.
            if (bill.notes && bill.notes.trim() !== '') {
                doc.font('Helvetica').fontSize(9);
            } else {
                doc.font('Helvetica-Oblique').fontSize(8);
            }

            const notesAvailableWidth = contentWidth - noColWidth - 10; // Full width minus No. column
            const notesHeight = doc.heightOfString(notesText, {width: notesAvailableWidth});

            // padding: top + between label & notes + bottom
            const paddingTop = 8;
            const paddingBetween = 6;
            const paddingBottom = 8;

            const computedHeight = Math.ceil(labelHeight + paddingTop + paddingBetween + notesHeight + paddingBottom);

            // Minimum height (keeps previous look)
            const commentsRowHeight = Math.max(50, computedHeight);

            // Ensure fill is drawn first then stroke (so stroke is visible)
            doc.fillColor('#fef3c7');
            doc.rect(margin, itemY, contentWidth, commentsRowHeight).fill();

            doc.strokeColor('#cbd5e1');
            doc.rect(margin, itemY, contentWidth, commentsRowHeight).stroke();

            // Draw vertical line after No. column
            doc.moveTo(margin + noColWidth, itemY).lineTo(margin + noColWidth, itemY + commentsRowHeight).stroke();

            // Draw all column lines for comments row
            doc.moveTo(col3, itemY).lineTo(col3, itemY + commentsRowHeight).stroke();
            doc.moveTo(col4, itemY).lineTo(col4, itemY + commentsRowHeight).stroke();
            doc.moveTo(col5, itemY).lineTo(col5, itemY + commentsRowHeight).stroke();
            doc.moveTo(col6, itemY).lineTo(col6, itemY + commentsRowHeight).stroke();

            // Draw the label and notes using the same measurement choices
            if (bill.notes && bill.notes.trim() !== '') {
                doc.fontSize(9).font('Helvetica-Bold').fillColor('#92400e');
                doc.text(labelText, col2 + 5, itemY + paddingTop, {width: labelWidth});

                doc.fontSize(9).font('Helvetica').fillColor('#000000');
                // place notes below label (use labelHeight + paddingBetween)
                doc.text(bill.notes, col2 + 5, itemY + paddingTop + labelHeight + paddingBetween, {width: notesAvailableWidth});
            } else {
                // placeholder style
                doc.fontSize(10).font('Helvetica-Bold').fillColor('#92400e');
                doc.text(labelText, col2 + 5, itemY + paddingTop, {width: labelWidth});

                doc.fontSize(8).font('Helvetica-Oblique').fillColor('#78716c');
                doc.text(notesText, col2 + 5, itemY + paddingTop + labelHeight + paddingBetween, {width: notesAvailableWidth});
            }

            // advance itemY by the computed height
            itemY += commentsRowHeight;
        })();

// ------------------------------
// TOTALS, ROUND-OFF & GRAND TOTAL
// ------------------------------
        const items = Array.isArray(bill.items) ? bill.items : [];

// Compute numeric totalAmount (fallback to qty*rate if amount missing)
        const totalAmount = items.reduce((sum, it) => {
            const amt = Number(it.amount);
            if (!isNaN(amt)) return sum + amt;
            const qty = Number(it.quantity || 0);
            const rate = Number(it.rate || 0);
            return sum + (qty * rate);
        }, 0);

// Fractional part
        const fraction = totalAmount - Math.floor(totalAmount);

// Apply your rule: >.50 round up, <=.50 round down
        let autoRoundedTotal = (fraction > 0.50)
            ? Math.ceil(totalAmount)
            : Math.floor(totalAmount);

// Auto round-off
        const calculatedRoundOff = autoRoundedTotal - totalAmount;

// Use DB override if provided
        let roundUpNum = (bill.roundUp !== undefined && bill.roundUp !== null)
            ? Number(bill.roundUp)
            : calculatedRoundOff;

        if (isNaN(roundUpNum)) roundUpNum = calculatedRoundOff;

// Final values
        const grandTotal = totalAmount + roundUpNum;

// ------------------------------
// FORMATTED VALUES (with commas)
// ------------------------------
        const formattedTotal = totalAmount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        const formattedRound = (roundUpNum >= 0 ? '+' : '-') +
            Math.abs(roundUpNum).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

        const formattedGrand = grandTotal.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

// ------------------------------
// DRAW TOTALS BLOCK (aligned within table width)
// ------------------------------
        const totalsY = itemY;

// Define the totals section to be aligned within the table (right-aligned)
        const totalsBoxWidth = 200;  // Reduced width to fit better
        const totalsBoxLeft = margin + contentWidth - totalsBoxWidth;  // Right-aligned within table

        const labelX = totalsBoxLeft + 10;      // Label position with padding
        const valueWidth = 110;  // Width for value column
        const valueX = totalsBoxLeft + totalsBoxWidth - valueWidth - 5;  // Value position

        const smallRowH = 24;
        const grandRowH = 30;

// Helper: fill then stroke so stroke is drawn on top (prevents fill hiding borders)
        function fillThenStroke(x, y, w, h, fillColor, strokeColor) {
            doc.save();
            doc.fillColor(fillColor);
            doc.rect(x, y, w, h).fill();

            doc.strokeColor(strokeColor);
            doc.rect(x, y, w, h).stroke();
            doc.restore();
        }

        // TOTAL (compact box)
        fillThenStroke(totalsBoxLeft, totalsY, totalsBoxWidth, smallRowH, '#f1f5f9', '#cbd5e1');
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#334155');
        doc.text('Total', labelX, totalsY + 7);
        doc.text('Rs. ' + formattedTotal, valueX, totalsY + 7, {width: valueWidth, align: 'right'});

        // ROUND OFF (compact box)
        const roundOffY = totalsY + smallRowH;
        fillThenStroke(totalsBoxLeft, roundOffY, totalsBoxWidth, smallRowH, '#f1f5f9', '#cbd5e1');
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#334155');
        doc.text('Round Off', labelX, roundOffY + 7);
        doc.text('Rs. ' + formattedRound, valueX, roundOffY + 7, {width: valueWidth, align: 'right'});

        // GRAND TOTAL (boxed blue, limited width)
        const grandTotalY = roundOffY + smallRowH;
        doc.save();
        doc.fillColor('#1e40af');
        doc.rect(totalsBoxLeft, grandTotalY, totalsBoxWidth, grandRowH).fill();
        doc.strokeColor('#1e40af');
        doc.rect(totalsBoxLeft, grandTotalY, totalsBoxWidth, grandRowH).stroke();
        doc.restore();

        doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF');
        doc.text('GRAND TOTAL', labelX, grandTotalY + 9);
        doc.text('Rs. ' + formattedGrand, valueX, grandTotalY + 9, {width: valueWidth, align: 'right'});

        // AMOUNT IN WORDS (keeps full width area but stroke drawn after fill so border is crisp)
        currentY = grandTotalY + grandRowH + 10;
        const wordsH = 32;
        doc.fillColor('#f8fafc');
        doc.rect(margin, currentY, contentWidth, wordsH).fill();

        doc.strokeColor('#cbd5e1');
        doc.rect(margin, currentY, contentWidth, wordsH).stroke();

        doc.fontSize(8).font('Helvetica-Bold').fillColor('#334155')
            .text('Amount in Words:', margin + 10, currentY + 8);

        const amountInWords = bill.amountInWords || numberToWords(Math.round(grandTotal));
        doc.fontSize(9).font('Helvetica').fillColor('#000000')
            .text(amountInWords, margin + 10, currentY + 19, {width: contentWidth - 20});

        // update itemY to continue further drawing
        itemY = currentY + wordsH + 8;


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

        // Signature Section - Calculate dynamic spacing
        const pageHeight = doc.page.height;
        const footerReservedHeight = 40; // Reserve space for footer
        const availableSpace = pageHeight - margin - currentY - footerReservedHeight;

        // Adjust spacing based on available space
        const signatureSpacing = Math.min(20, Math.max(10, availableSpace / 4));

        currentY += boxHeight + signatureSpacing;
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#334155')
            .text('For ' + (process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO'),
                margin + contentWidth - 160, currentY, {width: 160, align: 'right'});

        const signatureLineSpacing = Math.min(25, Math.max(15, availableSpace / 5));
        currentY += signatureLineSpacing;
        doc.moveTo(margin + contentWidth - 140, currentY).lineTo(margin + contentWidth, currentY)
            .strokeColor('#2563eb').lineWidth(1.5).stroke();
        doc.fontSize(8).font('Helvetica').fillColor('#666666')
            .text('Authorized Signatory', margin + contentWidth - 140, currentY + 3, {width: 140, align: 'right'});

        // Footer Section - Calculate remaining space and position footer
        const footerSpacing = Math.min(20, Math.max(10, pageHeight - margin - currentY - footerReservedHeight));
        currentY += footerSpacing;

        doc.strokeColor('#cbd5e1').lineWidth(0.5)
            .moveTo(margin, currentY).lineTo(margin + contentWidth, currentY).stroke();

        currentY += 8;

        // Left: Thank you message
        doc.fontSize(9).font('Helvetica').fillColor('#6b7280');
        doc.text('Thank you for your business.', margin, currentY);
        doc.text('We appreciate the opportunity to serve you.', margin, currentY + 12);

        // Center: Contact info
        const centerX = margin + contentWidth / 2 - 80;
        doc.text('For service or billing queries:', centerX, currentY, {width: 160, align: 'center'});
        doc.text(`Call: ${process.env.COMPANY_PHONE || '+91-8179697191'}`, centerX, currentY + 12, {
            width: 160,
            align: 'center'
        });

        // Right: Invoice info
        const rightX = margin + contentWidth - 220;
        doc.fontSize(8);
        doc.text('This is a computer-generated invoice', rightX, currentY, {width: 220, align: 'right'});
        doc.text(`Invoice No: ${bill.billNumber}`, rightX, currentY + 12, {width: 220, align: 'right'});

        doc.end();
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({message: error.message});
    }
});

module.exports = router;