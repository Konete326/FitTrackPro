import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ComingSoon from '../../components/common/ComingSoon';

function AdminSettings() {
  return (
    <AdminLayout pageTitle="Admin Settings">
      <ComingSoon
        title="Admin Settings"
        description="Edit profile info, change password, and admin preferences."
      />
    </AdminLayout>
  );
}

export default AdminSettings;
