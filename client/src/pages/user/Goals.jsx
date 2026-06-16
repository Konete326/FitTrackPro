import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ComingSoon from '../../components/common/ComingSoon';

function Goals() {
  return (
    <DashboardLayout pageTitle="Goals">
      <ComingSoon
        title="Goals"
        description="Set and track fitness goals with milestones, reminders, and progress visualization."
      />
    </DashboardLayout>
  );
}

export default Goals;
