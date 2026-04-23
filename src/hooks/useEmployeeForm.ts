import { useState } from 'react';
import { validateEmployee } from '@/helpers/validator';
import type { Employee } from '@/types';
import { saveEmployee } from '@/utils/states';

export const useEmployeeForm = (onSuccessCallback?: () => void) => {
  const [showSuccess, setShowSuccess] = useState(false);
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

    saveEmployee(formData);
    setShowSuccess(true);
    resetForm();

    if (onSuccessCallback) {
      onSuccessCallback();
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

  return {
    formData,
    errors,
    showSuccess,
    handleChange,
    handleSubmit,
    closeSuccess,
    resetForm,
  };
};
