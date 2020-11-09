import React from 'react';
import { useIntl } from 'react-intl';
import HeaderTitle from '@/components/HeaderTitle';
import { Input, Select, Form } from '@alifd/next';
import { CUSTOM_THEME_SELECT_VALUE } from '../../constants';
import styles from './index.module.scss';

const StyleConfig = ({ onChange, value }) => {
  const intl = useIntl();

  const themesList = [
    { value: '@alifd/theme-design-pro', label: '@alifd/theme-design-pro' },
    { value: '@alifd/theme-1', label: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.theme.theme-1.label' }) },
    { value: '@alifd/theme-2', label: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.theme.theme-2.label' }) },
    { value: '@alifd/theme-3', label: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.theme.theme-3.label' }) },
    { value: '@alifd/theme-4', label: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.theme.theme-4.label' }) },
    { value: CUSTOM_THEME_SELECT_VALUE, label: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.theme.customTheme.label' }) },
  ];

  function onFormChange(values) {
    onChange(values);
  }
  return (
    <div className={styles.scaffoldConfig}>
      <Form value={value} onChange={onFormChange} labelTextAlign="left" size="medium">
        <Form.Item label={<HeaderTitle title={intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.theme.title' })} />}>
          <Select
            name="theme"
            placeholder={intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.theme.placeHolder.content' })}
            style={{ width: '100%' }}
          >
            {themesList.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {value.theme === CUSTOM_THEME_SELECT_VALUE && (
          <Form.Item
            label=" "
          >
            <Input
              name="customTheme"
              placeholder={intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.customTheme.placeholder' })}
            />
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default StyleConfig;
