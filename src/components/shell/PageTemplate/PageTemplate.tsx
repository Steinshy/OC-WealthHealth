import { Heading } from '@/components/ui/Heading';
import './PageTemplate.css';

interface PageTemplateProps {
  pageHeading: string;
  children: React.ReactNode;
}

export const PageTemplate = ({ pageHeading, children }: PageTemplateProps) => {
  return (
    <div className="page-container">
      <Heading>{pageHeading}</Heading>
      {children}
    </div>
  );
};
