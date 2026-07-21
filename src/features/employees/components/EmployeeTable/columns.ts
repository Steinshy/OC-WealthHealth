import type { Employee } from '@/types';

export const EMPLOYEE_COLUMNS: { key: keyof Employee; label: string }[] = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'department', label: 'Department' },
  { key: 'dateOfBirth', label: 'Date of Birth' },
  { key: 'street', label: 'Street' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'zipCode', label: 'Zip Code' },
];
