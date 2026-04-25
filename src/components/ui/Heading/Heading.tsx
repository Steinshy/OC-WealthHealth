import './Heading.css';

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export const Heading = ({ children, className = '' }: HeadingProps) => {
  return (
    <h1 className={className ? `heading ${className}` : 'heading'}>
      {children}
    </h1>
  );
};
