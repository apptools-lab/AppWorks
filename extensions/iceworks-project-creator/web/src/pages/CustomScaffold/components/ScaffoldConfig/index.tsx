import React from 'react';
import HeaderTitle from '@/components/HeaderTitle';
import { Checkbox, Input, Select, Form } from '@alifd/next';
import { themesList, configsList, CUSTOM_THEME_SELECT_KEY } from '../../constants';
import styles from './index.module.scss';


const ScaffoldConfig = ({ onChange, value }) => {
  function onFormChange(values) {
    onChange(values);
  }
  return (
    <div className={styles.scaffoldConfig}>
      <Form value={value} onChange={onFormChange} labelTextAlign="left" size="medium">
        <Form.Item label={<HeaderTitle title="主题包" />}>
          <Select
            name="theme"
            placeholder="请选择主题包"
            style={{ width: '100%' }}
          >
            {themesList.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {value.theme === CUSTOM_THEME_SELECT_KEY && (
          <Form.Item
            label=" "
          >
            <Input
              name="customTheme"
              placeholder=""
            />
          </Form.Item>
        )}
        <Form.Item label={<HeaderTitle title="高级" />}>
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
