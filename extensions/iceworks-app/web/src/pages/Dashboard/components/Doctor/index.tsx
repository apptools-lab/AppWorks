import React from 'react';
import DoctorDashboard from '@iceworks/doctor-ui';
import { useIntl, FormattedMessage } from 'react-intl';

export default () => {
  const intl = useIntl();

  return (
    <div>
      <h2>
        <FormattedMessage id="web.iceworksApp.Dashboard.doctor.title" />
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
