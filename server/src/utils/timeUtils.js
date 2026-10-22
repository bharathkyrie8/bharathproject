const { DateTime } = require('luxon');
const env = require('../config/env');

const TIMEZONE = env.timezone || 'Asia/Kolkata';

/**
 * Returns current DateTime in Asia/Kolkata timezone
 */
const getCurrentDateTime = () => {
  return DateTime.now().setZone(TIMEZONE);
};

/**
 * Parses any date string or Date object into Asia/Kolkata DateTime
 */
const toEventDateTime = (date) => {
  if (!date) return null;
  if (date instanceof Date) {
    return DateTime.fromJSDate(date).setZone(TIMEZONE);
  }
  return DateTime.fromISO(date).setZone(TIMEZONE);
};

/**
 * Calculates age in full years as of a given target date (defaults to event date: 30 Oct 2026)
 * @param {Date|string} dob - Date of birth
 * @param {Date|string} asOfDate - Target reference date (defaults to 30 Oct 2026)
 * @returns {number} age in whole years
 */
const calculateAge = (dob, asOfDate = '2026-10-30') => {
  const birthDate = toEventDateTime(dob);
  const targetDate = toEventDateTime(asOfDate);

  if (!birthDate || !birthDate.isValid) {
    throw new Error('Invalid Date of Birth provided');
  }

  const diff = targetDate.diff(birthDate, 'years').toObject();
  return Math.floor(diff.years || 0);
};

/**
 * Checks if current time is past the official registration deadline
 * Deadline: 25 October 2026 at 23:00:00 (11:00 PM) IST
 */
const isDeadlinePassed = (customDeadline = null) => {
  const now = getCurrentDateTime();
  const deadline = customDeadline
    ? toEventDateTime(customDeadline)
    : DateTime.fromObject(
        { year: 2026, month: 10, day: 25, hour: 23, minute: 0, second: 0 },
        { zone: TIMEZONE }
      );

  return now > deadline;
};

/**
 * Formats a date into human-readable IST string
 */
const formatIST = (date, format = 'dd LLL yyyy, hh:mm a') => {
  const dt = toEventDateTime(date);
  return dt ? dt.toFormat(format) + ' IST' : '';
};

module.exports = {
  TIMEZONE,
  getCurrentDateTime,
  toEventDateTime,
  calculateAge,
  isDeadlinePassed,
  formatIST
};
