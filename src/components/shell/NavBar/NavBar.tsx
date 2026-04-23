import { Button } from '@/components/ui/Button';
import './NavBar.css';

interface NavBarProps {
  onClick: () => void;
  label: string;
}

export const NavBar = ({ onClick, label }: NavBarProps) => {
  return (
    <nav className="navbar">
      <Button onClick={onClick} variant="primary">
        {label}
      </Button>
    </nav>
  );
};
