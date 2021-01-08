import React from 'react';
import DoctorDashboard from '@iceworks/doctor-ui';
import styles from './index.module.scss';

export default () => {
  return (
    <div className={styles.container}>
      <h3>Docotr</h3>
      <div>
        <DoctorDashboard filesInfo={{ lines: 0, count: 0 }} score={0} />
      </div>
    </div>
  );
};
