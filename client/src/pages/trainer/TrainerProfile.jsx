import React from 'react';
import TrainerLayout from '../../layouts/TrainerLayout';
import ComingSoon from '../../components/common/ComingSoon';

function TrainerProfile() {
  return (
    <TrainerLayout pageTitle="Trainer Profile">
      <ComingSoon
        title="Trainer Profile"
        description="View and edit your trainer profile, specialization, and credentials."
      />
    </TrainerLayout>
  );
}

export default TrainerProfile;
