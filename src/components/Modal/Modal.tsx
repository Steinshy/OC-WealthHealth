import { useEffect, useRef } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  autoCloseDuration?: number;
}

export const Modal = ({ isOpen, onClose, children, autoCloseDuration = 1500 }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus modal for accessibility
      modalRef.current?.focus();

      const timer = setTimeout(onClose, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseDuration]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content" ref={modalRef} tabIndex={-1}>
        {children}
      </div>
    </div>
  );
};
