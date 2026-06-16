import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ComingSoon from '../../components/common/ComingSoon';

function Profile() {
  return (
    <DashboardLayout pageTitle="Profile">
      <ComingSoon
        title="Profile"
        description="View your profile picture, bio, stats, goals, and achievement badges."
      />
    </DashboardLayout>
  );
}

export default Profile;
