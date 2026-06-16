import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ComingSoon from '../../components/common/ComingSoon';

function Achievements() {
  return (
    <DashboardLayout pageTitle="Achievements">
      <ComingSoon
        title="Achievements"
        description="View earned badges, points, and leaderboard rankings."
      />
    </DashboardLayout>
  );
}

export default Achievements;
