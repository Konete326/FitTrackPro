import React from 'react';
import TrainerLayout from '../../layouts/TrainerLayout';
import ComingSoon from '../../components/common/ComingSoon';

function TrainerDashboard() {
  return (
    <TrainerLayout pageTitle="Trainer Dashboard">
      <ComingSoon
        title="Trainer Dashboard"
        description="Overview of assigned clients, activity, workout completion rates, and recent assignments."
      />
    </TrainerLayout>
  );
}

export default TrainerDashboard;
