interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export const Heading = ({ level, children, className = '' }: HeadingProps) => {
  const Tag = `h${level}` as const;
  return (
    <Tag className={`heading heading-${level} ${className}`}>{children}</Tag>
  );
};
