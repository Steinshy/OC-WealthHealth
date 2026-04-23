import { Heading } from '@/components/ui/Heading';
import './PageTitle.css';

interface PageTitleProps {
  title?: string;
}

export const PageTitle = ({ title = 'HRnet' }: PageTitleProps) => {
  return (
    <div className="title">
      <Heading level={1}>{title}</Heading>
    </div>
  );
};
