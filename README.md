# AC Service Billing & Management System

A comprehensive web application for managing AC service operations, work orders, and bill generation for businesses like Sattva and other multi-location clients.

![AC Service Billing](https://img.shields.io/badge/Version-1.0.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?logo=express)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)

## 🌟 Features

### 📋 Core Functionality
- **Customer Management** - Manage multiple customers with their details, GST numbers, and contact information
- **Camp/Location Management** - Each customer can have multiple service camps/locations
- **Work Order Management** - Upload and manage work order PDFs with automatic data extraction
- **Invoice Generation** - Auto-generate invoices in your custom format with auto-incrementing numbers
- **PDF Export** - Download professional invoices matching your exact bill format

### 🎯 Key Highlights
- ✅ **Auto-Increment Invoice Numbers** - Financial year-based numbering (e.g., 2025-26/001, 2025-26/002)
- ✅ **Custom Bill Format** - Matches your exact invoice template with company details
- ✅ **Work Order Upload** - PDF upload with text extraction
- ✅ **Indian Numbering System** - Amount in words conversion (Rupees, Lakhs, Crores)
- ✅ **Professional UI** - Modern, responsive design with service showcase
- ✅ **Bank Details Integration** - Automatic inclusion of bank account details in invoices
- ✅ **Multi-Location Support** - Handle multiple camps per customer

## 🚀 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **PDFKit** - PDF generation
- **pdf-parse** - PDF text extraction
- **Multer** - File upload handling

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Step 1: Clone or Navigate to the Project
```bash
cd ac-service-billing
```

### Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your details:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ac-service-billing
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development

# Company Details
COMPANY_NAME=MEEGADA PICHESWARA RAO
COMPANY_PAN=DJYPM4672Q
COMPANY_PHONE=+91-8179697191
COMPANY_EMAIL=info@acservice.com

# Bill Address (for invoices/bills)
COMPANY_BILL_ADDRESS=D.No.2-12, Kollapalem, Kaja, Krishna DT, Andhra Pradesh - 521150

# Office Address (for website)
COMPANY_OFFICE_ADDRESS=Plot no-721, Huda Colony, Chanda Nagar, Hyderabad-500050

# Bank Details
BANK_ACCOUNT_NAME=M Picheswara Rao
BANK_ACCOUNT_NO=782701505244
BANK_IFSC=ICIC0007827
BANK_BRANCH=Salarpuria Sattva

# Default Payment Terms
PAYMENT_TERMS=30 Days credit
```

5. Start MongoDB (if not running):
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

6. Start the backend server:
```bash
npm run dev
# or
npm start
```

The backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🎨 Application Structure

```
ac-service-billing/
├── backend/
│   ├── models/           # Database models
│   │   ├── Bill.js
│   │   ├── Camp.js
│   │   ├── Customer.js
│   │   └── WorkOrder.js
│   ├── routes/           # API routes
│   │   ├── bills.js
│   │   ├── camps.js
│   │   ├── company.js
│   │   ├── customers.js
│   │   └── workorders.js
│   ├── utils/            # Utility functions
│   │   ├── helpers.js
│   │   └── invoiceNumber.js
│   ├── uploads/          # Uploaded files
│   ├── .env.example      # Environment template
│   ├── package.json
│   └── server.js         # Entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/   # Reusable components
    │   │   └── Navbar.js
    │   ├── pages/        # Page components
    │   │   ├── Bills.js
    │   │   ├── Camps.js
    │   │   ├── Customers.js
    │   │   ├── Home.js
    │   │   └── WorkOrders.js
    │   ├── services/     # API services
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    └── package.json
```

## 📖 Usage Guide

### 1. Setting Up Company Details
- Update the `.env` file in the backend with your company information
- Restart the backend server after changes

### 2. Managing Customers
1. Navigate to **Customers** page
2. Click **Add Customer**
3. Fill in customer details (Name, Email, Phone, Address, GST Number)
4. Save

### 3. Adding Service Camps
1. Navigate to **Camps** page
2. Click **Add Camp**
3. Select customer and fill camp details
4. Save

### 4. Uploading Work Orders
1. Navigate to **Work Orders** page
2. Click **Upload Work Order**
3. Fill in work order details:
   - Work Order Number
   - Select Customer and Camp
   - Service Date
   - Upload PDF file
4. The system will extract text from the PDF automatically
5. Save

### 5. Generating Bills
1. Navigate to **Bills** page
2. Click **Create Bill**
3. The invoice number is **auto-generated** based on financial year
4. Select a work order (optional) - this auto-fills details
5. Or manually enter:
   - Customer WO Number and Date
   - Project Name and Reference
   - Customer details
   - Service items with SAC code, quantity, rate
6. Review totals (automatically calculated)
7. **Amount in words is auto-generated**
8. Save and download PDF

### 6. Invoice Numbering System
- Format: `YYYY-YY/NNN` (e.g., `2025-26/001`)
- Financial year runs from April to March (Indian FY)
- Auto-increments within each financial year
- Resets to 001 when financial year changes

**Examples:**
- April 2025: `2025-26/001`
- March 2026: `2025-26/150`
- April 2026: `2026-27/001` (new year, resets)

### 7. Downloading Bills
- Click **Download PDF** button on any bill
- PDF will be generated in your custom format
- Includes all company details, bank information, and payment terms

## 🔧 Customization

### Updating Service List
Edit `backend/routes/company.js`:
```javascript
services: [
  'AC Installation',
  'AC Repair & Maintenance',
  'Your New Service',
  // Add more services
]
```

### Changing Bill Format
Edit `backend/routes/bills.js` in the PDF generation section to modify:
- Layout and positioning
- Font sizes and styles
- Additional fields
- Company logo (requires adding image support)

### Updating Service Images
Edit `frontend/src/pages/Home.js`:
```javascript
const serviceImages = {
  'AC Installation': '/images/your-image.jpg',
  // Update with your image paths
};
```

## 🆓 Free Hosting Options

### Backend Hosting
- **Render** - https://render.com (Free tier available)
- **Railway** - https://railway.app (Free trial)
- **Cyclic** - https://www.cyclic.sh (Free tier)

### Frontend Hosting
- **Vercel** - https://vercel.com (Free)
- **Netlify** - https://www.netlify.com (Free)
- **GitHub Pages** - https://pages.github.com (Free)

### Database Hosting
- **MongoDB Atlas** - https://www.mongodb.com/cloud/atlas (Free tier: 512MB)

### Deployment Steps

#### Deploy Backend to Render:
1. Create account on Render
2. New → Web Service
3. Connect your GitHub repository
4. Build Command: `cd backend && npm install`
5. Start Command: `cd backend && npm start`
6. Add environment variables from `.env`

#### Deploy Frontend to Vercel:
1. Create account on Vercel
2. Import repository
3. Root Directory: `frontend`
4. Build Command: `npm run build`
5. Update API URL in frontend to point to Render backend

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod           # Linux
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

### PDF Generation Issues
- Ensure `uploads/` directory exists in backend
- Check file permissions
- Verify PDFKit is installed correctly

### Invoice Number Not Auto-Generating
- Check MongoDB connection
- Verify `invoiceNumber.js` utility exists
- Check browser console for errors

## 📝 API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Camps
- `GET /api/camps` - Get all camps
- `GET /api/camps?customerId=xxx` - Get camps by customer
- `POST /api/camps` - Create camp
- `PUT /api/camps/:id` - Update camp
- `DELETE /api/camps/:id` - Delete camp

### Work Orders
- `GET /api/workorders` - Get all work orders
- `POST /api/workorders` - Upload work order (multipart/form-data)
- `PUT /api/workorders/:id` - Update work order
- `DELETE /api/workorders/:id` - Delete work order

### Bills
- `GET /api/bills` - Get all bills
- `GET /api/bills/next-invoice-number` - Get next invoice number
- `GET /api/bills/:id` - Get single bill
- `GET /api/bills/:id/pdf` - Download bill PDF
- `POST /api/bills` - Create bill
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill

### Company
- `GET /api/company` - Get company details

## 🤝 Contributing

This is a private project for AC service business management. For support or modifications, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 👨‍💻 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Contact support at: info@acservice.com

## 🔒 Security Notes

- Never commit `.env` file to version control
- Change default JWT_SECRET in production
- Use strong passwords for MongoDB
- Enable MongoDB authentication in production
- Use HTTPS in production deployment
- Regularly backup your database

## 📊 Database Schema

### Customer
```javascript
{
  name: String,
  email: String,
  phone: String,
  address: String,
  gstNumber: String,
  contactPerson: String,
  isActive: Boolean
}
```

### Camp
```javascript
{
  customer: ObjectId,
  campName: String,
  location: String,
  address: String,
  contactPerson: String,
  contactPhone: String,
  numberOfUnits: Number,
  isActive: Boolean
}
```

### Work Order
```javascript
{
  workOrderNumber: String,
  customer: ObjectId,
  camp: ObjectId,
  serviceDate: Date,
  pdfFile: { filename, path, originalName },
  extractedData: Mixed,
  services: [{ description, sacCode, unit, quantity, rate, amount }],
  projectName: String,
  referenceNo: String,
  status: String
}
```

### Bill
```javascript
{
  billNumber: String,
  workOrder: ObjectId,
  customer: ObjectId,
  camp: ObjectId,
  billDate: Date,
  customerWONumber: String,
  customerWODate: Date,
  projectName: String,
  referenceNo: String,
  items: [{ description, sacCode, unit, quantity, rate, amount }],
  totalAmount: Number,
  roundUp: Number,
  grandTotal: Number,
  amountInWords: String,
  paymentTerms: String,
  status: String
}
```

---

**Built with ❄️ for AC Service Excellence**
