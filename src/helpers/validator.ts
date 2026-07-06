import type { Employee } from '../types';

interface ValidationError {
  field: string;
  message: string;
}

// Text fields that must contain more than whitespace ("required" alone accepts " ")
const REQUIRED_TEXT_FIELDS: { field: keyof Employee; label: string }[] = [
  { field: 'firstName', label: 'First name' },
  { field: 'lastName', label: 'Last name' },
  { field: 'street', label: 'Street' },
  { field: 'city', label: 'City' },
];

// Validates zip code format (must be exactly 5 digits)
const validateZipCode = (zipCode: string): ValidationError | null => {
  if (!/^\d{5}$/.test(zipCode)) {
    return {
      field: 'zipCode',
      message: 'Zip code must be exactly 5 digits',
    };
  }
  return null;
};

// Validates date of birth (must be in the past)
const validateDateOfBirth = (dateOfBirth: string): ValidationError | null => {
  const dob = new Date(dateOfBirth);
  const now = new Date();

  if (Number.isNaN(dob.getTime()) || dob >= now) {
    return {
      field: 'dateOfBirth',
      message: 'Date of birth must be in the past',
    };
  }
  return null;
};

// Validates start date (must be after date of birth)
const validateStartDate = (
  startDate: string,
  dateOfBirth: string,
): ValidationError | null => {
  const startDateObj = new Date(startDate);
  const dobObj = new Date(dateOfBirth);

  if (Number.isNaN(startDateObj.getTime()) || startDateObj <= dobObj) {
    return {
      field: 'startDate',
      message: 'Start date must be after date of birth',
    };
  }
  return null;
};

// Validates entire employee form and returns an array of validation errors (empty if valid)
export const validateEmployee = (employee: Employee): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate required text fields
  for (const { field, label } of REQUIRED_TEXT_FIELDS) {
    if (!employee[field].trim()) {
      errors.push({ field, message: `${label} is required` });
    }
  }

  // Validate zip code
  const zipError = validateZipCode(employee.zipCode);
  if (zipError) errors.push(zipError);

  // Validate date of birth
  const dobError = validateDateOfBirth(employee.dateOfBirth);
  if (dobError) errors.push(dobError);

  // Validate start date (only if dob is valid)
  if (!dobError) {
    const startDateError = validateStartDate(
      employee.startDate,
      employee.dateOfBirth,
    );
    if (startDateError) errors.push(startDateError);
  }

  return errors;
};
