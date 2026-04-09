import { Modal } from './Modal';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} autoCloseDuration={1500}>
    <p>Employee Created!</p>
  </Modal>
);
