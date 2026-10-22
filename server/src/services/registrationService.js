const Registration = require('../models/Registration');
const Category = require('../models/Category');
const { generateRegistrationId } = require('../utils/idGenerator');
const { calculateAge } = require('../utils/timeUtils');

/**
 * Validates participant eligibility, verifies duplicate rules, and creates a pending registration.
 */
const createPendingRegistration = async ({ validatedData, meta = {} }) => {
  const { categoryId, fullName, email, phone, dob, gender, bloodGroup, tShirtSize, address, emergencyContact, guardian, termsAccepted, medicalDeclarationAccepted } = validatedData;

  // 1. Fetch category from database (ensuring price is always calculated securely on backend)
  const category = await Category.findById(categoryId);
  if (!category || !category.isActive) {
    const error = new Error('The selected cycling category is not available or does not exist.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Age eligibility validation
  const calculatedAge = calculateAge(dob, '2026-10-30');
  if (calculatedAge < category.minAge) {
    const error = new Error(
      `Age eligibility criteria not met for ${category.name}. Minimum required age is ${category.minAge} years (calculated age as of event date: ${calculatedAge} years).`
    );
    error.statusCode = 400;
    throw error;
  }

  if (category.maxAge && calculatedAge > category.maxAge) {
    const error = new Error(
      `Age exceeds maximum limit for ${category.name} (Maximum age: ${category.maxAge}).`
    );
    error.statusCode = 400;
    throw error;
  }

  // 3. Slot capacity verification
  if (category.maxCapacity && category.registeredCount >= category.maxCapacity) {
    const error = new Error(`Slots for ${category.name} are completely filled.`);
    error.statusCode = 400;
    throw error;
  }

  // 4. Duplicate registration prevention:
  // Check if participant already has a CONFIRMED registration in this category
  const existingConfirmed = await Registration.findOne({
    $or: [
      { 'participant.email': email.toLowerCase() },
      { 'participant.phone': phone }
    ],
    category: category._id,
    status: 'CONFIRMED'
  });

  if (existingConfirmed) {
    const error = new Error(
      `A confirmed registration (${existingConfirmed.registrationId}) already exists for this email or phone number in ${category.name}. Duplicate registrations are not permitted.`
    );
    error.statusCode = 409;
    throw error;
  }

  // 5. Generate collision-free registration code
  let registrationId;
  let isUnique = false;
  let attempts = 0;
  while (!isUnique && attempts < 10) {
    registrationId = generateRegistrationId();
    const existing = await Registration.findOne({ registrationId });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    registrationId = `CYC-2026-${Date.now().toString(36).toUpperCase()}`;
  }

  // 6. Build Registration document
  const isMinor = calculatedAge < 18;
  const registration = new Registration({
    registrationId,
    participant: {
      fullName,
      email: email.toLowerCase(),
      phone,
      dob,
      age: calculatedAge,
      gender,
      bloodGroup,
      tShirtSize,
      address,
      emergencyContact
    },
    category: category._id,
    categorySnapshot: {
      name: category.name,
      slug: category.slug,
      distanceKm: category.distanceKm,
      timingType: category.timingType,
      priceInr: category.priceInr
    },
    guardian: {
      isMinor,
      fullName: isMinor && guardian ? guardian.fullName : undefined,
      relation: isMinor && guardian ? guardian.relation : undefined,
      phone: isMinor && guardian ? guardian.phone : undefined,
      email: isMinor && guardian ? guardian.email : undefined,
      consentGiven: isMinor && guardian ? Boolean(guardian.consentGiven) : false
    },
    consent: {
      termsAccepted,
      medicalDeclarationAccepted,
      consentTimestamp: new Date()
    },
    status: 'PENDING_PAYMENT',
    amountDueInr: category.priceInr,
    meta
  });

  await registration.save();
  return { registration, category };
};

/**
 * Look up registration by registration ID
 */
const getRegistrationById = async (registrationId) => {
  return Registration.findOne({ registrationId })
    .populate('category')
    .populate('paymentId');
};

module.exports = {
  createPendingRegistration,
  getRegistrationById
};
