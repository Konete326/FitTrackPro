import React from 'react';
import TrainerLayout from '../../layouts/TrainerLayout';
import ComingSoon from '../../components/common/ComingSoon';

function ClientDetails() {
  return (
    <TrainerLayout pageTitle="Client Details">
      <ComingSoon
        title="Client Details"
        description="View client profile, workouts, progress, assign workouts, set goals, and send messages."
      />
    </TrainerLayout>
  );
}

export default ClientDetails;
