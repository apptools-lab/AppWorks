import React from 'react';
import { Loading } from '@alifd/next';
import { useRequest } from 'ahooks';
import callService from '@/callService';
import ServerError from '@/components/ServerError';
import TransformReport from '../TransformReport';
import styles from './index.module.scss';

const CodeModReport = ({ name, transformsReport = [], setTransformReport }) => {
  const { loading, error } = useRequest((f) => callService('codemod', 'runTransformsUpdate', f), { initialData: [], manual: true });
  // async function runTransforms() {
  //   const updatedReports = await run(transformsReport);
  //   const newTransformsReports = transformsReport.map(transformReport => {
  //     const updatedReport = updatedReports.find(({ filePath }) => filePath === transformReport.filePath);
  //     const newFiles = updatedReport ? updateTransformReportFiles(transformReport.files, updatedReport.files) : transformReport.files;
  //     return {
  //       ...transformReport,
  //       files: newFiles,
  //     };
  //   });
  //   setTransformsReport(newTransformsReports);
  // }

  return (
    <div className={styles.wrap}>
      {/* <div
        className={classNames({
          [styles.title]: true,
          [styles.header]: true,
        })}
      >
        <div>
          {name}
        </div>
        <Button type="secondary" className={styles.btn} onClick={runTransforms}>
          Update All
        </Button>
      </div> */}
      <Loading visible={loading} className={styles.transformList} tip="Updating...">
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
