import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ComingSoon from '../../components/common/ComingSoon';

function AdminProfile() {
  return (
    <AdminLayout pageTitle="Admin Profile">
      <ComingSoon
        title="Admin Profile"
        description="View and edit your admin profile and credentials."
      />
    </AdminLayout>
  );
}

export default AdminProfile;
