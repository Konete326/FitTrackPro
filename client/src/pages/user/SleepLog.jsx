import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ComingSoon from '../../components/common/ComingSoon';

function SleepLog() {
  return (
    <DashboardLayout pageTitle="Sleep">
      <ComingSoon
        title="Sleep Log"
        description="Track sleep/wake times, sleep quality, and view sleep trends and recommendations."
      />
    </DashboardLayout>
  );
}

export default SleepLog;
