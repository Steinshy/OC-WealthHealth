import { NavBar } from '../NavBar';
import { PageTitle } from '../PageTitle';
import { Heading } from '@/components/ui/Heading';
import './PageTemplate.css';

interface PageTemplateProps {
  pageHeading: string;
  navLabel: string;
  onNavClick: () => void;
  children: React.ReactNode;
}

export const PageTemplate = ({
  pageHeading,
  navLabel,
  onNavClick,
  children,
}: PageTemplateProps) => {
  return (
    <div className="container">
      <PageTitle />
      <NavBar label={navLabel} onClick={onNavClick} />
      <Heading level={2}>{pageHeading}</Heading>
      {children}
    </div>
  );
};
