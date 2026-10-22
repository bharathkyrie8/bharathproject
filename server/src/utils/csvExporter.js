/**
 * Safe CSV field escaper (RFC 4180 compliant)
 */
const escapeCsvField = (field) => {
  if (field === null || field === undefined) {
    return '""';
  }
  const stringValue = String(field);
  // If field contains comma, quote, or newline, escape quotes and wrap in quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return `"${stringValue}"`;
};

/**
 * Converts participant registrations array to CSV format with UTF-8 BOM
 */
const exportRegistrationsToCsv = (registrations) => {
  const headers = [
    'Registration ID',
    'Full Name',
    'Email',
    'Mobile Number',
    'Date of Birth',
    'Age',
    'Gender',
    'Blood Group',
    'T-Shirt Size',
    'Category',
    'Distance (KM)',
    'Amount (INR)',
    'Registration Status',
    'Payment ID',
    'Razorpay Order ID',
    'Payment Method',
    'Is Minor',
    'Guardian Name',
    'Guardian Phone',
    'Emergency Contact Name',
    'Emergency Contact Relation',
    'Emergency Contact Phone',
    'Street Address',
    'City',
    'State',
    'Pincode',
    'Registered Date',
    'Confirmed Date'
  ];

  const rows = registrations.map((reg) => {
    const p = reg.participant || {};
    const c = reg.categorySnapshot || {};
    const g = reg.guardian || {};
    const e = p.emergencyContact || {};
    const a = p.address || {};
    const pay = reg.paymentId || {};

    return [
      reg.registrationId || '',
      p.fullName || '',
      p.email || '',
      p.phone || '',
      p.dob ? new Date(p.dob).toISOString().split('T')[0] : '',
      p.age || '',
      p.gender || '',
      p.bloodGroup || '',
      p.tShirtSize || '',
      c.name || '',
      c.distanceKm || '',
      reg.amountDueInr || '',
      reg.status || '',
      pay.razorpayPaymentId || '',
      reg.razorpayOrderId || '',
      pay.method || '',
      g.isMinor ? 'Yes' : 'No',
      g.fullName || '',
      g.phone || '',
      e.name || '',
      e.relation || '',
      e.phone || '',
      a.street || '',
      a.city || '',
      a.state || '',
      a.pincode || '',
      reg.createdAt ? new Date(reg.createdAt).toISOString() : '',
      reg.confirmedAt ? new Date(reg.confirmedAt).toISOString() : ''
    ].map(escapeCsvField).join(',');
  });

  // Include UTF-8 BOM (\uFEFF) for Excel
  const csvContent = '\uFEFF' + [headers.map(escapeCsvField).join(','), ...rows].join('\r\n');
  return csvContent;
};

module.exports = {
  exportRegistrationsToCsv
};
