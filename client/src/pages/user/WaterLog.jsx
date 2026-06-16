import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ComingSoon from '../../components/common/ComingSoon';

function WaterLog() {
  return (
    <DashboardLayout pageTitle="Water Intake">
      <ComingSoon
        title="Water Log"
        description="Track daily water intake with quick-add buttons and visual progress towards your hydration goal."
      />
    </DashboardLayout>
  );
}

export default WaterLog;
