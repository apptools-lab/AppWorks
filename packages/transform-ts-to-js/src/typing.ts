export type Action = 'none' | 'write' | 'overwrite';

export interface IBabelOption {
  decoratorsBeforeExport?: boolean;
}

export interface IOption extends IBabelOption {
  outDir?: string;
  cwd?: string;
  action?: Action;
}

export interface IFileEntity {
  sourceFilePath: string;
  targetFilePath?: string;
  data: string;
}
