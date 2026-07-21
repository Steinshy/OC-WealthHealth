import './Heading.css';

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3;
}

export const Heading = ({
  children,
  className = '',
  level = 1,
}: HeadingProps) => {
  const Tag = `h${level}` as const;
  return (
    <Tag className={className ? `heading ${className}` : 'heading'}>
      {children}
    </Tag>
  );
};
