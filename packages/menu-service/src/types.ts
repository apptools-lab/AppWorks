export interface IMenuData {
  name: string;
  path: string;
  icon?: string;
  children?: IMenuData[];
}

export type MenuType = 'headerMenuConfig' | 'asideMenuConfig';
