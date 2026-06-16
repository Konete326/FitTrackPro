import React from 'react';
import TrainerLayout from '../../layouts/TrainerLayout';
import ComingSoon from '../../components/common/ComingSoon';

function TrainerSettings() {
  return (
    <TrainerLayout pageTitle="Trainer Settings">
      <ComingSoon
        title="Trainer Settings"
        description="Edit profile info, change password, and update trainer preferences."
      />
    </TrainerLayout>
  );
}

export default TrainerSettings;
