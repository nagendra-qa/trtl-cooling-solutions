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

// Create work order with PDF upload
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const workOrderData = JSON.parse(req.body.data);

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
        workOrderData.extractedData = {
          text: pdfData.text,
          pages: pdfData.numpages
        };
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
