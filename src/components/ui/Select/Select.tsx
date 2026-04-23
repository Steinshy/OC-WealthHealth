interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  hasError?: boolean;
}

export const Select = ({
  children,
  hasError = false,
  className = '',
  ...props
}: SelectProps) => {
  const errorClass = hasError ? 'input-error' : '';
  return (
    <select className={`select ${errorClass} ${className}`} {...props}>
      {children}
    </select>
  );
};
