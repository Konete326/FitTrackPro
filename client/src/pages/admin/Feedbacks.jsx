import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ComingSoon from '../../components/common/ComingSoon';

function Feedbacks() {
  return (
    <AdminLayout pageTitle="Feedbacks">
      <ComingSoon
        title="Feedbacks"
        description="View all user feedback submissions and mark them as read."
      />
    </AdminLayout>
  );
}

export default Feedbacks;
