import React from 'react';
import { List, Button } from '@alifd/next';
import { useIntl, FormattedMessage } from 'react-intl';
import HeaderTitle from '@/components/HeaderTitle';
import CustomSwitch from '@/components/CustomSwitch';
import styles from './index.module.scss';

const LayoutConfig = ({ value, onChange: onScaffoldConfigChange }) => {
  const { layout } = value;

  const intl = useIntl();

  const handleChange = (key: string, configValue: boolean | string) => {
    layout[key] = configValue;
    onScaffoldConfigChange({ layout: { ...layout } });
  };

  const layoutStyleDataSource = [
    { name: 'brand', title: <FormattedMessage id="web.iceworksProjectCreator.customScaffold.layoutStyle.brand" /> },
    { name: 'light', title: <FormattedMessage id="web.iceworksProjectCreator.customScaffold.layoutStyle.light" /> },
    { name: 'dark', title: <FormattedMessage id="web.iceworksProjectCreator.customScaffold.layoutStyle.dark" /> },
  ];

  const listDataSource = [
    { title: <FormattedMessage id="web.iceworksProjectCreator.customScaffold.layoutConfig.logo" />, name: 'branding' },
    { title: <FormattedMessage id="web.iceworksProjectCreator.customScaffold.layoutConfig.headerAvatar" />, name: 'headerAvatar' },
    { title: <FormattedMessage id="web.iceworksProjectCreator.customScaffold.layoutConfig.footer" />, name: 'footer' },
    { title: <FormattedMessage id="web.iceworksProjectCreator.customScaffold.layoutConfig.fixedHeader" />, name: 'fixedHeader' },
  ];

  return (
    <div className={styles.container}>
      <HeaderTitle title={intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.layoutConfig.title' })} />
      <List
        className={styles.list}
        divider={false}
        size="small"
        dataSource={listDataSource}
        renderItem={(item) => (
          <List.Item
            key={item.name}
            extra={
              <CustomSwitch
                size="small"
                checked={layout[item.name]}
                onChange={(checked: boolean) => handleChange(item.name, checked)}
              />
            }
            title={item.title}
          />
        )}
      />
      <HeaderTitle title={intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.layoutStyle.title' })} />
      <Button.Group className={styles.btns} size="small">
        {
          layoutStyleDataSource.map(item => (
            <Button
              key={item.name}
              type={layout.type === item.name ? 'primary' : 'normal'}
              onClick={() => handleChange('type', item.name)}
            >
              {item.title}
            </Button>
          ))
        }
      </Button.Group>
    </div>
  );
};

export default LayoutConfig;

