import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ComingSoon from '../../components/common/ComingSoon';

function UserManagement() {
  return (
    <AdminLayout pageTitle="User Management">
      <ComingSoon
        title="User Management"
        description="View, create, edit, deactivate, and delete users. Assign trainers and perform bulk actions."
      />
    </AdminLayout>
  );
}

export default UserManagement;
