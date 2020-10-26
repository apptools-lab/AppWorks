import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import HeaderTitle from '@/components/HeaderTitle';
import { Checkbox, Input, Select, Form } from '@alifd/next';
import { themesList, configsList, CUSTOM_THEME_SELECT_VALUE } from '../../constants';
import styles from './index.module.scss';


const ScaffoldConfig = ({ onChange, value }) => {
  const intl = useIntl();

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
        <Form.Item label={<HeaderTitle title={intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.advance.title' })} />}>
          <Checkbox.Group name="config" itemDirection="ver">
            {
              configsList.map(config => (
                <Checkbox value={config.value} key={config.value}>{config.label}</Checkbox>
              ))
            }
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ScaffoldConfig;
