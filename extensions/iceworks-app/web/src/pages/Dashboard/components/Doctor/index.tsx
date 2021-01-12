import React from 'react';
import DoctorDashboard from '@iceworks/doctor-ui';

export default () => {
  return (
    <div>
      <h2>质量信息</h2>
      <div>
        <DoctorDashboard filesInfo={{ lines: 0, count: 0 }} score={0} />
      </div>
    </div>
  );
};
