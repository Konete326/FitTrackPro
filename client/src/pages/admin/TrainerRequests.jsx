import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ComingSoon from '../../components/common/ComingSoon';

function TrainerRequests() {
  return (
    <AdminLayout pageTitle="Trainer Requests">
      <ComingSoon
        title="Trainer Requests"
        description="View pending trainer requests from users. Approve or reject with admin notes."
      />
    </AdminLayout>
  );
}

export default TrainerRequests;
