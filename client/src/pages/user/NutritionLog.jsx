import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ComingSoon from '../../components/common/ComingSoon';

function NutritionLog() {
  return (
    <DashboardLayout pageTitle="Nutrition">
      <ComingSoon
        title="Nutrition Log"
        description="Log daily meals, track macros (calories, protein, carbs, fat), and search the food database."
      />
    </DashboardLayout>
  );
}

export default NutritionLog;
