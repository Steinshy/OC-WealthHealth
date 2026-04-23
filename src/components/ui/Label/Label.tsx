interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export const Label = ({ children, className = '', ...props }: LabelProps) => {
  return (
    <label className={`label ${className}`} {...props}>
      {children}
    </label>
  );
};
