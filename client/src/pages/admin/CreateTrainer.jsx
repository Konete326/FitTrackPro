import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ComingSoon from '../../components/common/ComingSoon';

function CreateTrainer() {
  return (
    <AdminLayout pageTitle="Create Trainer">
      <ComingSoon
        title="Create Trainer"
        description="Register a new trainer with specialization fields and credentials."
      />
    </AdminLayout>
  );
}

export default CreateTrainer;
