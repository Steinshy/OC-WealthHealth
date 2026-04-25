import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { Modal, useTheme } from '@steinshy/wealthhealth-modal';
import { PageTemplate } from '@/components/shell';
import { EmployeeForm } from '@/features/employees';

export const Create = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/employees');
  };

  return (
    <PageTemplate pageHeading="Create a new employee">
      <EmployeeForm onSuccess={() => setShowModal(true)} />
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Success"
        status="success"
        autoCloseDuration={1500}
      >
        <p>Employee Created!</p>
      </Modal>
    </PageTemplate>
  );
};
