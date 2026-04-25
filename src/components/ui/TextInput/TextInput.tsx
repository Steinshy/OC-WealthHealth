import './TextInput.css';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const TextInput = ({
  hasError = false,
  className = '',
  ...props
}: TextInputProps) => {
  const errorClass = hasError ? 'input-error' : '';
  return (
    <input className={`text-input ${errorClass} ${className}`} {...props} />
  );
};
