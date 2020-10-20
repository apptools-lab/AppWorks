import React from 'react';
import HeaderTitle from '@/components/HeaderTitle';
import { Checkbox, Input, Select, Form } from '@alifd/next';
import styles from './index.module.scss';

const configsList = [
  { value: 'typescript', label: '使用 TypeScript' },
  { value: 'i18n', label: '国际化示例' },
  { value: 'auth', label: '权限管理示例' },
  { value: 'store', label: '状态管理示例' },
  { value: 'mock', label: 'Mock 示例' },
];
const CUSTOM_THEME_SELECT_KEY = '自定义主题包';
const themesList = [
  '@alifd/theme-design-pro',
  '橙色 @alifd/theme-1',
  '蓝色 @alifd/theme-2',
  '紫色 @alifd/theme-3',
  '绿色 @alifd/theme-4',
  CUSTOM_THEME_SELECT_KEY,
];

const ScaffoldConfig = ({ onChange, value }) => {
  function onFormChange(values) {
    onChange(values);
  }

  const fields = { theme: value.theme || themesList[0], config: value.config || [configsList[0].value] };
  console.log('ScaffoldConfig fields   ===>', fields);
  return (
    <div className={styles.scaffoldConfig}>
      <Form value={fields} onChange={onFormChange} labelTextAlign="left" size="medium">
        <Form.Item label={<HeaderTitle title="主题包" />}>
          <Select
            name="theme"
            placeholder="请选择主题包"
            style={{ width: '100%' }}
          >
            {themesList.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {fields.theme === CUSTOM_THEME_SELECT_KEY && (
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
