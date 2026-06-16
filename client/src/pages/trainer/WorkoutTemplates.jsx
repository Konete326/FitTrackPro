import React from 'react';
import TrainerLayout from '../../layouts/TrainerLayout';
import ComingSoon from '../../components/common/ComingSoon';

function WorkoutTemplates() {
  return (
    <TrainerLayout pageTitle="Workout Templates">
      <ComingSoon
        title="Workout Templates"
        description="Create reusable workout templates, mark as public, and assign to clients."
      />
    </TrainerLayout>
  );
}

export default WorkoutTemplates;
