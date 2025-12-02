const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const WorkOrder = require('../models/WorkOrder');
const pdfParse = require('pdf-parse');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'workorder-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Get all work orders
router.get('/', async (req, res) => {
  try {
    const { customerId, campId, status } = req.query;
    const query = {};
    if (customerId) query.customer = customerId;
    if (campId) query.camp = campId;
    if (status) query.status = status;

    const workOrders = await WorkOrder.find(query)
      .populate('customer')
      .populate('camp')
      .sort({ createdAt: -1 });
    res.json(workOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single work order
router.get('/:id', async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id)
      .populate('customer')
      .populate('camp');
    if (!workOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }
    res.json(workOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Function to extract work order details from PDF text
function extractWorkOrderData(pdfText) {
  const data = {
    workOrderNumber: '',
    workOrderDate: null,
    projectName: '',
    referenceNo: '',
    services: []
  };

  try {
    // Extract Work Order Number
    const woNumberMatch = pdfText.match(/Work\s+Order\s+No\.?\s*:?\s*(\d+)/i);
    if (woNumberMatch) {
      data.workOrderNumber = woNumberMatch[1];
    }

    // Extract WO Date (DD/MM/YYYY format)
    const woDateMatch = pdfText.match(/WO\s+Date[^\d]*(\d{2}\/\d{2}\/\d{4})/i);
    if (woDateMatch) {
      const [day, month, year] = woDateMatch[1].split('/');
      data.workOrderDate = new Date(`${year}-${month}-${day}`);
    }

    // Extract Project Name
    const projectMatch = pdfText.match(/Project\s+Name\s*:?\s*([^\n]+)/i);
    if (projectMatch) {
      data.projectName = projectMatch[1].trim();
    }

    // Extract Project Reference
    const refMatch = pdfText.match(/Project\s+Reference\s*:?\s*([^\n]+)/i);
    if (refMatch) {
      data.referenceNo = refMatch[1].trim();
    }

    // Extract service items (simplified pattern matching)
    const lines = pdfText.split('\n');
    let inItemSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Start of items section
      if (line.match(/S\.No\..*HSN.*SAC.*Code/i)) {
        inItemSection = true;
        continue;
      }

      // End of items section
      if (line.match(/Total\s+Basic\s+Amount/i)) {
        break;
      }

      // Extract item data
      if (inItemSection && line.match(/^\d+\s+\d+/)) {
        // Try to extract: S.No, SAC Code, Service Code, Description, UOM, Qty, Rate, Amount
        const itemMatch = line.match(/^(\d+)\s+(\d+)\s+[\d%]+\s+([\w.]+)\s+(.+)\s+EA\s+([\d.]+)\s+([\d.]+)\s+([\d,]+\.?\d*)/);

        if (itemMatch) {
          const [, sNo, sacCode, serviceCode, description, qty, rate, amount] = itemMatch;

          // Get next line for additional description
          let fullDescription = description.trim();
          if (i + 1 < lines.length && !lines[i + 1].match(/^\d+/)) {
            fullDescription += '\n' + lines[i + 1].trim();
          }
          if (i + 2 < lines.length && !lines[i + 2].match(/^\d+/) && !lines[i + 2].match(/Total/i)) {
            fullDescription += '\n' + lines[i + 2].trim();
          }

          data.services.push({
            description: `${serviceCode}\n${fullDescription}`,
            sacCode: sacCode,
            unit: 'EA',
            quantity: parseFloat(qty),
            rate: parseFloat(rate),
            amount: parseFloat(amount.replace(/,/g, ''))
          });
        }
      }
    }

    // Extract total amount
    const totalMatch = pdfText.match(/Total\s+Amount\s+INR\s+([\d,]+\.?\d*)/i);
    if (totalMatch) {
      data.totalAmount = parseFloat(totalMatch[1].replace(/,/g, ''));
    }

  } catch (error) {
    console.error('Error extracting data from PDF:', error);
  }

  return data;
}

// Create work order with PDF upload
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    let workOrderData = {};

    // If data is provided in body, parse it
    if (req.body.data) {
      workOrderData = JSON.parse(req.body.data);
    }

    // Add PDF file info if uploaded
    if (req.file) {
      workOrderData.pdfFile = {
        filename: req.file.filename,
        path: req.file.path,
        originalName: req.file.originalname
      };

      // Extract text from PDF
      try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);

        // Store raw extracted data
        workOrderData.extractedData = {
          text: pdfData.text,
          pages: pdfData.numpages
        };

        // Parse and extract structured data from PDF
        const extractedInfo = extractWorkOrderData(pdfData.text);

        // Auto-fill work order data from PDF
        if (extractedInfo.workOrderNumber) {
          workOrderData.workOrderNumber = extractedInfo.workOrderNumber;
        }
        if (extractedInfo.workOrderDate) {
          workOrderData.serviceDate = extractedInfo.workOrderDate;
        }
        if (extractedInfo.projectName) {
          workOrderData.projectName = extractedInfo.projectName;
        }
        if (extractedInfo.referenceNo) {
          workOrderData.referenceNo = extractedInfo.referenceNo;
        }
        if (extractedInfo.services && extractedInfo.services.length > 0) {
          workOrderData.services = extractedInfo.services;
        }
        if (extractedInfo.totalAmount) {
          workOrderData.totalAmount = extractedInfo.totalAmount;
        }

      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
      }
    }

    const workOrder = new WorkOrder(workOrderData);
    const newWorkOrder = await workOrder.save();
    const populatedWorkOrder = await WorkOrder.findById(newWorkOrder._id)
      .populate('customer')
      .populate('camp');

    res.status(201).json(populatedWorkOrder);
  } catch (error) {
    console.error('Create work order error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update work order
router.put('/:id', async (req, res) => {
  try {
    const workOrder = await WorkOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('customer').populate('camp');

    if (!workOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }
    res.json(workOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete work order
router.delete('/:id', async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);
    if (!workOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }

    // Delete associated PDF file
    if (workOrder.pdfFile && workOrder.pdfFile.path) {
      if (fs.existsSync(workOrder.pdfFile.path)) {
        fs.unlinkSync(workOrder.pdfFile.path);
      }
    }

    await WorkOrder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Work order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
