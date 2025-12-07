const express = require('express');
const router = express.Router();

// Get company details
router.get('/', (req, res) => {
  res.json({
    name: process.env.COMPANY_NAME || 'MEEGADA PICHESWARA RAO',
    pan: process.env.COMPANY_PAN || 'DJYPM4672Q',
    email: process.env.COMPANY_EMAIL || 'eshwarsvp99.com@gmail.com',
    phone: process.env.COMPANY_PHONE || '+91-8179697191',
    officeAddress: process.env.COMPANY_OFFICE_ADDRESS || 'Plot no-721, Huda Colony, Chanda Nagar, Hyderabad-500050',
    billAddress: process.env.COMPANY_BILL_ADDRESS || 'D.No.2-12, Kollapalem, Kaja, Krishna DT, Andhra Pradesh - 521150',
    bankDetails: {
      accountName: process.env.BANK_ACCOUNT_NAME || 'M Picheswara Rao',
      accountNo: process.env.BANK_ACCOUNT_NO || '782701505244',
      ifsc: process.env.BANK_IFSC || 'ICIC0007827',
      branch: process.env.BANK_BRANCH || 'Salarpuria Sattva'
    },
    paymentTerms: process.env.PAYMENT_TERMS || '30 Days credit',
    services: [
      'Split AC',
      'Window AC',
      'Cassette AC',
      'VRF AC',
      'AHU AC',
      'AC Installation',
      'AC Repair & Maintenance',
      'Preventive Maintenance (PPM)',
      'Gas Charging',
      'Strainer Cleaning',
      'Chemical Cleaning',
      'Compressor Repair',
      '24/7 Emergency Services'
    ]
  });
});

module.exports = router;
