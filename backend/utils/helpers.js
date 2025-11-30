// Helper function to convert number to words (Indian format)
function numberToWords(num) {
  if (num === 0) return 'Zero';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  function convertLessThanThousand(n) {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
  }

  // Split into integer and decimal parts
  const parts = num.toFixed(2).split('.');
  const integerPart = parseInt(parts[0]);
  const decimalPart = parseInt(parts[1]);

  let result = '';

  // Indian numbering system: Crores, Lakhs, Thousands, Hundreds
  if (integerPart >= 10000000) {
    const crores = Math.floor(integerPart / 10000000);
    result += convertLessThanThousand(crores) + ' Crore ';
  }

  if (integerPart >= 100000) {
    const lakhs = Math.floor((integerPart % 10000000) / 100000);
    if (lakhs > 0) result += convertLessThanThousand(lakhs) + ' Lakh ';
  }

  if (integerPart >= 1000) {
    const thousands = Math.floor((integerPart % 100000) / 1000);
    if (thousands > 0) result += convertLessThanThousand(thousands) + ' Thousand ';
  }

  const remainder = integerPart % 1000;
  if (remainder > 0) {
    result += convertLessThanThousand(remainder);
  }

  result = result.trim() + ' Rupees';

  if (decimalPart > 0) {
    result += ' ' + convertLessThanThousand(decimalPart) + ' Paise';
  }

  return result + ' Only';
}

module.exports = { numberToWords };
