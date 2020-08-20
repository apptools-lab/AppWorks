export interface ITemplateOptions {
  npmName: string; // @icedesign/ice-label
  name?: string; // ice-label (english and variable)
  kebabCaseName?: string; // ice-label
  npmScope?: string; // @icedesign
  title?: string; //
  description?: string;
  className?: string;
  version?: string;
  category?: string;
  // web, miniapp...
  projectTargets?: string[];
  adaptor?: boolean;
  useEjsTemplate?: boolean;
}

export interface IOptions {
  rootDir: string;
  materialTemplateDir: string;
  templateOptions: ITemplateOptions;
  enablePegasus?: boolean;
  enableDefPublish?: boolean;
  materialType: 'component' | 'block' | 'scaffold';
}
