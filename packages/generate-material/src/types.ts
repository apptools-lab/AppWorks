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
  miniappComponentBuildType?: 'runtime' | 'compile'; // miniapp component build type,
  miniappPluginBuildType?: 'runtime' | 'compile'; // miniapp plugin build type
  isAliInternal?: boolean;
  author?: string;
}

export interface IOptions {
  rootDir: string;
  materialTemplateDir: string;
  templateOptions: ITemplateOptions;
  enablePegasus?: boolean;
  enableDefPublish?: boolean;
  materialType: 'component' | 'block' | 'scaffold';
}
