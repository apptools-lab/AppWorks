import React, { useEffect } from 'react';
import { Loading } from '@alifd/next';
import DoctorDashboard from '@appworks/doctor-ui';
import { useIntl, FormattedMessage } from 'react-intl';
import pageStore from '@/pages/Dashboard/store';
import callService from '@/callService';
import styles from './index.module.scss';

export default () => {
  const intl = useIntl();
  const [state, dispatchers] = pageStore.useModel('doctor');
  const effectsState = pageStore.useModelEffectsState('doctor');
  const { report, inited } = state;

  function handleOpenDoctor() {
    callService('common', 'executeCommand', 'doctor.scan');
  }

  useEffect(() => {
    dispatchers.getReport();
  }, []);

  return (
    <div className={styles.container}>
      <h2>
        <FormattedMessage id="web.applicationManager.Dashboard.doctor.title" />
        <span className={styles.goto} onClick={handleOpenDoctor}>
          <FormattedMessage id="web.applicationManager.Dashboard.doctor.scan" /> &gt;
        </span>
      </h2>
      <Loading className={styles.loading} visible={effectsState.getReport.isLoading || !inited}>
        <DoctorDashboard
          {...report}
          locale={{
            projectRating: intl.formatMessage({ id: 'web.applicationManager.Dashboard.doctor.projectRating' }),
            haveProblem: intl.formatMessage({ id: 'web.applicationManager.Dashboard.doctor.haveProblem' }),
            reportProblem: intl.formatMessage({ id: 'web.applicationManager.Dashboard.doctor.reportProblem' }),
            projectScale: intl.formatMessage({ id: 'web.applicationManager.Dashboard.doctor.projectScale' }),
            filesNumber: intl.formatMessage({ id: 'web.applicationManager.Dashboard.doctor.filesNumber' }),
            LoC: intl.formatMessage({ id: 'web.applicationManager.Dashboard.doctor.LoC' }),
          }}
        />
      </Loading>
    </div>
  );
};
