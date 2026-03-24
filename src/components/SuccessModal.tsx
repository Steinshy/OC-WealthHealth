import { useEffect } from 'react';
import '../styles/modal.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Employee Created!</p>
      </div>
    </div>
  );
};
