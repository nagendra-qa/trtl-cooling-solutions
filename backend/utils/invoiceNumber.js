const Bill = require('../models/Bill');

// Function to generate next invoice number based on financial year
async function generateInvoiceNumber() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 0-11, so add 1

  // Financial year in India runs from April to March
  let financialYear;
  if (currentMonth >= 4) {
    // April to December - current year to next year
    const startYear = currentDate.getFullYear();
    const endYear = currentDate.getFullYear() + 1;
    financialYear = `${startYear}-${endYear.toString().substring(2)}`;
  } else {
    // January to March - previous year to current year
    const startYear = currentDate.getFullYear() - 1;
    const endYear = currentDate.getFullYear();
    financialYear = `${startYear}-${endYear.toString().substring(2)}`;
  }

  // Find the latest bill for this financial year
  const latestBill = await Bill.findOne({
    billNumber: { $regex: `^${financialYear}/` }
  }).sort({ createdAt: -1 }).limit(1);

  let nextNumber = 1;
  if (latestBill && latestBill.billNumber) {
    // Extract the number part from the bill number
    const parts = latestBill.billNumber.split('/');
    if (parts.length === 2) {
      const lastNumber = parseInt(parts[1]);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
  }

  // Format number with leading zeros (e.g., 001, 002, etc.)
  const formattedNumber = String(nextNumber).padStart(3, '0');

  return `${financialYear}/${formattedNumber}`;
}

module.exports = { generateInvoiceNumber };
