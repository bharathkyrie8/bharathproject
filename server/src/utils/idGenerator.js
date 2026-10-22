const crypto = require('crypto');

/**
 * Generates an uppercase alphanumeric unique registration code: CYC-2026-XXXXXX
 */
const generateRegistrationId = () => {
  const randomChars = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
  return `CYC-2026-${randomChars}`;
};

/**
 * Generates a receipt number: RCP-2026-XXXXXX
 */
const generateReceiptNumber = () => {
  const randomChars = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
  return `RCP-2026-${randomChars}`;
};

/**
 * Generates bib numbers based on category and registration sequence
 */
const generateBibNumber = (categoryPrefix, seqNumber) => {
  const prefix = (categoryPrefix || 'CYC').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `${prefix}-${String(seqNumber).padStart(4, '0')}`;
};

module.exports = {
  generateRegistrationId,
  generateReceiptNumber,
  generateBibNumber
};
