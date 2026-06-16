import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ComingSoon from '../../components/common/ComingSoon';

function TrainerManagement() {
  return (
    <AdminLayout pageTitle="Trainer Management">
      <ComingSoon
        title="Trainer Management"
        description="View all trainers, client counts, performance, and manage trainer roles."
      />
    </AdminLayout>
  );
}

export default TrainerManagement;
