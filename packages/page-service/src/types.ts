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

export interface IRouterOptions {
  type?: string;
  replacement?: boolean;
  parent?: string;
}
