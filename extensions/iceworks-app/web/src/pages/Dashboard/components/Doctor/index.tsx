import React from 'react';
import DoctorDashboard from '@iceworks/doctor-ui';
import { useIntl, FormattedMessage } from 'react-intl';
import callService from '@/callService';
import styles from './index.module.scss';

export default () => {
  const intl = useIntl();

  function handleOpenDoctor() {
    callService('common', 'executeCommand', 'iceworks-doctor.scan');
  }

  return (
    <div className={styles.container}>
      <h2>
        <FormattedMessage id="web.iceworksApp.Dashboard.doctor.title" />
        <span className={styles.goto} onClick={handleOpenDoctor}>
          <FormattedMessage id="web.iceworksApp.Dashboard.doctor.scan" /> &gt;
        </span>
      </h2>
      <div>
        <DoctorDashboard
          filesInfo={{ lines: 0, count: 0 }}
          score={0}
          locale={{
            projectRating: intl.formatMessage({ id: 'web.iceworksApp.Dashboard.doctor.projectRating' }),
            haveProblem: intl.formatMessage({ id: 'web.iceworksApp.Dashboard.doctor.haveProblem' }),
            reportProblem: intl.formatMessage({ id: 'web.iceworksApp.Dashboard.doctor.reportProblem' }),
            projectScale: intl.formatMessage({ id: 'web.iceworksApp.Dashboard.doctor.projectScale' }),
            filesNumber: intl.formatMessage({ id: 'web.iceworksApp.Dashboard.doctor.filesNumber' }),
            LoC: intl.formatMessage({ id: 'web.iceworksApp.Dashboard.doctor.LoC' }),
          }}
        />
      </div>
    </div>
  );
};
