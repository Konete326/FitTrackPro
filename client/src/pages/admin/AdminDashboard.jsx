import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ComingSoon from '../../components/common/ComingSoon';

function AdminDashboard() {
  return (
    <AdminLayout pageTitle="Admin Dashboard">
      <ComingSoon
        title="Admin Dashboard"
        description="System-wide statistics, total users, trainers, workouts, growth rate, and activity feed."
      />
    </AdminLayout>
  );
}

export default AdminDashboard;
