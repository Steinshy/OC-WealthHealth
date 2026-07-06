import { Label } from '@/components/ui/Label';
import { TextInput } from '@/components/ui/TextInput';
import { Select } from '@/components/ui/Select';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import './FormField.css';

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  as?: 'text' | 'date' | 'number' | 'select';
  children?: React.ReactNode;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  required?: boolean;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
}

export const FormField = ({
  label,
  id,
  error,
  as = 'text',
  children,
  value,
  onChange,
  required,
  inputMode,
}: FormFieldProps) => {
  return (
    <div className="form-group">
      <Label htmlFor={id}>{label}</Label>
      {as === 'select' ? (
        <Select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          hasError={!!error}
        >
          {children}
        </Select>
      ) : (
        <TextInput
          id={id}
          name={id}
          type={as}
          value={value}
          onChange={onChange}
          required={required}
          inputMode={inputMode}
          hasError={!!error}
        />
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};
