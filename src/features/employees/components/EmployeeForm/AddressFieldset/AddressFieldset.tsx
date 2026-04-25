import { FormField } from '@/components/patterns';
import { states } from '@/utils/states';
import './AddressFieldset.css';

interface AddressFieldsetProps {
  formData: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  errors: Record<string, string>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

export const AddressFieldset = ({
  formData,
  errors,
  onChange,
}: AddressFieldsetProps) => {
  return (
    <fieldset className="address-fieldset">
      <legend>Address</legend>

      <FormField
        label="Street"
        id="street"
        value={formData.street}
        onChange={onChange}
        required
        error={errors.street}
      />

      <FormField
        label="City"
        id="city"
        value={formData.city}
        onChange={onChange}
        required
        error={errors.city}
      />

      <FormField
        label="State"
        id="state"
        as="select"
        value={formData.state}
        onChange={onChange}
        required
        error={errors.state}
      >
        {states.map((state) => (
          <option key={state.abbreviation} value={state.abbreviation}>
            {state.name}
          </option>
        ))}
      </FormField>

      <FormField
        label="Zip Code"
        id="zipCode"
        value={formData.zipCode}
        onChange={onChange}
        required
        error={errors.zipCode}
      />
    </fieldset>
  );
};
