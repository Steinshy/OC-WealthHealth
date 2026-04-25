import './ErrorMessage.css';

interface ErrorMessageProps {
  children: React.ReactNode;
}

export const ErrorMessage = ({ children }: ErrorMessageProps) => {
  return <p className="error-message">{children}</p>;
};
