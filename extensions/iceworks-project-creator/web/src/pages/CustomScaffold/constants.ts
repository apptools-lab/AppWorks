export const configsList = [
  { value: 'typescript', label: '使用 TypeScript' },
  { value: 'i18n', label: '国际化示例' },
  { value: 'auth', label: '权限管理示例' },
  { value: 'store', label: '状态管理示例' },
  { value: 'mock', label: 'Mock 示例' },
];

export const CUSTOM_THEME_SELECT_VALUE = 'customTheme';
export const CUSTOM_THEME_SELECT_LABEL = '自定义主题包';

export const themesList = [
  { value: '@alifd/theme-design-pro', label: '@alifd/theme-design-pro' },
  { value: '@alifd/theme-1', label: '橙色 @alifd/theme-1' },
  { value: '@alifd/theme-2', label: '蓝色 @alifd/theme-2' },
  { value: '@alifd/theme-3', label: '紫色 @alifd/theme-3' },
  { value: '@alifd/theme-4', label: '绿色 @alifd/theme-4' },
  { value: CUSTOM_THEME_SELECT_VALUE, label: CUSTOM_THEME_SELECT_LABEL },
];

export const layoutConfigsList = [
  { value: 'branding', label: 'Logo 组件' },
  { value: 'headerAvatar', label: '用户头像组件' },
  { value: 'footer', label: '底部组件' },
];

export type MenuType = 'aside' | 'header';
