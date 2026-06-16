import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ComingSoon from '../../components/common/ComingSoon';

function AssignedTrainers() {
  return (
    <AdminLayout pageTitle="Assigned Trainers">
      <ComingSoon
        title="Assigned Trainers"
        description="View all trainer-client assignments across the platform."
      />
    </AdminLayout>
  );
}

export default AssignedTrainers;
