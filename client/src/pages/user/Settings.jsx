import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ComingSoon from '../../components/common/ComingSoon';

function Settings() {
  return (
    <DashboardLayout pageTitle="Settings">
      <ComingSoon
        title="Settings"
        description="Edit profile info, change password, notification preferences, and theme settings."
      />
    </DashboardLayout>
  );
}

export default Settings;
