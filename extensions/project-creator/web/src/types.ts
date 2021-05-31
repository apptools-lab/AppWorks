import { IMaterialScaffold, IMaterialSource } from '@appworks/material-utils';

interface IEjsOptions {
  targets?: string[];
  miniappType?: 'runtime' | 'compile';
  mpa?: boolean;
}

export interface IProjectField {
  projectName: string;
  projectPath: string;
  scaffold: IMaterialScaffold;
  source: IMaterialSource;
  ejsOptions?: IEjsOptions;
}

export interface IDEFProjectField extends IProjectField {
  empId: string;
  account: string;
  group: string;
  project: string;
  gitlabToken: string;
}

export interface IGitLabExistProject {
  name: string;
  id: string;
}

export interface IGitLabGroup {
  avatar_url: string;
  description: string;
  id: number;
  name: string;
  path: string;
  web_url: string;
}

export interface IScaffoldMarket {
  mainScaffolds: IMaterialScaffold[];
  otherScaffolds: IMaterialScaffold[];
}

export interface IPageDetail {
  pageName: string;
  path?: string;
  parent?: string;
}

export interface IPageDetailForm {
  isCreating: boolean;
  visible: boolean;
  onSubmit: (data: IPageDetail) => void;
  onClose: () => void;
  values: IPageDetailValue;
}

interface IPageDetailValue {
  pageName: string;
  path: string;
}

export interface IMenuType {
  label: string;
  value: string;
}
