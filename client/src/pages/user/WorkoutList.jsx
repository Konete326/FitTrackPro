import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ComingSoon from '../../components/common/ComingSoon';

function WorkoutList() {
  return (
    <DashboardLayout pageTitle="Workouts">
      <ComingSoon
        title="Workout List"
        description="View all your workouts with filters, search, and detailed exercise tracking."
      />
    </DashboardLayout>
  );
}

export default WorkoutList;
