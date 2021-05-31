import React from 'react';
import { Loading } from '@alifd/next';
import { useIntl } from 'react-intl';
import { useRequest } from 'ahooks';
import callService from '@/callService';
import ServerError from '@/components/ServerError';
import TransformReport from '../TransformReport';
import styles from './index.module.scss';

const CodeModReport = ({ name, transformsReport = [], setTransformReport }) => {
  const intl = useIntl();
  const { loading, error } = useRequest((f) => callService('codemod', 'runTransformsUpdate', f), { initialData: [], manual: true });
  return (
    <div className={styles.wrap}>
      <Loading visible={loading} className={styles.transformList} tip={intl.formatMessage({ id: 'web.codemod.updating' })}>
        {
          transformsReport.map((transformReport) => {
            return (
              <TransformReport
                name={name}
                key={transformReport.name}
                transformReport={transformReport}
                setTransformReport={setTransformReport}
              />
            );
          })
        }
        { error && <ServerError /> }
      </Loading>
    </div>
  );
};

export default CodeModReport;
