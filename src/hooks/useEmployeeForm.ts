import { useState } from 'react';
import { validateEmployee } from '@/helpers/validator';
import type { Employee } from '@/types';
import { useEmployees } from '@/context/EmployeeContext';

export const useEmployeeForm = (onSuccessCallback?: () => void) => {
  const { addEmployee } = useEmployees();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Employee>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    startDate: '',
    department: 'Sales',
    street: '',
    city: '',
    state: 'AL',
    zipCode: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, name, value } = e.target;
    const key = id || name;
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      startDate: '',
      department: 'Sales',
      street: '',
      city: '',
      state: 'AL',
      zipCode: '',
    });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateEmployee(formData);

    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce(
        (acc, error) => {
          acc[error.field] = error.message;
          return acc;
        },
        {} as Record<string, string>,
      );
      setErrors(errorMap);
      return;
    }

    addEmployee(formData);
    resetForm();

    if (onSuccessCallback) {
      onSuccessCallback();
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
