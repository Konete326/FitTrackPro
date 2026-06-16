import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ComingSoon from '../../components/common/ComingSoon';

function BrowseTrainers() {
  return (
    <DashboardLayout pageTitle="Browse Trainers">
      <ComingSoon
        title="Browse Trainers"
        description="View available trainers, their specializations, and send trainer requests."
      />
    </DashboardLayout>
  );
}

export default BrowseTrainers;
