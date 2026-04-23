import { FormField } from '@/components/patterns';
import { Button } from '@/components/ui/Button';
import { useEmployeeForm } from '@/hooks';
import { departments } from '@/utils/states';
import { AddressFieldset } from './AddressFieldset';
import './EmployeeForm.css';

interface EmployeeFormProps {
  onSuccess?: () => void;
}

export const EmployeeForm = ({ onSuccess }: EmployeeFormProps) => {
  const { formData, errors, handleChange, handleSubmit } =
    useEmployeeForm(onSuccess);

  return (
    <form onSubmit={handleSubmit} id="create-employee">
      <FormField
        label="First Name"
        id="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
        error={errors.firstName}
      />

      <FormField
        label="Last Name"
        id="lastName"
        value={formData.lastName}
        onChange={handleChange}
        required
        error={errors.lastName}
      />

      <FormField
        label="Date of Birth"
        id="dateOfBirth"
        as="date"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required
        error={errors.dateOfBirth}
      />

      <FormField
        label="Start Date"
        id="startDate"
        as="date"
        value={formData.startDate}
        onChange={handleChange}
        required
        error={errors.startDate}
      />

      <AddressFieldset
        formData={formData}
        errors={errors}
        onChange={handleChange}
      />

      <FormField
        label="Department"
        id="department"
        as="select"
        value={formData.department}
        onChange={handleChange}
        required
        error={errors.department}
      >
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </FormField>

      <Button type="submit" variant="primary">
        Save
      </Button>
    </form>
  );
};
