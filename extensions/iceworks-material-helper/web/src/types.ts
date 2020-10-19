export interface IRouter {
  /**
   * URL path
   */
  path: string;

  /**
   * component name
   */
  component?: string;

  /**
   * layout name
   */
  layout?: string;

  /**
   * children routes
   */
  children?: IRouter[];
}

export interface IPageDetail {
  pageName: string;
  path?: string;
  parent?: string;
}

export interface IPageDetailForm {
  isCreating: boolean;
  visible: boolean;
  routerConfig: IRouter[];
  isConfigurableRouter: boolean;
  onSubmit: (data: IPageDetail) => void;
  onClose: () => void;
}

export interface IMenuType {
  label: string;
  value: string;
}
