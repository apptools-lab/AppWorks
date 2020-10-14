import React, { useState } from 'react';
import HeaderTitle from '@/components/HeaderTitle';
import { Checkbox, Radio, Input, Select } from '@alifd/next';
import styles from './index.module.scss';

const configsList = [
  { value: 'typescript', label: '使用 TypeScript' },
  { value: 'i18n', label: '国际化示例' },
  { value: 'auth', label: '权限管理示例' },
  { value: 'store', label: '状态管理示例' },
  { value: 'mock', label: 'Mock 示例' },
];

const ScaffoldConfig = () => {
  const themesList = [
    {
      label: '官方主题包',
      value: 'offical',
      component: Select,
      componentProps: {
        options: [
          { label: '@alifd/theme-design-pro', value: '@alifd/theme-design-pro' },
          { label: '橙色 @alifd/theme-1', value: '@alifd/theme-1' },
          { label: '蓝色 @alifd/theme-2', value: '@alifd/theme-2' },
          { label: '紫色 @alifd/theme-3', value: '@alifd/theme-3' },
          { label: '绿色 @alifd/theme-4', value: '@alifd/theme-4' },
        ],
      },
    },
    {
      label: '自定义主题包',
      value: 'custom',
      component: Input,
      componentProps: {},
    },
  ];
  const componentStyle = { width: '250px' };
  const [curThemeType, setCurThemeType] = useState(themesList[0].value);
  return (
    <div className={styles.scaffoldConfig}>
      <HeaderTitle title="主题包" />
      <div className={styles.content}>
        <Radio.Group itemDirection="ver" value={curThemeType} onChange={value => setCurThemeType(value)}>
          {
            themesList.map(theme => {
              return (
                <Radio value={theme.value} key={theme.value}>
                  <span className={styles.radioContent}>{theme.label}</span>
                  {
                    theme.value === 'offical' && (
                      <Select style={componentStyle} disabled={curThemeType !== theme.value}>
                        {theme.componentProps.options?.map(item => (
                          <Select.Option value={item.value}>{item.label}</Select.Option>
                        ))}
                      </Select>
                    )
                  }
                  {
                    theme.value === 'custom' && (
                      <Input style={componentStyle} disabled={curThemeType !== theme.value} placeholder="请输入自定义主题 npm 包" />
                    )
                  }
                </Radio>

              );
            })
          }
        </Radio.Group>
      </div>
      <HeaderTitle title="高级" />
      <div className={styles.content}>
        <Checkbox.Group itemDirection="ver" onChange={(value) => console.log(value)}>
          {
            configsList.map(config => (
              <Checkbox value={config.value} key={config.value}>{config.label}</Checkbox>
            ))
          }
        </Checkbox.Group>
      </div>
    </div>
  );
};

export default ScaffoldConfig;
