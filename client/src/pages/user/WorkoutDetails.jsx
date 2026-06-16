import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ComingSoon from '../../components/common/ComingSoon';

function WorkoutDetails() {
  return (
    <DashboardLayout pageTitle="Workout Details">
      <ComingSoon
        title="Workout Details"
        description="View and edit workout details, mark exercises complete, and track your performance."
      />
    </DashboardLayout>
  );
}

export default WorkoutDetails;
