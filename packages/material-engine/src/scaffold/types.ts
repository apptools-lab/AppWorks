export interface IBuildConfig {
  theme?: string;
}

export interface ILayoutConfig {
  headerAvatar?: boolean;
  branding?: boolean;
  footer?: boolean;
  fixedHeader?: boolean;
  type: 'light' | 'dark' | 'brand'
}
