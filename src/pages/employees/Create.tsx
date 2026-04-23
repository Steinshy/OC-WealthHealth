import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Modal } from '@steinshy/wealthhealth-modal';
import { PageTemplate } from '@/components/shell';
import { EmployeeForm } from '@/features/employees';

export const Create = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/employees');
  };

  return (
    <PageTemplate
      pageHeading="Create Employee"
      navLabel="View Current Employees"
      onNavClick={() => navigate('/employees')}
    >
      <EmployeeForm onSuccess={() => setShowModal(true)} />
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        status="success"
        autoCloseDuration={1500}
      >
        <p>Employee Created!</p>
      </Modal>
    </PageTemplate>
  );
};
