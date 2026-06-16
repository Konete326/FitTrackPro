import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ComingSoon from '../../components/common/ComingSoon';

function ProgressTracking() {
  return (
    <DashboardLayout pageTitle="Progress">
      <ComingSoon
        title="Progress Tracking"
        description="Log body measurements, performance metrics, and progress photos to track your fitness journey."
      />
    </DashboardLayout>
  );
}

export default ProgressTracking;
