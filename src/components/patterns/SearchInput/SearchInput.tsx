import './SearchInput.css';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchChange?: (value: string) => void;
}

export const SearchInput = ({
  onSearchChange,
  onChange,
  ...props
}: SearchInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange?.(value);
    onChange?.(e);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search employees..."
        className="search-input"
        onChange={handleChange}
        {...props}
      />
    </div>
  );
};
