import React from 'react';
import { useIntl } from 'react-intl';
import { Checkbox } from '@alifd/next';
import HeaderTitle from '@/components/HeaderTitle';
import styles from './index.module.scss';

const AdvanceConfig = () => {
  const intl = useIntl();

  const advanceConfigsList = [
    { value: 'typescript', label: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.advanceConfig.typescript.label' }) },
    { value: 'i18n', label: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.advanceConfig.i18n.label' }) },
    { value: 'auth', label: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.advanceConfig.auth.label' }) },
    { value: 'store', label: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.advanceConfig.store.label' }) },
    { value: 'mock', label: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.advanceConfig.mock.label' }) },
  ];

  return (
    <div className={styles.container}>
      <HeaderTitle title={intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.layoutComponent.title' })} />
      <div className={styles.content}>
        <Checkbox.Group name="config" itemDirection="ver">
          {
            advanceConfigsList.map(config => (
              <Checkbox value={config.value} key={config.value}>{config.label}</Checkbox>
            ))
          }
        </Checkbox.Group>
      </div>
    </div>
  );
};

export default AdvanceConfig;
