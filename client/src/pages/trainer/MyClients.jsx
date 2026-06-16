import React from 'react';
import TrainerLayout from '../../layouts/TrainerLayout';
import ComingSoon from '../../components/common/ComingSoon';

function MyClients() {
  return (
    <TrainerLayout pageTitle="My Clients">
      <ComingSoon
        title="My Clients"
        description="View all assigned clients with workout history and active goals."
      />
    </TrainerLayout>
  );
}

export default MyClients;
