import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ComingSoon from '../../components/common/ComingSoon';

function LogWorkout() {
  return (
    <DashboardLayout pageTitle="Log Workout">
      <ComingSoon
        title="Log Workout"
        description="Create a new workout with exercises, sets, reps, and duration tracking."
      />
    </DashboardLayout>
  );
}

export default LogWorkout;
