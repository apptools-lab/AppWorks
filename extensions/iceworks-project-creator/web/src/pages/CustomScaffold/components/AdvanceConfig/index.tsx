import React from 'react';
import { useIntl } from 'react-intl';
import { List } from '@alifd/next';
import CustomSwitch from '@/components/CustomSwitch';
import HeaderTitle from '@/components/HeaderTitle';
import styles from './index.module.scss';

const AdvanceConfig = ({ value, onChange: onScaffoldConfigChange }) => {
  const intl = useIntl();
  const { advance } = value;

  const advanceConfigsDataSource = [
    { name: 'typescript', title: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.advanceConfig.typescript.label' }) },
    { name: 'i18n', title: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.advanceConfig.i18n.label' }) },
    { name: 'auth', title: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.advanceConfig.auth.label' }) },
    { name: 'store', title: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.advanceConfig.store.label' }) },
    { name: 'mock', title: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.advanceConfig.mock.label' }) },
  ];

  const handleChange = (key: string, configValue: boolean) => {
    advance[key] = configValue;
    onScaffoldConfigChange({ layout: { ...advance } });
  };
  return (
    <div className={styles.container}>
      <HeaderTitle title={intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.layoutComponent.title' })} />
      <List
        className={styles.list}
        divider={false}
        size="small"
        dataSource={advanceConfigsDataSource}
        renderItem={(item) => (
          <List.Item
            key={item.name}
            extra={
              <CustomSwitch
                checked={advance[item.name]}
                onChange={(checked: boolean) => handleChange(item.name, checked)}
              />
            }
            title={item.title}
          />
        )}
      />
    </div>
  );
};

export default AdvanceConfig;
